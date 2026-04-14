import { useState, useEffect } from "react";
import { FiStar, FiMail, FiPhone, FiUsers, FiArrowRight, FiSearch, FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { trainerService } from "../services/api";
import toast from 'react-hot-toast';

// Helper function to get random avatar colors
const getAvatarColor = (name) => {
  const colors = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-cyan-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-blue-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600'
  ];
  const index = name ? name.length % colors.length : 0;
  return colors[index];
};

// Star Rating Component
function StarRating({ rating, size = "md" }) {
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = (rating || 0) - fullStars >= 0.5;
  const sizeClass = size === "sm" ? "text-xs" : "text-sm";
  
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          className={`${sizeClass} ${
            i <= fullStars ? "text-yellow-400 fill-yellow-400" :
            i === fullStars + 1 && hasHalfStar ? "text-yellow-400" : "text-gray-600"
          }`}
        />
      ))}
      <span className="ml-[6px] text-[0.8rem] text-[var(--text-secondary)] font-medium">
        {rating?.toFixed(1) || "New"}
      </span>
    </div>
  );
}

// Trainer Card Component
function TrainerCard({ trainer, onClick }) {
  const avatarColor = getAvatarColor(trainer.name);
  const initials = trainer.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "TR";
  
  return (
    <div className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      {/* Card Header with Avatar */}
      <div className="relative h-32 bg-gradient-to-r from-emerald-900/40 to-teal-900/40">
        <div className="absolute -bottom-8 left-6">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg border-4 border-[var(--bg-card)]`}>
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
        </div>
        {trainer.isAvailable && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-white shadow-md">
            Available
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="pt-12 px-5 pb-5 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-emerald-400 transition">
            {trainer.name}
          </h3>
          {trainer.title && (
            <p className="text-sm text-emerald-500 font-medium mt-0.5">{trainer.title}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
            {trainer.specialization}
          </span>
          {trainer.experienceYears && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)] flex items-center gap-1">
              <FiBriefcase size={10} /> {trainer.experienceYears} yrs
            </span>
          )}
        </div>

        <StarRating rating={trainer.rating} />

        {trainer.bio && (
          <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {trainer.bio.length > 100 ? trainer.bio.substring(0, 100) + "..." : trainer.bio}
          </p>
        )}

        {trainer.servicesOffered && (
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <FiBriefcase size={10} />
            <span className="truncate">{trainer.servicesOffered.substring(0, 60)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex-1 btn-primary py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group/btn"
          >
            View Profile <FiArrowRight className="group-hover/btn:translate-x-1 transition" />
          </button>
          <div className="flex gap-1">
            {trainer.phoneNumber && (
              <a
                href={`tel:${trainer.phoneNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-emerald-500/20 text-[var(--text-secondary)] hover:text-emerald-400 transition"
                title="Call"
              >
                <FiPhone size={16} />
              </a>
            )}
            {trainer.email && (
              <a
                href={`mailto:${trainer.email}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-emerald-500/20 text-[var(--text-secondary)] hover:text-emerald-400 transition"
                title="Email"
              >
                <FiMail size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Trainers Page Component
export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    try {
      // Try to get enhanced profiles first
      const response = await trainerService.getAllProfiles();
      if (response.data && response.data.length > 0) {
        setTrainers(response.data);
      } else {
        // Fallback to old endpoint
        const fallbackResponse = await trainerService.getAll();
        setTrainers(fallbackResponse.data || []);
      }
    } catch (err) {
      console.error("Error loading trainers:", err);
      toast.error("Failed to load trainers");
      // Fallback to old endpoint
      try {
        const fallbackResponse = await trainerService.getAll();
        setTrainers(fallbackResponse.data || []);
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...trainers];
    
    // Apply specialization filter
    if (filter !== "All") {
      result = result.filter((t) => t.specialization === filter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => 
        t.name?.toLowerCase().includes(query) ||
        t.title?.toLowerCase().includes(query) ||
        t.specialization?.toLowerCase().includes(query) ||
        t.servicesOffered?.toLowerCase().includes(query) ||
        t.bio?.toLowerCase().includes(query)
      );
    }
    
    setFilteredTrainers(result);
  }, [filter, searchQuery, trainers]);

  const specializations = ["All", ...new Set(trainers.map((t) => t.specialization).filter(Boolean))];

  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-8">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
            <FiUsers className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Find Your Perfect Trainer
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
            Connect with expert trainers to accelerate your health journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-6">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by name, specialization, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
        </div>

        {/* Filter Toggle & Filters */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-emerald-400 transition"
          >
            <span>{showFilters ? "Hide" : "Show"} Filters</span>
            <svg className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFilters && (
            <div className="flex flex-wrap justify-center gap-2 animate-fadeIn">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setFilter(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === spec
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-emerald-500 hover:text-emerald-400"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            Found <span className="text-emerald-400 font-semibold">{filteredTrainers.length}</span> trainer(s)
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-emerald-400 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Loading trainers...</p>
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)]">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <FiUsers className="text-3xl text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trainers found</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : "No trainers available at the moment"}
            </p>
            {(searchQuery || filter !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilter("All");
                }}
                className="btn-primary px-6 py-2 rounded-xl"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id || trainer.userId}
                trainer={trainer}
                onClick={() => navigate(`/trainers/${trainer.userId || trainer.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add animation keyframes if not present */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}