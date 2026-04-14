import { useEffect, useState } from "react";
import { sessionService, trainerService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiUser, FiAlertCircle, FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";
import toast from 'react-hot-toast';

export default function TrainerSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainerId, setTrainerId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("wellnest_user"));

  useEffect(() => {
    if (user) {
      loadTrainerIdAndSessions();
    } else {
      setLoading(false);
    }
  }, []);

  const loadTrainerIdAndSessions = async () => {
    setLoading(true);
    try {
      let foundTrainerId = null;
      
      // Method 1: Check if user has trainerId in localStorage
      if (user?.trainerId) {
        foundTrainerId = user.trainerId;
        console.log("Found trainerId from user object:", foundTrainerId);
      }
      
      // Method 2: Fetch trainer profile to get the trainer ID
      if (!foundTrainerId) {
        try {
          const profileResponse = await trainerService.getMyProfile();
          if (profileResponse.data && profileResponse.data.id) {
            foundTrainerId = profileResponse.data.id;
            console.log("Found trainerId from profile:", foundTrainerId);
          }
        } catch (err) {
          console.log("No trainer profile found");
        }
      }
      
      // Method 3: Get all trainers and find by userId
      if (!foundTrainerId) {
        const allTrainers = await trainerService.getAll();
        const currentTrainer = allTrainers.data?.find(t => t.userId == user?.userId);
        if (currentTrainer) {
          foundTrainerId = currentTrainer.id;
          console.log("Found trainerId from trainers list:", foundTrainerId);
        }
      }
      
      if (foundTrainerId) {
        setTrainerId(foundTrainerId);
        await loadSessions(foundTrainerId);
      } else {
        console.error("Could not find trainer ID for user:", user?.userId);
        toast.error("Trainer profile not found. Please complete your trainer profile.");
      }
      
    } catch (err) {
      console.error("Error loading trainer ID:", err);
      toast.error("Failed to load trainer information");
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async (id) => {
    try {
      const trainerIdToUse = id || trainerId;
      if (!trainerIdToUse) {
        console.error("No trainer ID available");
        return;
      }
      
      console.log("Loading sessions for trainerId:", trainerIdToUse);
      const response = await sessionService.getTrainerSessions(trainerIdToUse);
      console.log("Sessions loaded:", response.data);
      setSessions(response.data || []);
      
      if (response.data?.length === 0) {
        toast.success("No sessions booked yet");
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
      toast.error("Failed to load client sessions");
    }
  };

  const completeSession = async (sessionId) => {
    if (!confirm("Mark this session as completed?")) return;
    
    try {
      await sessionService.completeSession(sessionId);
      toast.success("Session marked as completed");
      await loadSessions();
    } catch (err) {
      console.error("Error completing session:", err);
      toast.error(err.response?.data?.message || "Failed to complete session");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'BOOKED':
        return { color: 'text-yellow-500 bg-yellow-500/10', icon: FiAlertCircle, text: 'Pending', canComplete: true };
      case 'COMPLETED':
        return { color: 'text-green-500 bg-green-500/10', icon: FiCheckCircle, text: 'Completed', canComplete: false };
      case 'CANCELLED':
        return { color: 'text-red-500 bg-red-500/10', icon: FiXCircle, text: 'Cancelled', canComplete: false };
      default:
        return { color: 'text-gray-500 bg-gray-500/10', icon: FiAlertCircle, text: status, canComplete: false };
    }
  };

  const refreshSessions = () => {
    loadSessions();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-[var(--text-secondary)]">Loading your sessions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Client Sessions</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            View and manage all sessions booked with you
          </p>
        </div>
        <button
          onClick={refreshSessions}
          className="btn-ghost flex items-center gap-2 px-4 py-2 rounded-xl"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {!trainerId && (
        <div className="text-center py-20 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <FiAlertCircle className="mx-auto text-4xl text-yellow-500 mb-3" />
          <h3 className="text-lg font-semibold text-yellow-500">Trainer Profile Incomplete</h3>
          <p className="text-[var(--text-secondary)] mt-2 mb-4">
            Please complete your trainer profile to start receiving bookings.
          </p>
          <button
            onClick={() => navigate('/trainer-profile')}
            className="btn-primary"
          >
            Complete Trainer Profile
          </button>
        </div>
      )}

      {trainerId && sessions.length === 0 && (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
          <FiCalendar className="mx-auto text-4xl text-[var(--text-secondary)] mb-3" />
          <h3 className="text-lg font-semibold">No sessions booked yet</h3>
          <p className="text-[var(--text-secondary)] mt-1">
            When clients book sessions with you, they'll appear here
          </p>
        </div>
      )}

      {trainerId && sessions.length > 0 && (
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
                      {session.userName || `Client #${session.userId}`}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">Client</p>
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

                {statusInfo.canComplete && (
                  <button
                    onClick={() => completeSession(session.id)}
                    className="text-green-500 hover:text-green-600 text-sm font-medium transition"
                  >
                    Mark as Completed
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