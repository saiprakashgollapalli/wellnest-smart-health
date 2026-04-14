import { useState, useEffect } from 'react';
import { FiShield, FiCheckCircle, FiXCircle, FiTrash2, FiUsers, FiBook } from 'react-icons/fi';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const res = await adminService.getPendingBlogs();
        setPendingBlogs(res.data || []);
      } else if (activeTab === 'users') {
        const res = await adminService.getUsers();
        setUsers(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveBlog(id);
      toast.success('Blog approved');
      fetchData();
    } catch (err) {
      toast.error('Failed to approve blog');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this blog?')) return;
    try {
      await adminService.rejectBlog(id);
      toast.success('Blog rejected');
      fetchData();
    } catch (err) {
      toast.error('Failed to reject blog');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Delete this blog permanently?')) return;
    try {
      await adminService.deleteBlog(id);
      toast.success('Blog deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === user?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <FiShield className="text-purple-400 text-3xl" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
            <p className="text-[var(--text-secondary)] text-sm">Full system control and moderation</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'pending'
                ? 'border-b-2 border-emerald-500 text-emerald-500'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FiBook className="inline mr-2" /> Pending Blogs ({pendingBlogs.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'users'
                ? 'border-b-2 border-emerald-500 text-emerald-500'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FiUsers className="inline mr-2" /> Users ({users.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingBlogs.length === 0 ? (
                <div className="text-center py-20 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                  <FiCheckCircle className="mx-auto text-4xl text-[var(--text-secondary)] mb-3" />
                  <p className="text-[var(--text-secondary)]">No pending blogs to moderate</p>
                </div>
              ) : (
                pendingBlogs.map(blog => (
                  <div key={blog.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{blog.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                          By {blog.authorName} | {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm mt-3">{blog.content?.substring(0, 200)}...</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => handleApprove(blog.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg" title="Approve">
                          <FiCheckCircle size={20} />
                        </button>
                        <button onClick={() => handleReject(blog.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Reject">
                          <FiXCircle size={20} />
                        </button>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Delete">
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border)]">
                  <tr>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]">
                      <td className="py-3 px-4 font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-sm">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'TRAINER' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {u.role !== 'ADMIN' && (
                          <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700">
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}