import { useEffect, useState } from "react";
import api from "../services/api";
import { FiUpload, FiEdit, FiTrash2, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, canModerate } = useAuth();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageFile: null,
    imageUrl: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [openComment, setOpenComment] = useState({});
  const [reportPostId, setReportPostId] = useState(null);

  const REPORT_REASONS = [
    "Spam",
    "Harassment",
    "False information",
    "Hate speech",
    "Violence",
    "Other"
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blogId) => {
    try {
      await api.put(`/api/trainer/blogs/${blogId}/approve`);
      toast.success("Blog approved! ✓");
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve blog");
    }
  };

  const handleReject = async (blogId) => {
    if (!confirm("Reject this blog?")) return;
    try {
      await api.put(`/api/trainer/blogs/${blogId}/reject`);
      toast.success("Blog rejected");
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject blog");
    }
  };

  const handleAdminDelete = async (blogId) => {
    if (!confirm("Delete this blog? (Admin action)")) return;
    try {
      await api.delete(`/api/admin/blogs/${blogId}`);
      toast.success("Blog deleted by admin");
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    }
  };

  const handleCreatePost = async () => {
    let errors = {};
    if (!newPost.title.trim()) errors.title = "Title is required";
    if (!newPost.content.trim()) errors.content = "Description is required";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      formData.append("category", "General");

      if (newPost.imageFile) {
        formData.append("image", newPost.imageFile);
      }
      if (newPost.imageUrl && newPost.imageUrl.trim() !== "") {
        formData.append("imageUrl", newPost.imageUrl);
      }

      await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setShowCreatePost(false);
      setEditingBlog(null);
      setNewPost({ title: "", content: "", imageFile: null, imageUrl: "" });
      fetchBlogs();
      toast.success("Blog created successfully!");
    } catch (err) {
      console.error("Create blog error:", err.response?.data || err);
      toast.error("Failed to create blog");
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setNewPost({
      title: blog.title || "",
      content: blog.content || "",
      imageFile: null,
      imageUrl: blog.imageUrl || ""
    });
    setShowCreatePost(true);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  const toggleLike = (id) => {
    const isLiked = likedPosts[id];
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    setBlogs(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, likesCount: isLiked ? (b.likesCount || 1) - 1 : (b.likesCount || 0) + 1 }
          : b
      )
    );
  };

  const handleCommentSubmit = (blogId) => {
    if (!commentInput[blogId]) return;
    const newComment = {
      text: commentInput[blogId],
      date: new Date().toLocaleDateString()
    };
    setComments(prev => ({
      ...prev,
      [blogId]: [...(prev[blogId] || []), newComment]
    }));
    setCommentInput(prev => ({ ...prev, [blogId]: "" }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return { bg: "bg-green-100", text: "text-green-800", label: "Approved" };
      case "PENDING":
        return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" };
      case "REJECTED":
        return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", label: status };
    }
  };

  return (
    <div className="p-6 text-[var(--text-primary)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Health & Fitness Blog</h1>
        <button
          onClick={() => {
            setShowCreatePost(true);
            setEditingBlog(null);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 font-semibold"
          style={{
            background: "var(--emerald)",
            color: "#fff",
            boxShadow: "var(--shadow-card)"
          }}
        >
          ＋ Create Blog
        </button>
      </div>

      {loading && <div className="text-center mt-10">Loading...</div>}

      {!loading && blogs.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-[var(--text-secondary)]">No blogs yet. Be the first to create one!</p>
        </div>
      )}

      {!loading && blogs.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {blogs.slice(0, 2).map(blog => (
              <div key={blog.id} className="bg-[var(--bg-card)] rounded-xl overflow-hidden shadow hover:scale-[1.02] transition border border-[var(--border)]">
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl.startsWith("http") ? blog.imageUrl : `http://localhost:8080${blog.imageUrl}`}
                    className="w-full h-44 object-cover"
                    alt="blog"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{blog.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">by {blog.authorName}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Community Posts</h2>

          {blogs.map(blog => {
            const statusBadge = getStatusBadge(blog.status);
            return (
              <div key={blog.id} className="bg-[var(--bg-card)] p-5 rounded-xl shadow-md max-w-2xl mb-4 hover:shadow-xl transition border border-[var(--border)]">
                <div className="flex justify-between items-center text-sm mb-3">
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">{blog.authorName}</span>
                    <span className={`${statusBadge.bg} ${statusBadge.text} text-xs px-2 py-1 rounded-full font-medium`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  <span className="text-[var(--text-secondary)] text-xs">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm whitespace-pre-wrap">{blog.content}</p>

                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl.startsWith("http") ? blog.imageUrl : `http://localhost:8080${blog.imageUrl}`}
                    className="w-full max-h-72 object-cover rounded-lg mt-4"
                    alt="blog"
                  />
                )}

                <div className="flex gap-6 mt-4 text-sm items-center flex-wrap">
                  <button onClick={() => toggleLike(blog.id)} className={likedPosts[blog.id] ? "text-red-500" : "text-[var(--text-secondary)]"}>
                    {likedPosts[blog.id] ? "❤️" : "🤍"} {blog.likesCount || 0}
                  </button>

                  <button onClick={() => setOpenComment(prev => ({ ...prev, [blog.id]: !prev[blog.id] }))}>
                    💬 {comments[blog.id]?.length || 0}
                  </button>

                  <button onClick={() => setReportPostId(blog.id)} className="text-[var(--text-secondary)] hover:text-red-400">
                    ⚠ Report
                  </button>

                  {/* EDIT & DELETE - For blog author only */}
                  {user && blog.authorId && user.id === blog.authorId && (
                    <>
                      <button onClick={() => handleEditBlog(blog)} className="flex items-center gap-1 text-blue-400 hover:text-blue-500">
                        <FiEdit size={14} /> Edit
                      </button>
                      <button onClick={() => handleDeleteBlog(blog.id)} className="flex items-center gap-1 text-red-400 hover:text-red-500">
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </>
                  )}

                  {/* MODERATION - For TRAINER/ADMIN */}
                  {canModerate && blog.status === "PENDING" && (
                    <>
                      <button onClick={() => handleApprove(blog.id)} className="flex items-center gap-1 text-green-500 hover:text-green-600">
                        <FiCheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleReject(blog.id)} className="flex items-center gap-1 text-red-500 hover:text-red-600">
                        <FiXCircle size={14} /> Reject
                      </button>
                    </>
                  )}

                  {/* ADMIN DELETE */}
                  {isAdmin && (
                    <button onClick={() => handleAdminDelete(blog.id)} className="flex items-center gap-1 text-red-600 font-semibold">
                      <FiTrash2 size={14} /> Admin Delete
                    </button>
                  )}
                </div>

                {openComment[blog.id] && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInput[blog.id] || ""}
                      onChange={e => setCommentInput({ ...commentInput, [blog.id]: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)] mb-2 text-[var(--text-primary)] text-sm"
                    />
                    <button onClick={() => handleCommentSubmit(blog.id)} className="bg-emerald-500 px-4 py-1 rounded text-white text-sm">
                      Post Comment
                    </button>
                    {comments[blog.id]?.map((c, i) => (
                      <div key={i} className="text-sm text-[var(--text-secondary)] mt-2 border-l-2 border-emerald-500 pl-2">
                        💬 {c.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* CREATE/EDIT POPUP */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-xl p-6 border border-[var(--border)]">
            <h2 className="text-xl font-semibold mb-4">{editingBlog ? "Edit Blog" : "Create Blog"}</h2>

            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full mb-1 p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)]"
            />
            {formErrors.title && <p className="text-red-500 text-sm mb-2">{formErrors.title}</p>}

            <textarea
              placeholder="Write your blog content here..."
              rows="6"
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full mb-1 p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)]"
            />
            {formErrors.content && <p className="text-red-500 text-sm mb-2">{formErrors.content}</p>}

            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newPost.imageUrl}
              onChange={e => setNewPost({ ...newPost, imageUrl: e.target.value })}
              className="w-full mb-3 p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)]"
            />

            <label className="flex items-center gap-2 bg-[var(--bg-elevated)] p-3 rounded cursor-pointer mb-2 border border-[var(--border)]">
              <FiUpload />
              <span className="text-sm">Upload Image</span>
              <input type="file" accept="image/*" onChange={e => setNewPost({ ...newPost, imageFile: e.target.files[0] })} className="hidden" />
            </label>

            {newPost.imageFile && <p className="text-sm text-[var(--text-secondary)] mb-3">📎 {newPost.imageFile.name}</p>}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowCreatePost(false); setEditingBlog(null); setFormErrors({}); }} className="px-4 py-2 rounded bg-gray-500 text-white">
                Cancel
              </button>
              <button onClick={handleCreatePost} className="px-4 py-2 rounded bg-emerald-500 text-white">
                {editingBlog ? "Update" : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT POPUP */}
      {reportPostId && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
          <div className="bg-[var(--bg-card)] w-full max-w-md rounded-t-2xl p-5">
            <h2 className="text-center font-semibold text-lg mb-4">Report Post</h2>
            {REPORT_REASONS.map((reason, i) => (
              <button key={i} onClick={() => setReportPostId(null)} className="block w-full text-left py-2 px-3 border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]">
                {reason}
              </button>
            ))}
            <button onClick={() => setReportPostId(null)} className="mt-4 w-full py-2 text-center hover:text-red-400">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}