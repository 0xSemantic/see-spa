import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDisplayDate, formatTime } from '../../utils/dateHelpers';

const STATUS_STYLES = {
  confirmed: { bg: 'rgba(250,230,124,0.3)', color: '#a07d00', label: '● Confirmed' },
  checked_in: { bg: 'rgba(199,233,192,0.5)', color: 'var(--spa-dark)', label: '✓ Checked In' },
};

export default function BookingTable({ bookings, loading }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.receiptCode?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, or receipt code..."
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: 'rgba(199,233,192,0.8)', background: 'white' }}
        />
        <div className="flex gap-2">
          {['all', 'confirmed', 'checked_in'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: statusFilter === s ? 'var(--spa-dark)' : 'white',
                color: statusFilter === s ? 'white' : 'var(--spa-muted)',
                border: `1px solid ${statusFilter === s ? 'var(--spa-dark)' : 'rgba(199,233,192,0.6)'}`,
              }}
            >
              {s === 'all' ? 'All' : s === 'confirmed' ? 'Confirmed' : 'Checked In'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--spa-muted)' }}>Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--spa-green)' }}>
          <div className="text-3xl mb-2">📋</div>
          <p style={{ color: 'var(--spa-muted)' }}>No bookings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'rgba(199,233,192,0.5)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--spa-green)' }}>
                {['Receipt', 'Guest', 'Service', 'Date & Time', 'Payment', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--spa-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const s = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed;
                return (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: 'rgba(199,233,192,0.3)' }}
                  >
                    <td className="px-4 py-3">
                      <span className="receipt-code text-xs font-semibold px-2 py-1 rounded-lg"
                        style={{ background: 'var(--spa-yellow)', color: 'var(--spa-dark)' }}>
                        {b.receiptCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: 'var(--spa-dark)' }}>{b.customerName}</div>
                      <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>{b.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--spa-text)' }}>{b.service}</td>
                    <td className="px-4 py-3">
                      <div style={{ color: 'var(--spa-text)' }}>{formatDisplayDate(b.date)}</div>
                      <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>{formatTime(b.timeSlot)}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--spa-muted)' }}>
                      **** {b.paymentLast4}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-xs" style={{ color: 'var(--spa-muted)' }}>
        Showing {filtered.length} of {bookings.length} bookings
      </div>
    </div>
  );
}
