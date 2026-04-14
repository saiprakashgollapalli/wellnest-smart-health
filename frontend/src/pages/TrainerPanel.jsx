import { useState, useEffect } from 'react';
import { FiAward, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { trainerService } from '../services/api';
import toast from 'react-hot-toast';

/**
 * TrainerPanel – TRAINER-only page for blog moderation.
 * UPDATED: Removed Navbar since it's inside Layout
 */
export default function TrainerPanel() {
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const fetchPendingBlogs = () => {
    setLoading(true);
    trainerService.getPendingBlogs()
      .then(r => setPendingBlogs(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    try {
      await trainerService.approveBlog(id);
      toast.success('Blog approved! ✓');
      fetchPendingBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve blog');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this blog?')) return;
    try {
      await trainerService.rejectBlog(id);
      toast.success('Blog rejected');
      fetchPendingBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject blog');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <FiAward className="text-blue-400 text-3xl" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Trainer Moderation</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Review and approve blog submissions</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 bg-[var(--bg-elevated)] rounded px-6 py-4">
          <span className="text-3xl font-bold text-yellow-500">{pendingBlogs.length}</span>
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Pending</span>
        </div>
      </div>

      {/* Pending Blogs */}
      {loading ? (
        <div className="text-center py-20">
          <div className="spinner" />
        </div>
      ) : pendingBlogs.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
          <FiCheckCircle className="mx-auto text-4xl text-[var(--text-secondary)] mb-3" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">No pending blogs</h3>
          <p className="text-[var(--text-secondary)] text-sm mt-1">All submissions have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBlogs.map(blog => (
            <div key={blog.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{blog.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    by <strong>{blog.authorName}</strong> · {blog.category} · {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <FiAlertCircle size={12} /> PENDING
                </span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {blog.content?.substring(0, 250)}…
              </p>
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2 text-sm"
                  onClick={() => handleApprove(blog.id)}
                >
                  <FiCheckCircle /> Approve
                </button>
                <button 
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2 text-sm"
                  onClick={() => handleReject(blog.id)}
                >
                  <FiXCircle /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}