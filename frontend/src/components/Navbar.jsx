import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiActivity, FiLogOut, FiUser, FiMenu, FiX, FiShield, FiAward } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Base navigation links (visible to all authenticated users)
const BASE_NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/workouts',  label: 'Workouts' },
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/sleep',     label: 'Sleep' },
  { to: '/blogs',     label: 'Blog' },
  { to: '/trainers',  label: 'Trainers' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, canModerate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Build navigation links based on user role
  const getNavLinks = () => {
    const links = [...BASE_NAV_LINKS];
    
    // Add role-specific links
    if (isAdmin) {
      links.push({ to: '/admin', label: 'Admin Panel', icon: <FiShield /> });
    } else if (canModerate) {
      links.push({ to: '/trainer', label: 'Trainer Panel', icon: <FiAward /> });
    }
    
    return links;
  };

  const NAV_LINKS = getNavLinks();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={styles.logo}>
          <FiActivity style={{ color: 'var(--emerald)', fontSize: '1.4rem' }} />
          <span style={styles.logoText}>WellNest</span>
        </Link>

        {/* Desktop Nav */}
        <ul style={styles.navList}>
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                style={{
                  ...styles.navLink,
                  ...(isActive(link.to) ? styles.navLinkActive : {}),
                }}
              >
                {link.icon && <span style={{ marginRight: '6px', fontSize: '1rem' }}>{link.icon}</span>}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div style={styles.right}>
          {isAuthenticated ? (
            <>
              <Link to="/profile-setup" style={styles.userBtn}>
                <FiUser />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {user?.role}
                  </span>
                </div>
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button style={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{ ...styles.mobileLink, ...(isActive(link.to) ? styles.mobileLinkActive : {}) }}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon && <span style={{ marginRight: '8px' }}>{link.icon}</span>}
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={styles.mobileLogout}>
              <FiLogOut /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(13, 17, 23, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
  },
  inner: {
    maxWidth: '1280px', margin: '0 auto',
    padding: '0 24px', height: '64px',
    display: 'flex', alignItems: 'center', gap: '24px',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    textDecoration: 'none',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '1.2rem',
    color: 'var(--text-primary)',
  },
  navList: {
    display: 'flex', alignItems: 'center', gap: '4px',
    listStyle: 'none', flex: 1,
    '@media(maxWidth:768px)': { display: 'none' },
  },
  navLink: {
    display: 'flex', alignItems: 'center',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.88rem', fontWeight: 500,
    color: 'var(--text-secondary)',
    transition: 'color 0.2s, background 0.2s',
    textDecoration: 'none',
  },
  navLinkActive: {
    color: 'var(--emerald)',
    background: 'var(--emerald-glow)',
  },
  right: { display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' },
  userBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '7px 14px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    textDecoration: 'none',
    transition: 'border-color 0.2s',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '36px', height: '36px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'color 0.2s, border-color 0.2s',
    fontSize: '1rem',
  },
  mobileToggle: {
    display: 'none', fontSize: '1.3rem',
    background: 'transparent', color: 'var(--text-primary)',
    padding: '4px', cursor: 'pointer',
  },
  mobileMenu: {
    padding: '12px 24px 20px',
    display: 'flex', flexDirection: 'column', gap: '4px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-card)',
  },
  mobileLink: {
    display: 'flex', alignItems: 'center',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: 500,
    textDecoration: 'none',
  },
  mobileLinkActive: { color: 'var(--emerald)', background: 'var(--emerald-glow)' },
  mobileLogout: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 14px', marginTop: '8px',
    color: 'var(--red)', background: 'transparent',
    fontSize: '0.95rem', fontWeight: 500,
    cursor: 'pointer',
  },
};