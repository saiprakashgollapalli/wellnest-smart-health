import { useState, useEffect } from 'react';
import { sessionService, trainerService } from '../services/api';
import { FiUsers, FiCalendar, FiClock, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TrainerDashboard() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("wellnest_user"));

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      let foundTrainerId = user?.trainerId || localStorage.getItem('trainer_id');
      if (foundTrainerId === 'null' || foundTrainerId === 'undefined') foundTrainerId = null;
      
      if (!foundTrainerId) {
        try {
          const profileResponse = await trainerService.getMyProfile();
          if (profileResponse.data && profileResponse.data.id) {
            foundTrainerId = profileResponse.data.id;
          }
        } catch (err) {
          console.log("No trainer profile found");
        }
      }
      
      if (!foundTrainerId) {
        console.error("No trainer ID found");
        setLoading(false);
        return;
      }
      
      // Use the newly created clients endpoint
      const response = await sessionService.getClientList(foundTrainerId);
      setClients(response.data || []);
    } catch (err) {
      console.error("Error loading sessions:", err);
      toast.error("Failed to load client sessions");
    } finally {
      setLoading(false);
    }
  };

  // Using backend-provided client list directly

  if (loading) {
    return <div className="text-center py-20">Loading your clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Clients</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Users who have booked sessions with you
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
          <FiUsers className="mx-auto text-4xl text-[var(--text-secondary)] mb-3" />
          <h3 className="text-lg font-semibold">No clients yet</h3>
          <p className="text-[var(--text-secondary)] mt-1">
            When users book sessions with you, they'll appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.userId}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-900/20"
            >
              {/* Client Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {client.userName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">{client.userName}</h3>
                  <p className="text-sm text-emerald-500 font-medium">
                    {client.totalSessions} Total Sessions
                  </p>
                </div>
              </div>

              {/* Session Meta */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)] flex items-center gap-2">
                    <FiCalendar /> Last Session
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {client.lastSessionDate || "Pending / No date"}
                  </span>
                </div>
              </div>

              {/* Progress Placeholder */}
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-primary)] font-medium">Client Progress</span>
                  <span className="text-emerald-500 font-medium">In Progress</span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/2 rounded-full" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  View full progress tracking (Coming Soon)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}