import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../../contexts/BookingContext';
import { useAvailability } from '../../hooks/useAvailability';
import { TIME_SLOTS, formatTime, getMinDate, formatDisplayDate } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

const SERVICES = [
  {
    id: 'Medicure',
    icon: '💊',
    title: 'Medicure',
    desc: 'Medical-grade foot & skin care treatment',
    duration: '60 min',
    price: '$150',
  },
  {
    id: 'Manicure',
    icon: '💅',
    title: 'Manicure',
    desc: 'Luxurious nail care and polish service',
    duration: '45 min',
    price: '$100',
  },
  {
    id: 'Pedicure',
    icon: '🦶',
    title: 'Pedicure',
    desc: 'Rejuvenating foot soak and nail treatment',
    duration: '50 min',
    price: '$120',
  },
  {
    id: 'Facial',
    icon: '✨',
    title: 'Facial',
    desc: 'Deep cleansing and hydrating facial therapy',
    duration: '75 min',
    price: '$200',
  },
];

export default function ServiceStep() {
  const { bookingData, updateBooking, setStep } = useBooking();
  const { checkSlot, loading: checkingSlot } = useAvailability();

  const [selectedService, setSelectedService] = useState(bookingData.service || '');
  const [selectedDate, setSelectedDate] = useState(bookingData.date || '');
  const [selectedTime, setSelectedTime] = useState(bookingData.timeSlot || '');
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    if (date && selectedService) {
      const results = await Promise.all(
        TIME_SLOTS.map(async (slot) => {
          const available = await checkSlot(selectedService, date, slot);
          return available ? null : slot;
        })
      );
      setUnavailableSlots(results.filter(Boolean));
    }
  };

  const handleServiceChange = async (svc) => {
    setSelectedService(svc);
    setSelectedTime('');
    if (svc && selectedDate) {
      const results = await Promise.all(
        TIME_SLOTS.map(async (slot) => {
          const available = await checkSlot(svc, selectedDate, slot);
          return available ? null : slot;
        })
      );
      setUnavailableSlots(results.filter(Boolean));
    }
  };

  const handleNext = async () => {
    if (!selectedService) return toast.error('Please select a service');
    if (!selectedDate) return toast.error('Please select a date');
    if (!selectedTime) return toast.error('Please select a time slot');

    const available = await checkSlot(selectedService, selectedDate, selectedTime);
    if (!available) {
      return toast.error('This slot was just taken. Please choose another time.');
    }

    updateBooking({ service: selectedService, date: selectedDate, timeSlot: selectedTime });
    setStep(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--spa-dark)' }}>
        Choose Your Treatment
      </h2>
      <p className="text-sm mb-6 sm:mb-8" style={{ color: 'var(--spa-muted)' }}>
        Select a service, date, and your preferred time
      </p>

      {/* Services - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {SERVICES.map((svc) => (
          <motion.button
            key={svc.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleServiceChange(svc.id)}
            className="text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200"
            style={{
              borderColor: selectedService === svc.id ? 'var(--spa-dark)' : 'rgba(199,233,192,0.6)',
              background: selectedService === svc.id ? 'var(--spa-green)' : 'white',
              boxShadow: selectedService === svc.id ? '0 4px 20px rgba(61,90,62,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div className="text-2xl mb-2">{svc.icon}</div>
            <div className="font-semibold text-sm" style={{ color: 'var(--spa-dark)' }}>{svc.title}</div>
            <div className="text-xs mt-1 mb-3 leading-relaxed" style={{ color: 'var(--spa-muted)' }}>{svc.desc}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--spa-primary)', color: 'var(--spa-dark)' }}>
                {svc.duration}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--spa-dark)' }}>{svc.price}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--spa-dark)' }}>
          Select Date
        </label>
        <input
          type="date"
          min={getMinDate()}
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border text-sm"
          style={{
            borderColor: 'rgba(199,233,192,0.8)',
            background: 'white',
            color: 'var(--spa-text)',
          }}
        />
        {selectedDate && (
          <p className="text-xs mt-1" style={{ color: 'var(--spa-muted)' }}>
            {formatDisplayDate(selectedDate)}
          </p>
        )}
      </div>

      {/* Time slots */}
      {selectedDate && selectedService && (
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--spa-dark)' }}>
            Available Times
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isUnavailable = unavailableSlots.includes(slot);
              const isSelected = selectedTime === slot;
              return (
                <motion.button
                  key={slot}
                  whileHover={!isUnavailable ? { scale: 1.05 } : {}}
                  whileTap={!isUnavailable ? { scale: 0.95 } : {}}
                  disabled={isUnavailable || checkingSlot}
                  onClick={() => !isUnavailable && setSelectedTime(slot)}
                  className="py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: isUnavailable
                      ? '#f5f5f5'
                      : isSelected
                      ? 'var(--spa-dark)'
                      : 'white',
                    color: isUnavailable
                      ? '#ccc'
                      : isSelected
                      ? 'white'
                      : 'var(--spa-text)',
                    border: `2px solid ${isUnavailable ? '#eee' : isSelected ? 'var(--spa-dark)' : 'rgba(199,233,192,0.6)'}`,
                    cursor: isUnavailable ? 'not-allowed' : 'pointer',
                    textDecoration: isUnavailable ? 'line-through' : 'none',
                  }}
                >
                  {formatTime(slot)}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        disabled={checkingSlot}
        className="w-full py-4 rounded-2xl text-white font-semibold text-sm tracking-wide transition-all"
        style={{ background: 'var(--spa-dark)' }}
      >
        {checkingSlot ? 'Checking availability...' : 'Continue to Details →'}
      </motion.button>
    </motion.div>
  );
}