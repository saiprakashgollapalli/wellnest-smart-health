import { useEffect, useState } from "react";
import api from "../services/api";
import { FiUpload, FiEdit, FiTrash2 } from "react-icons/fi";

export default function BlogPage(){

const [blogs,setBlogs] = useState([]);
const [loading,setLoading] = useState(true);

const [showCreatePost,setShowCreatePost] = useState(false);
const [editingBlog,setEditingBlog] = useState(null);

const [newPost,setNewPost] = useState({
title:"",
content:"",
imageFile:null,
imageUrl:""
});

const [formErrors,setFormErrors] = useState({});

const [likedPosts,setLikedPosts] = useState({});
const [comments,setComments] = useState({});
const [commentInput,setCommentInput] = useState({});
const [openComment,setOpenComment] = useState({});
const [reportPostId,setReportPostId] = useState(null);

const REPORT_REASONS=[
"Spam",
"Harassment",
"False information",
"Hate speech",
"Violence",
"Other"
];

useEffect(()=>{
fetchBlogs();
},[]);

const fetchBlogs=async()=>{
try{
const res=await api.get("/blogs");
setBlogs(res.data || []);
}catch(err){
console.error(err);
}finally{
setLoading(false);
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
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    setShowCreatePost(false);
    setEditingBlog(null);

    setNewPost({
      title: "",
      content: "",
      imageFile: null,
      imageUrl: ""
    });

    fetchBlogs();

  } catch (err) {
    console.error("Create blog error:", err.response?.data || err);
  }
};
const handleEditBlog=(blog)=>{
setEditingBlog(blog);
setNewPost({
title:blog.title || "",
content:blog.content || "",
imageFile:null,
imageUrl:blog.imageUrl || ""
});
setShowCreatePost(true);
};

const handleDeleteBlog=async(id)=>{
if(!window.confirm("Delete this blog?")) return;

try{
await api.delete(`/blogs/${id}`);
fetchBlogs();
}catch(err){
console.error(err);
}
};

const toggleLike=(id)=>{

const isLiked=likedPosts[id];

setLikedPosts(prev=>({
...prev,
[id]:!prev[id]
}));

setBlogs(prev=>
prev.map(b=>
b.id===id
? {...b,likesCount:isLiked?(b.likesCount||1)-1:(b.likesCount||0)+1}
:b
)
);
};

const handleCommentSubmit=(blogId)=>{

if(!commentInput[blogId]) return;

const newComment={
text:commentInput[blogId],
date:new Date().toLocaleDateString()
};

setComments(prev=>({
...prev,
[blogId]:[...(prev[blogId]||[]),newComment]
}));

setCommentInput(prev=>({
...prev,
[blogId]:""
}));
};

return(

<div className="p-6 text-[var(--text-primary)]">

{/* HEADER */}

<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-bold">Health & Fitness</h1>

<button
onClick={()=>{setShowCreatePost(true);setEditingBlog(null);}}
className="flex items-center gap-2 px-5 py-2 rounded-lg
transition-all duration-200 font-semibold"
style={{
  background: "var(--emerald)",
  color: "#fff",
  boxShadow: "var(--shadow-card)"
}}
onMouseOver={(e)=>e.currentTarget.style.background="var(--teal)"}
onMouseOut={(e)=>e.currentTarget.style.background="var(--emerald)"}
>
＋ Create Blog
</button>

</div>

{loading && <div className="text-center mt-10 text-[var(--text-secondary)]">Loading...</div>}

{/* FEATURED ARTICLES */}

{blogs.length>0 &&(

<>
<h2 className="text-xl font-semibold mb-4">Featured Articles</h2>

<div className="grid md:grid-cols-2 gap-6 mb-8">

{blogs.slice(0,2).map(blog=>(

<div key={blog.id}
className="bg-[var(--bg-card)] rounded-xl overflow-hidden shadow hover:scale-[1.02] transition border border-[var(--border)]">

{blog.imageUrl && (
<img
src={
  blog.imageUrl.startsWith("http")
    ? blog.imageUrl
    : `http://localhost:8080${blog.imageUrl}`
}
className="w-full h-44 object-cover"
alt="blog"
/>
)}

<div className="p-4">

<h3 className="font-semibold text-lg mb-1">{blog.title}</h3>

<p className="text-sm text-[var(--text-secondary)]">
by {blog.authorName}
</p>

</div>

</div>

))}

</div>

<h2 className="text-xl font-semibold mb-4">
Community Posts
</h2>

{blogs.map(blog=>(

<div key={blog.id}
className="bg-[var(--bg-card)] p-5 rounded-xl shadow-md max-w-2xl mb-4
hover:shadow-xl hover:-translate-y-1 transition border border-[var(--border)]">

<div className="flex justify-between items-center text-sm mb-3">

<div className="flex gap-2">

<span className="font-semibold">{blog.authorName}</span>

{blog.status==="PENDING" && (
<span className="bg-yellow-500 text-xs px-2 rounded text-white">Pending</span>
)}

{blog.status==="PUBLISHED" && (
<span className="bg-green-600 text-xs px-2 rounded text-white">Approved</span>
)}

</div>

<span className="text-[var(--text-secondary)] text-xs">
{new Date(blog.createdAt).toLocaleDateString()}
</span>

</div>

<h3 className="text-lg font-semibold mb-2">{blog.title}</h3>

<p className="text-[var(--text-secondary)] text-sm">{blog.content}</p>

{blog.imageUrl && (
<img
src={blog.imageUrl.startsWith("http")
? blog.imageUrl
: `http://localhost:8080${blog.imageUrl}`}
className="w-full max-h-72 object-cover rounded-lg mt-4"
alt="blog"
/>
)}

<div className="flex gap-6 mt-4 text-sm items-center">

<button
onClick={()=>toggleLike(blog.id)}
className={`${likedPosts[blog.id]?"text-red-500":"text-[var(--text-secondary)]"}`}
>
{likedPosts[blog.id]?"❤️":"🤍"} {blog.likesCount || 0}
</button>

<button
onClick={()=>setOpenComment(prev=>({
...prev,
[blog.id]:!prev[blog.id]
}))}
>
💬 {comments[blog.id]?.length || 0}
</button>

<button
onClick={()=>setReportPostId(blog.id)}
className="text-[var(--text-secondary)] hover:text-red-400"
>
⚠ Report
</button>

{blog.status==="PENDING" && (
<button
onClick={()=>handleEditBlog(blog)}
className="flex items-center gap-1 text-blue-400">
<FiEdit/> Edit
</button>
)}

<button
onClick={()=>handleDeleteBlog(blog.id)}
className="flex items-center gap-1 text-red-400">
<FiTrash2/> Delete
</button>

</div>

{/* COMMENTS */}

{openComment[blog.id] && (

<div className="mt-3">

<input
type="text"
placeholder="Write a comment..."
value={commentInput[blog.id] || ""}
onChange={(e)=>setCommentInput({
...commentInput,
[blog.id]:e.target.value
})}
className="w-full px-3 py-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)] mb-2 text-[var(--text-primary)]"
/>

<button
onClick={()=>handleCommentSubmit(blog.id)}
className="bg-emerald-500 px-4 py-1 rounded text-white">
Post
</button>

{comments[blog.id]?.map((c,i)=>(
<div key={i} className="text-sm text-[var(--text-secondary)] mt-2">
💬 {c.text}
</div>
))}

</div>

)}

</div>

))}

</>

)}

{/* CREATE BLOG POPUP */}

{showCreatePost && (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

<div className="bg-[var(--bg-card)] w-full max-w-lg rounded-xl p-6 animate-popup border border-[var(--border)]">

<h2 className="text-xl font-semibold mb-4">
{editingBlog?"Edit Blog":"Create Blog"}
</h2>

<input
type="text"
placeholder="Title"
value={newPost.title}
onChange={(e)=>setNewPost({...newPost,title:e.target.value})}
className="w-full mb-1 p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)]"
/>

{formErrors.title && (
<p className="text-red-500 text-sm mb-2">{formErrors.title}</p>
)}

<textarea
placeholder="Description"
value={newPost.content}
onChange={(e)=>setNewPost({...newPost,content:e.target.value})}
className="w-full mb-1 p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)]"
/>

{formErrors.content && (
<p className="text-red-500 text-sm mb-2">{formErrors.content}</p>
)}

<input
type="text"
placeholder="Image URL (optional)"
value={newPost.imageUrl}
onChange={(e)=>setNewPost({...newPost,imageUrl:e.target.value})}
className="w-full mb-3 p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)]"
/>

<label className="flex items-center gap-2 bg-[var(--bg-elevated)] p-3 rounded cursor-pointer mb-2 border border-[var(--border)]">

<FiUpload/>

<span>Upload Image</span>

<input
type="file"
accept="image/*"
onChange={(e)=>setNewPost({
...newPost,
imageFile:e.target.files[0]
})}
className="hidden"
/>

</label>

{newPost.imageFile && (
<p className="text-sm text-[var(--text-secondary)] mb-3">
📎 {newPost.imageFile.name}
</p>
)}

<div className="flex justify-end gap-3">

<button
onClick={()=>setShowCreatePost(false)}
className="px-4 py-2 rounded bg-gray-500 text-white">
Cancel
</button>

<button
onClick={handleCreatePost}
className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white">
Post
</button>

</div>

</div>

</div>

)}

{/* REPORT POPUP */}

{reportPostId && (

<div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">

<div className="bg-[var(--bg-card)] w-full max-w-md rounded-t-2xl p-5 border border-[var(--border)]">

<h2 className="text-center font-semibold text-lg mb-4">
Report
</h2>

{REPORT_REASONS.map((reason,i)=>(
<button
key={i}
onClick={()=>setReportPostId(null)}
className="block w-full text-left py-2 border-b border-[var(--border)]">
{reason}
</button>
))}

<button
onClick={()=>setReportPostId(null)}
className="mt-4 w-full py-2 text-center text-[var(--text-secondary)]">
Cancel
</button>

</div>

</div>

)}

</div>

);
}