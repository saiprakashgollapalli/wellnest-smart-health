import { useEffect, useState } from "react";
import { sessionService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiUser, FiAlertCircle, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";
import toast from 'react-hot-toast';

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("wellnest_user"));

  useEffect(() => {
    if (user?.userId) {
      loadSessions();
    } else {
      setLoading(false);
    }
  }, []);

  const loadSessions = async () => {
    try {
      console.log("Loading sessions for userId:", user.userId);
      const response = await sessionService.getUserSessions(user.userId);
      console.log("Sessions loaded:", response.data);
      setSessions(response.data || []);
    } catch (err) {
      console.error("Error loading sessions:", err);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId) => {
    if (!confirm("Are you sure you want to cancel this session?")) return;
    
    try {
      await sessionService.cancelSession(sessionId);
      toast.success("Session cancelled successfully");
      loadSessions();
    } catch (err) {
      console.error("Error cancelling session:", err);
      toast.error(err.response?.data?.message || "Failed to cancel session");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'BOOKED':
        return { color: 'text-yellow-500 bg-yellow-500/10', icon: FiAlertCircle, text: 'Booked', canCancel: true };
      case 'COMPLETED':
        return { color: 'text-green-500 bg-green-500/10', icon: FiCheckCircle, text: 'Completed', canCancel: false };
      case 'CANCELLED':
        return { color: 'text-red-500 bg-red-500/10', icon: FiXCircle, text: 'Cancelled', canCancel: false };
      default:
        return { color: 'text-gray-500 bg-gray-500/10', icon: FiAlertCircle, text: status, canCancel: false };
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading your sessions...</div>;
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Training Sessions</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            View and manage all your booked training sessions
          </p>
        </div>
        <button
          onClick={() => navigate('/trainers')}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl"
        >
          <FiPlus /> Book New Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
          <FiCalendar className="mx-auto text-4xl text-[var(--text-secondary)] mb-3" />
          <h3 className="text-lg font-semibold">No sessions booked yet</h3>
          <p className="text-[var(--text-secondary)] mt-1">
            Browse trainers and book your first session
          </p>
          <button
            onClick={() => navigate('/trainers')}
            className="btn-primary mt-4"
          >
            Browse Trainers
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => {
            const statusInfo = getStatusBadge(session.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={session.id}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {session.trainerName || `Trainer #${session.trainerId}`}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">Personal Trainer</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                    <StatusIcon size={12} /> {statusInfo.text}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-[var(--emerald)]" />
                    <span>{session.sessionDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-[var(--emerald)]" />
                    <span>{session.sessionTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUser className="text-[var(--emerald)]" />
                    <span>Session ID: #{session.id}</span>
                  </div>
                </div>

                {statusInfo.canCancel && (
                  <button
                    onClick={() => cancelSession(session.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                  >
                    Cancel Session
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}