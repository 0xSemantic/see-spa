import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBooking } from '../../contexts/BookingContext';
import { formatDisplayDate, formatTime } from '../../utils/dateHelpers';

const schema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email'),
  customerPhone: z.string().min(7, 'Enter a valid phone number'),
});

export default function CustomerStep() {
  const { bookingData, updateBooking, setStep } = useBooking();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: bookingData.customerName || '',
      customerEmail: bookingData.customerEmail || '',
      customerPhone: bookingData.customerPhone || '',
    },
  });

  const onSubmit = (data) => {
    updateBooking(data);
    setStep(3);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--spa-dark)' }}>
        Your Details
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--spa-muted)' }}>
        Your receipt and booking confirmation will be sent to your email
      </p>

      {/* Booking Summary */}
      <div className="rounded-2xl p-3 sm:p-4 mb-8" style={{ background: 'var(--spa-green)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--spa-muted)' }}>
          Booking Summary
        </h3>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div>
            <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>Service</div>
            <div className="font-semibold text-sm" style={{ color: 'var(--spa-dark)' }}>{bookingData.service}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>Date</div>
            <div className="font-semibold text-sm" style={{ color: 'var(--spa-dark)' }}>{formatDisplayDate(bookingData.date)}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: 'var(--spa-muted)' }}>Time</div>
            <div className="font-semibold text-sm" style={{ color: 'var(--spa-dark)' }}>{formatTime(bookingData.timeSlot)}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>Full Name</label>
          <input
            {...register('customerName')}
            placeholder="Jane Doe"
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all"
            style={{ borderColor: errors.customerName ? '#f87171' : 'rgba(199,233,192,0.8)', background: 'white' }}
          />
          {errors.customerName && <p className="text-xs mt-1 text-red-500">{errors.customerName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>Email Address</label>
          <input
            {...register('customerEmail')}
            type="email"
            placeholder="jane@example.com"
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all"
            style={{ borderColor: errors.customerEmail ? '#f87171' : 'rgba(199,233,192,0.8)', background: 'white' }}
          />
          {errors.customerEmail && <p className="text-xs mt-1 text-red-500">{errors.customerEmail.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-dark)' }}>Phone Number</label>
          <input
            {...register('customerPhone')}
            type="tel"
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all"
            style={{ borderColor: errors.customerPhone ? '#f87171' : 'rgba(199,233,192,0.8)', background: 'white' }}
          />
          {errors.customerPhone && <p className="text-xs mt-1 text-red-500">{errors.customerPhone.message}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 py-4 rounded-2xl text-sm font-semibold border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: 'rgba(199,233,192,0.8)', color: 'var(--spa-muted)' }}
          >
            ← Back
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-[2] py-4 rounded-2xl text-white font-semibold text-sm tracking-wide"
            style={{ background: 'var(--spa-dark)' }}
          >
            Continue to Payment →
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}