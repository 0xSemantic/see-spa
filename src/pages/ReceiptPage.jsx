import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ReceiptPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {/* Success animation */}
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6"
          style={{ background: 'var(--spa-primary)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: 2, duration: 0.5 }}
        >
          ✓
        </motion.div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3" style={{ color: 'var(--spa-dark)' }}>
          Booking Confirmed!
        </h1>
        <p className="text-sm mb-6 sm:mb-8 leading-relaxed px-2" style={{ color: 'var(--spa-muted)' }}>
          Your spa session has been booked. A confirmation email with your receipt has been sent to your inbox.
        </p>

        {/* Receipt code */}
        <div className="rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8" style={{ background: 'var(--spa-green)', border: '1px solid rgba(199,233,192,0.6)' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3" style={{ color: 'var(--spa-muted)' }}>
            Your Receipt Code
          </div>
          <div
            className="receipt-code text-3xl sm:text-4xl font-bold mb-2 break-all"
            style={{ color: 'var(--spa-dark)' }}
          >
            {code}
          </div>
          <p className="text-xs" style={{ color: 'var(--spa-muted)' }}>
            Show this code at the reception desk when you arrive
          </p>
        </div>

        <div className="space-y-3 px-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/"
              className="block w-full py-3 sm:py-4 rounded-2xl text-white font-semibold text-sm text-center"
              style={{ background: 'var(--spa-dark)' }}
            >
              Book Another Treatment
            </Link>
          </motion.div>

          <p className="text-xs" style={{ color: 'var(--spa-muted)' }}>
            Questions? Contact us or show your receipt code at the front desk.
          </p>
        </div>
      </motion.div>
    </div>
  );
}