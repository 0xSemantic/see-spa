import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { verifyReceipt } from '../../services/bookingService';
import { formatDisplayDate, formatTime } from '../../utils/dateHelpers';

export default function ReceiptVerifier() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!code.trim()) return toast.error('Please enter a receipt code');
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyReceipt(code);
      setResult(res);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error checking receipt. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div>
      <h3 className="font-display text-xl sm:text-2xl font-semibold mb-1" style={{ color: 'var(--spa-dark)' }}>
        Receipt Verification
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--spa-muted)' }}>
        Enter a guest's receipt code to check them in
      </p>

      {/* Input + button - stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="SP-XXXX"
          maxLength={7}
          className="w-full sm:flex-1 px-4 py-3.5 rounded-xl border text-sm font-mono tracking-widest uppercase"
          style={{ borderColor: 'rgba(199,233,192,0.8)', background: 'white', letterSpacing: '0.15em' }}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          disabled={loading}
          className="px-6 py-3.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: loading ? 'var(--spa-muted)' : 'var(--spa-dark)' }}
        >
          {loading ? '...' : 'Verify'}
        </motion.button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-4 sm:p-5"
            style={{
              background: result.success ? 'var(--spa-green)' : '#fef2f2',
              border: `1.5px solid ${result.success ? 'var(--spa-primary)' : '#fecaca'}`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">{result.success ? '✅' : result.message.includes('already') ? '🔄' : '❌'}</div>
              <div>
                <div className="font-semibold text-sm sm:text-base" style={{ color: result.success ? 'var(--spa-dark)' : '#dc2626' }}>
                  {result.message}
                </div>
              </div>
            </div>

            {result.booking && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4"
                style={{ borderTop: `1px solid ${result.success ? 'rgba(199,233,192,0.6)' : '#fecaca'}` }}>
                <div>
                  <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>Guest</div>
                  <div className="font-semibold text-sm break-all" style={{ color: 'var(--spa-dark)' }}>
                    {result.booking.customerName}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>Service</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--spa-dark)' }}>
                    {result.booking.service}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>Date</div>
                  <div className="text-sm" style={{ color: 'var(--spa-text)' }}>
                    {formatDisplayDate(result.booking.date)}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>Time</div>
                  <div className="text-sm" style={{ color: 'var(--spa-text)' }}>
                    {formatTime(result.booking.timeSlot)}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}