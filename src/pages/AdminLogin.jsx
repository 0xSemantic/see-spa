import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin/dashboard');
        toast.success('Welcome back, Admin!');
      } else {
        toast.error('Invalid credentials');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: 'var(--spa-dark)' }}>
            🌿
          </div>
          <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: 'var(--spa-dark)' }}>
            Staff Portal
          </h1>
          <p className="text-sm" style={{ color: 'var(--spa-muted)' }}>
            Admin access only
          </p>
        </div>

        <div className="rounded-3xl p-8" style={{ background: 'white', border: '1px solid rgba(199,233,192,0.4)' }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>
                Admin Email
              </label>
              <input
                type="email"
                value={import.meta.env.VITE_ADMIN_EMAIL || 'admin@spa.com'}
                readOnly
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{ borderColor: 'rgba(199,233,192,0.8)', background: 'var(--spa-green)', color: 'var(--spa-muted)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{ borderColor: 'rgba(199,233,192,0.8)', background: 'white' }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--spa-muted)' }}>
                Demo password: <span className="font-mono">spa123</span>
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-4 rounded-2xl text-white font-semibold text-sm"
              style={{ background: loading ? 'var(--spa-muted)' : 'var(--spa-dark)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
