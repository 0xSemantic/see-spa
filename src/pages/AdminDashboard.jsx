import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAllBookings } from '../services/bookingService';
import BookingTable from '../components/Admin/BookingTable';
import ReceiptVerifier from '../components/Admin/ReceiptVerifier';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const unsub = getAllBookings((data) => {
      setBookings(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
    toast.success('Logged out');
  };

  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const checkedIn = bookings.filter((b) => b.status === 'checked_in').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold" style={{ color: 'var(--spa-dark)' }}>
            Admin Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--spa-muted)' }}>
            Manage bookings and verify guest receipts
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:bg-red-50"
          style={{ borderColor: '#fecaca', color: '#dc2626' }}
        >
          Sign Out
        </button>
      </motion.div>

      {/* Stats - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: '📋', bg: 'var(--spa-green)' },
          { label: 'Confirmed', value: confirmed, icon: '🕐', bg: 'var(--spa-yellow)' },
          { label: 'Checked In', value: checkedIn, icon: '✅', bg: 'var(--spa-primary)' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5"
            style={{ background: stat.bg }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-3xl font-display font-bold" style={{ color: 'var(--spa-dark)' }}>
              {loading ? '-' : stat.value}
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--spa-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'bookings', label: '📋 All Bookings' },
          { id: 'verify', label: '🎫 Verify Receipt' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--spa-dark)' : 'white',
              color: activeTab === tab.id ? 'white' : 'var(--spa-muted)',
              border: `1px solid ${activeTab === tab.id ? 'var(--spa-dark)' : 'rgba(199,233,192,0.6)'}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-3xl p-4 sm:p-6" style={{ background: 'white', border: '1px solid rgba(199,233,192,0.4)' }}>
        {activeTab === 'bookings' ? (
          <BookingTable bookings={bookings} loading={loading} />
        ) : (
          <ReceiptVerifier />
        )}
      </div>
    </div>
  );
}