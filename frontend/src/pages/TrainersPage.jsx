import { useState, useEffect } from 'react';
import { FiStar, FiMail, FiPhone, FiUsers } from 'react-icons/fi';
import { trainerService } from '../services/api';
import Navbar from '../components/Navbar';

const SPEC_COLORS = {
  'Yoga & Meditation': '#a78bfa',
  'Strength Training': '#fb923c',
  'Nutrition & Diet':  '#34d399',
  'Cardio & HIIT':     '#38bdf8',
  'Pilates & Core':    '#f472b6',
};

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <FiStar key={i} style={{ color: i <= Math.round(rating) ? '#fbbf24' : 'var(--border)', fill: i <= Math.round(rating) ? '#fbbf24' : 'transparent' }} />
      ))}
      <span style={{ marginLeft: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');

  useEffect(() => {
    trainerService.getAll()
      .then(r => setTrainers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const specs = ['All', ...new Set(trainers.map(t => t.specialization))];
  const filtered = filter === 'All' ? trainers : trainers.filter(t => t.specialization === filter);

  return (
    <>
      <Navbar />
      <div style={styles.page} className="page-enter">
        <div style={styles.container}>
          <div style={styles.hero}>
            <FiUsers style={{ color: 'var(--emerald)', fontSize: '2rem' }} />
            <h1 style={styles.title}>Find Your Trainer</h1>
            <p style={styles.sub}>Connect with expert trainers to accelerate your health journey</p>
          </div>

          <div style={styles.filters}>
            {specs.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ ...styles.filterBtn, ...(filter === s ? styles.filterActive : {}) }}>
                {s}
              </button>
            ))}
          </div>

          {loading ? <div style={{ textAlign: 'center', padding: '80px' }}><div className="spinner" /></div>
          : filtered.length === 0 ? (
            <div className="empty-state"><FiUsers size={48} /><h3>No trainers available</h3></div>
          ) : (
            <div style={styles.grid}>
              {filtered.map(t => {
                const specColor = SPEC_COLORS[t.specialization] || 'var(--emerald)';
                return (
                  <div key={t.id} style={styles.trainerCard}>
                    <div style={styles.cardTop}>
                      <div style={{ ...styles.avatar, background: specColor + '20', color: specColor }}>
                        {t.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      {t.isAvailable && <span style={styles.available}>Available</span>}
                    </div>
                    <div style={styles.cardBody}>
                      <h3 style={styles.trainerName}>{t.name}</h3>
                      <span style={{ ...styles.specBadge, background: specColor + '18', color: specColor }}>
                        {t.specialization}
                      </span>
                      <StarRating rating={t.rating} />
                      {t.experienceYears && (
                        <p style={styles.experience}>{t.experienceYears} years of experience</p>
                      )}
                      {t.bio && <p style={styles.bio}>{t.bio?.substring(0, 110)}…</p>}
                    </div>
                    <div style={styles.cardFooter}>
                      {t.email && (
                        <a href={`mailto:${t.email}`} style={styles.contactBtn} className="btn-ghost">
                          <FiMail /> Email
                        </a>
                      )}
                      {t.phoneNumber && (
                        <a href={`tel:${t.phoneNumber}`} style={styles.contactBtn} className="btn-primary">
                          <FiPhone /> Contact
                        </a>
                      )}
                      {!t.email && !t.phoneNumber && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Contact info unavailable</span>
                      )}
                    </div>
                  </div>
                );
              })}
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  trainerCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' },
  cardTop: { padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' },
  available: { padding: '3px 10px', borderRadius: '99px', background: 'var(--emerald-glow)', color: 'var(--emerald)', fontSize: '0.72rem', fontWeight: 600 },
  cardBody: { padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  trainerName: { fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 },
  specBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 600, alignSelf: 'flex-start' },
  experience: { color: 'var(--text-muted)', fontSize: '0.82rem' },
  bio: { color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 },
  cardFooter: { padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' },
  contactBtn: { flex: 1, justifyContent: 'center', textDecoration: 'none', fontSize: '0.85rem' },
};