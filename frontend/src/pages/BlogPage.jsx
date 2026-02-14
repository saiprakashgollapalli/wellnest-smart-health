import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiClock, FiUser, FiTag } from 'react-icons/fi';
import { blogService } from '../services/api';
import Navbar from '../components/Navbar';

const CATEGORY_COLORS = {
  Nutrition: '#34d399', Fitness: '#38bdf8', Sleep: '#a78bfa',
  'Mental Health': '#f472b6', General: '#fb923c',
};

export default function BlogPage() {
  const [blogs, setBlogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');

  const categories = ['All', ...Object.keys(CATEGORY_COLORS)];

  useEffect(() => {
    blogService.getAll()
      .then(r => setBlogs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? blogs : blogs.filter(b => b.category === filter);

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>
          <div style={styles.hero}>
            <FiBook style={{ color: 'var(--emerald)', fontSize: '2rem' }} />
            <h1 style={styles.title}>Health Blog</h1>
            <p style={styles.sub}>Expert insights on fitness, nutrition, and well-being</p>
          </div>

          {/* Category Filter */}
          <div style={styles.filters}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                style={{ ...styles.filterBtn, ...(filter === c ? styles.filterActive : {}) }}>
                {c}
              </button>
            ))}
          </div>

          {loading ? <div style={{ textAlign: 'center', padding: '80px 0' }}><div className="spinner" /></div>
          : filtered.length === 0 ? (
            <div className="empty-state"><FiBook size={48} /><h3>No articles found</h3></div>
          ) : (
            <div style={styles.grid}>
              {filtered.map(b => (
                <Link to={`/blogs/${b.id}`} key={b.id} style={styles.blogCard}>
                  {b.thumbnailUrl && <img src={b.thumbnailUrl} alt={b.title} style={styles.thumbnail} />}
                  {!b.thumbnailUrl && (
                    <div style={{ ...styles.placeholder, background: CATEGORY_COLORS[b.category] + '20' }}>
                      <FiBook style={{ fontSize: '2rem', color: CATEGORY_COLORS[b.category] || 'var(--emerald)' }} />
                    </div>
                  )}
                  <div style={styles.cardBody}>
                    <div style={styles.cardMeta}>
                      <span style={{ ...styles.catBadge, background: (CATEGORY_COLORS[b.category] || 'var(--emerald)') + '20', color: CATEGORY_COLORS[b.category] || 'var(--emerald)' }}>
                        <FiTag size={10} /> {b.category}
                      </span>
                    </div>
                    <h3 style={styles.blogTitle}>{b.title}</h3>
                    <p style={styles.excerpt}>{b.content?.substring(0, 120)}…</p>
                    <div style={styles.cardFooter}>
                      <span style={styles.meta}><FiUser size={12} /> {b.authorName || 'WellNest Team'}</span>
                      <span style={styles.meta}><FiClock size={12} /> {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', padding: '40px 24px' },
  container: { maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' },
  hero: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700 },
  sub: { color: 'var(--text-secondary)', maxWidth: '500px' },
  filters: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
  filterBtn: { padding: '8px 18px', borderRadius: '99px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-display)' },
  filterActive: { borderColor: 'var(--emerald)', color: 'var(--emerald)', background: 'var(--emerald-glow)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  blogCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' },
  thumbnail: { width: '100%', height: '180px', objectFit: 'cover' },
  placeholder: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  cardMeta: { display: 'flex', gap: '8px' },
  catBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 },
  blogTitle: { fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.35 },
  excerpt: { color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' },
  meta: { display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.78rem' },
};