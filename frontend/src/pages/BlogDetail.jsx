import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock } from 'react-icons/fi';
import { blogService } from '../services/api';
import Navbar from '../components/Navbar';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getById(id)
      .then(r => setBlog(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>
          <Link to="/blogs" style={styles.back}><FiArrowLeft /> Back to Blog</Link>
          {loading ? <div style={{ textAlign: 'center', padding: '80px' }}><div className="spinner" /></div>
          : !blog ? <p style={{ color: 'var(--text-muted)' }}>Blog not found.</p>
          : (
            <article style={styles.article}>
              <div style={styles.meta}>
                <span className="badge badge-emerald">{blog.category}</span>
                <span style={styles.metaText}><FiUser size={12} /> {blog.authorName || 'WellNest Team'}</span>
                <span style={styles.metaText}><FiClock size={12} /> {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
              </div>
              <h1 style={styles.title}>{blog.title}</h1>
              <div style={styles.content}>
                {blog.content?.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', padding: '40px 24px' },
  container: { maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s' },
  article: { display: 'flex', flexDirection: 'column', gap: '20px' },
  meta: { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' },
  metaText: { display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.82rem' },
  title: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, lineHeight: 1.2 },
  content: { display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' },
};