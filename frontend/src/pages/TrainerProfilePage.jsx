import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiStar, FiMail, FiPhone, FiArrowLeft, FiBriefcase, FiClock, FiCheckCircle, FiCalendar } from "react-icons/fi";
import { trainerService, reviewService, sessionService } from "../services/api";
import toast from 'react-hot-toast';

export default function TrainerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking states
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("wellnest_user"));
  const isTrainerViewing = user?.role === "TRAINER" && user?.userId == id;

  useEffect(() => {
    loadTrainerData();
  }, [id]);

  const loadTrainerData = async () => {
    setLoading(true);
    try {
      // Try to get trainer profile first (enhanced data)
      const profileResponse = await trainerService.getAllProfiles();
      const trainerProfile = profileResponse.data?.find(p => p.userId == id || p.id == id);
      
      if (trainerProfile) {
        setProfile(trainerProfile);
        setTrainer(trainerProfile);
      } else {
        // Fallback to old trainer endpoint
        const trainerResponse = await trainerService.getById(id);
        setTrainer(trainerResponse.data);
      }
      
      // Load reviews
      await loadReviews();
      
    } catch (err) {
      console.error("Error loading trainer:", err);
      toast.error("Failed to load trainer profile");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewService.getByTrainer(id);
      setReviews(response.data || []);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
    }
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (!user || !user.userId) {
      toast.error("Please login to submit a review");
      navigate('/login');
      return;
    }

    if (user.userId == id) {
      toast.error("You cannot review yourself");
      return;
    }

    setSubmittingReview(true);

    try {
      await reviewService.create(id, user.userId, {
        rating,
        comment
      });

      setComment("");
      setRating(5);
      await loadReviews();
      toast.success("Review submitted successfully!");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const bookSession = async () => {
    if (!sessionDate || !sessionTime) {
      toast.error("Please select date and time");
      return;
    }

    if (!user || !user.userId) {
      toast.error("Please login to book a session");
      navigate('/login');
      return;
    }

    if (user.userId == id) {
      toast.error("You cannot book a session with yourself");
      return;
    }

    // Validate date is not in past
    const selectedDate = new Date(sessionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error("Please select a future date");
      return;
    }

    setBookingLoading(true);

    try {
      const trainerId = profile?.userId || trainer?.id || id;
      
      const bookingData = {
        trainerId: trainerId,
        userId: user.userId,
        sessionDate: sessionDate,
        sessionTime: sessionTime
      };
      
      console.log("Booking session:", bookingData);
      
      const response = await sessionService.book(bookingData);
      
      console.log("Booking response:", response.data);
      
      toast.success("Session booked successfully!");
      
      setSessionDate("");
      setSessionTime("");
      
      setTimeout(() => {
        if (window.confirm("Session booked! Would you like to view your sessions?")) {
          navigate("/sessions");
        }
      }, 1000);
      
    } catch (err) {
      console.error("Booking error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to book session";
      toast.error(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-[var(--text-secondary)]">Loading trainer profile...</p>
      </div>
    );
  }

  if (!trainer && !profile) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-secondary)]">Trainer not found</p>
        <button onClick={() => navigate('/trainers')} className="btn-primary mt-4">
          Back to Trainers
        </button>
      </div>
    );
  }

  const displayData = profile || trainer;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/trainers')}
        className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 mb-6 transition"
      >
        <FiArrowLeft /> Back to Trainers
      </button>

      {/* TRAINER HEADER */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {displayData.name?.charAt(0) || "T"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{displayData.name}</h1>
            {displayData.title && (
              <p className="text-emerald-500 font-medium mt-1">{displayData.title}</p>
            )}
            <p className="text-[var(--text-secondary)]">{displayData.specialization}</p>
            <div className="flex gap-4 mt-2">
              {displayData.experienceYears && (
                <p className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                  <FiBriefcase size={14} /> {displayData.experienceYears} years experience
                </p>
              )}
              {displayData.isAvailable && (
                <p className="text-sm text-emerald-500 flex items-center gap-1">
                  <FiCheckCircle size={14} /> Available for booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT / BIO */}
      {displayData.bio && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">About Me</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">{displayData.bio}</p>
        </div>
      )}

      {/* SERVICES OFFERED */}
      {displayData.servicesOffered && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Services Offered</h2>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-[var(--text-secondary)]">{displayData.servicesOffered}</p>
          </div>
        </div>
      )}

      {/* CONTACT INFO */}
      <div className="flex gap-3 mb-10">
        {displayData.email && (
          <a
            href={`mailto:${displayData.email}`}
            className="btn-ghost flex items-center gap-2 px-4 py-2 rounded-xl"
          >
            <FiMail /> Email
          </a>
        )}
        {displayData.phoneNumber && (
          <a
            href={`tel:${displayData.phoneNumber}`}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl"
          >
            <FiPhone /> Call
          </a>
        )}
      </div>

      {/* ===== REVIEWS SECTION ===== */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Client Reviews</h2>
        
        {reviews.length === 0 && (
          <p className="text-[var(--text-muted)] mb-4">No reviews yet. Be the first to review!</p>
        )}
        
        <div className="flex flex-col gap-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <FiStar
                    key={i}
                    className={i <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{r.user?.name || "Anonymous"}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ADD REVIEW FORM ===== */}
      {user && user.role !== "TRAINER" && user?.userId != id && (
        <div className="mb-10 p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Write a Review</h2>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => (
              <FiStar
                key={i}
                onClick={() => setRating(i)}
                className={`cursor-pointer transition text-2xl ${
                  i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this trainer..."
            className="w-full border border-[var(--border)] rounded-xl p-3 mb-3 bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none"
            rows="3"
          />
          <button 
            onClick={submitReview} 
            disabled={submittingReview}
            className="btn-primary px-6 py-2 rounded-xl disabled:opacity-50"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* ===== BOOK SESSION SECTION ===== */}
      {user && user.role !== "TRAINER" && user?.userId != id && (
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <h2 className="text-lg font-semibold mb-4">Book a Session</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm text-[var(--text-muted)] mb-1">Select Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-[var(--border)] rounded-xl p-2 bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm text-[var(--text-muted)] mb-1">Select Time</label>
              <input
                type="time"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl p-2 bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <button
            onClick={bookSession}
            disabled={bookingLoading}
            className="btn-primary px-6 py-2 rounded-xl disabled:opacity-50 flex items-center gap-2"
          >
            <FiCalendar size={16} />
            {bookingLoading ? "Booking..." : "Book Session"}
          </button>
        </div>
      )}

      {/* Warning for trainers with incomplete profile */}
      {isTrainerViewing && !profile?.title && (
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-yellow-500 text-sm">
            Your trainer profile is incomplete. 
            <button onClick={() => navigate('/trainer-profile')} className="underline ml-2">
              Click here to complete it
            </button>
          </p>
        </div>
      )}
    </div>
  );
}