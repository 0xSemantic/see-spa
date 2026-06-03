import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
      style={{ background: 'rgba(250,253,248,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(199,233,192,0.6)' }}
    >
      <style>{`
        @media (max-width: 640px) {
          .header-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .nav-links {
            gap: 0.8rem !important;
          }
          .nav-links a, .nav-links .staff-btn {
            font-size: 0.7rem !important;
            padding: 0.35rem 0.7rem !important;
          }
          .brand-text h1 {
            font-size: 0.9rem !important;
          }
          .brand-text span {
            font-size: 0.6rem !important;
          }
          .brand-icon {
            width: 28px !important;
            height: 28px !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
      <div className="header-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="brand-icon" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--spa-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            🌿
          </div>
          <div className="brand-text">
            <div className="font-display text-xl font-semibold leading-none" style={{ color: 'var(--spa-dark)' }}>
              Glamour Spa
            </div>
            <div className="text-xs tracking-widest uppercase" style={{ color: 'var(--spa-muted)' }}>
              Wellness & Beauty
            </div>
          </div>
        </Link>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {!isAdmin && (
            <Link to="/book" className="text-sm font-medium transition-colors hover:text-green-700"
              style={{ color: 'var(--spa-muted)' }}>
              Book Now
            </Link>
          )}
          <Link
            to={isAdmin ? '/' : '/admin'}
            className="staff-btn text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-105"
            style={{
              background: isAdmin ? 'var(--spa-accent)' : 'var(--spa-dark)',
              color: isAdmin ? 'var(--spa-dark)' : 'white',
            }}
          >
            {isAdmin ? '← Guest View' : 'Staff Portal'}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}