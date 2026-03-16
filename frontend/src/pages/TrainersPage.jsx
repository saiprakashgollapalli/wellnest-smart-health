import { useState, useEffect } from "react";
import { FiStar, FiMail, FiPhone, FiUsers, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { trainerService } from "../services/api";

const SPEC_COLORS = {
  "Yoga & Meditation": "#a78bfa",
  "Strength Training": "#fb923c",
  "Nutrition & Diet": "#34d399",
  "Cardio & HIIT": "#38bdf8",
  "Pilates & Core": "#f472b6",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-[4px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          style={{
            color: i <= Math.round(rating) ? "#fbbf24" : "#334155",
            fill: i <= Math.round(rating) ? "#fbbf24" : "transparent",
          }}
        />
      ))}

      <span className="ml-[4px] text-[0.85rem] text-[var(--text-secondary)] font-semibold">
        {rating?.toFixed(1)}
      </span>
    </div>
  );
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    trainerService
      .getAll()
      .then((r) => setTrainers(r.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const specs = ["All", ...new Set(trainers.map((t) => t.specialization))];

  const filtered =
    filter === "All"
      ? trainers
      : trainers.filter((t) => t.specialization === filter);

  return (
    <div className="min-h-[calc(100vh-64px)] px-[24px] py-[40px]">

      <div className="max-w-[1100px] mx-auto flex flex-col gap-[32px]">

        {/* HERO */}

        <div className="flex flex-col items-center text-center gap-[12px]">

          <FiUsers className="text-[var(--emerald)] text-[2rem]" />

          <h1 className="font-display text-[2.4rem] font-bold">
            Find Your Trainer
          </h1>

          <p className="text-[var(--text-secondary)] max-w-[500px]">
            Connect with expert trainers to accelerate your health journey
          </p>

        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap justify-center gap-[8px]">

          {specs.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-[18px] py-[8px] rounded-full text-[0.85rem] font-medium border-[1.5px] transition
              ${
                filter === s
                  ? "border-[var(--emerald)] text-[var(--emerald)] bg-[var(--emerald-glow)]"
                  : "border-[var(--border)] text-[var(--text-secondary)]"
              }`}
            >
              {s}
            </button>
          ))}

        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="text-center py-[80px]">
            Loading trainers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-[80px]">
            <FiUsers size={48} className="mx-auto mb-3" />
            <h3>No trainers available</h3>
          </div>
        ) : (
          <div className="grid gap-[20px] grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">

            {filtered.map((t) => {
              const specColor =
                SPEC_COLORS[t.specialization] || "var(--emerald)";

              return (
                <div
                  key={t.id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] flex flex-col overflow-hidden hover:scale-[1.03] hover:shadow-lg transition duration-300"
                >
                  {/* CARD HEADER */}

                  <div className="px-[24px] pt-[24px] flex justify-between items-start">

                    <div
                      className="w-[60px] h-[60px] rounded-full flex items-center justify-center font-bold text-[1.2rem]"
                      style={{
                        background: specColor + "20",
                        color: specColor,
                      }}
                    >
                      {t.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </div>

                    {t.available && (
                      <span className="px-[10px] py-[3px] rounded-full bg-[var(--emerald-glow)] text-[var(--emerald)] text-[0.72rem] font-semibold">
                        Available
                      </span>
                    )}
                  </div>

                  {/* BODY */}

                  <div className="px-[24px] py-[16px] flex flex-col gap-[10px] flex-1">

                    <h3 className="font-display text-[1.1rem] font-bold">
                      {t.name}
                    </h3>

                    <span
                      className="px-[12px] py-[4px] rounded-full text-[0.78rem] font-semibold self-start"
                      style={{
                        background: specColor + "18",
                        color: specColor,
                      }}
                    >
                      {t.specialization}
                    </span>

                    <StarRating rating={t.rating} />

                    <p className="text-[0.82rem] text-[var(--text-muted)]">
                      {t.experienceYears} years of experience
                    </p>

                    <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                      {t.bio?.substring(0, 100)}...
                    </p>
                  </div>

                  {/* FOOTER */}

                  <div className="px-[24px] py-[16px] border-t border-[var(--border)] flex gap-[8px]">

                    <button
                      onClick={() => navigate(`/trainers/${t.id}`)}
                      className="btn-primary flex-1 flex items-center justify-center gap-[6px]"
                    >
                      View Profile <FiArrowRight />
                    </button>

                    {t.phoneNumber && (
                      <a
                        href={`tel:${t.phoneNumber}`}
                        className="btn-ghost flex items-center justify-center px-[10px]"
                      >
                        <FiPhone />
                      </a>
                    )}

                    {t.email && (
                      <a
                        href={`mailto:${t.email}`}
                        className="btn-ghost flex items-center justify-center px-[10px]"
                      >
                        <FiMail />
                      </a>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}