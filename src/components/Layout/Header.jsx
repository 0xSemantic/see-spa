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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: 'var(--spa-dark)' }}>
            🌿
          </div>
          <div>
            <div className="font-display text-xl font-semibold leading-none" style={{ color: 'var(--spa-dark)' }}>
              Serene Spa
            </div>
            <div className="text-xs tracking-widest uppercase" style={{ color: 'var(--spa-muted)' }}>
              Wellness & Beauty
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          {!isAdmin && (
            <Link to="/book" className="text-sm font-medium transition-colors hover:text-green-700"
              style={{ color: 'var(--spa-muted)' }}>
              Book Now
            </Link>
          )}
          <Link
            to={isAdmin ? '/' : '/admin'}
            className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-105"
            style={{
              background: isAdmin ? 'var(--spa-accent)' : 'var(--spa-dark)',
              color: isAdmin ? 'var(--spa-dark)' : 'white',
            }}
          >
            {isAdmin ? '← Guest View' : 'Staff Portal'}
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}