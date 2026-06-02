import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBooking } from '../../contexts/BookingContext';
import { validateDummyCard, getLastFour, formatCardDisplay } from '../../utils/dummyCardValidator';
import { createBooking } from '../../services/bookingService';
import { formatDisplayDate, formatTime } from '../../utils/dateHelpers';

export default function PaymentStep() {
  const { bookingData, setStep, setConfirmedReceipt } = useBooking();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [cardValue, setCardValue] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const { handleSubmit } = useForm();

  const handleCardInput = (e) => setCardValue(formatCardDisplay(e.target.value));
  const handleExpiryInput = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
    setExpiry(val);
  };

  const onSubmit = async () => {
    if (!cardValue.trim()) return toast.error('Please enter your card number');
    if (!expiry || expiry.length < 5) return toast.error('Please enter a valid expiry date');
    if (!cvv || cvv.length < 3) return toast.error('Please enter your CVV');

    const isValid = validateDummyCard(cardValue);
    if (!isValid) {
      return toast.error('Invalid test card. Use: 4111 1111 1111 1111, 5555 5555 5555 4444, or 3782 822463 10005');
    }

    setSubmitting(true);
    try {
      const last4 = getLastFour(cardValue);
      const result = await createBooking(bookingData, last4);
      setConfirmedReceipt(result.receiptCode);
      toast.success('Booking confirmed! Check your email for your receipt.');
      navigate(`/receipt/${result.receiptCode}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const SERVICE_PRICES = {
    Medicure: '₦15,000',
    Manicure: '₦10,000',
    Pedicure: '₦12,000',
    Facial: '₦20,000',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--spa-dark)' }}>
        Secure Payment
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--spa-muted)' }}>
        This is a demo — use any test card below
      </p>

      <div className="rounded-2xl p-3 sm:p-4 mb-6 text-xs" style={{ background: 'var(--spa-yellow)', border: '1px solid rgba(250,230,124,0.8)' }}>
        <div className="font-semibold mb-2" style={{ color: 'var(--spa-dark)' }}>🧪 Test Cards</div>
        <div className="font-mono space-y-1 text-xs" style={{ color: 'var(--spa-text)' }}>
          <div>4111 1111 1111 1111 (Visa)</div>
          <div>5555 5555 5555 4444 (Mastercard)</div>
          <div>3782 822463 10005 (Amex)</div>
        </div>
        <div className="mt-2" style={{ color: 'var(--spa-muted)' }}>Any expiry & CVV works</div>
      </div>

      <div className="rounded-2xl p-3 sm:p-4 mb-6" style={{ background: 'var(--spa-green)' }}>
        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
          <div>
            <div className="font-semibold" style={{ color: 'var(--spa-dark)' }}>{bookingData.service}</div>
            <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>
              {formatDisplayDate(bookingData.date)} · {formatTime(bookingData.timeSlot)}
            </div>
            <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>{bookingData.customerName}</div>
          </div>
          <div className="text-xl font-display font-semibold" style={{ color: 'var(--spa-dark)' }}>
            {SERVICE_PRICES[bookingData.service]}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>Card Number</label>
          <input
            value={cardValue}
            onChange={handleCardInput}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-4 py-3 rounded-xl border text-sm font-mono tracking-wider"
            style={{ borderColor: 'rgba(199,233,192,0.8)', background: 'white' }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>Expiry Date</label>
            <input
              value={expiry}
              onChange={handleExpiryInput}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 rounded-xl border text-sm"
              style={{ borderColor: 'rgba(199,233,192,0.8)', background: 'white' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>CVV</label>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 rounded-xl border text-sm"
              style={{ borderColor: 'rgba(199,233,192,0.8)', background: 'white' }}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={submitting}
            className="flex-1 py-4 rounded-2xl text-sm font-semibold border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: 'rgba(199,233,192,0.8)', color: 'var(--spa-muted)' }}
          >
            ← Back
          </button>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={!submitting ? { scale: 1.02 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
            className="flex-[2] py-4 rounded-2xl text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
            style={{ background: submitting ? 'var(--spa-muted)' : 'var(--spa-dark)' }}
          >
            {submitting ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  ⟳
                </motion.span>
                Processing...
              </>
            ) : (
              '🔒 Confirm Booking'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}