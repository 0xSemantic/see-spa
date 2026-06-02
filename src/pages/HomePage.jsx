import { AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '../contexts/BookingContext';
import StepIndicator from '../components/UI/StepIndicator';
import ServiceStep from '../components/BookingForm/ServiceStep';
import CustomerStep from '../components/BookingForm/CustomerStep';
import PaymentStep from '../components/BookingForm/PaymentStep';

function BookingFlow() {
  const { step } = useBooking();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-4"
          style={{ background: 'var(--spa-primary)', color: 'var(--spa-dark)' }}>
          🌿 Wellness & Beauty
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-light leading-tight mb-4" style={{ color: 'var(--spa-dark)' }}>
          Book Your<br />
          <em>Spa Experience</em>
        </h1>
        <p className="text-sm max-w-sm mx-auto leading-relaxed px-4" style={{ color: 'var(--spa-muted)' }}>
          Treat yourself to a moment of pure relaxation. Our experts are ready to pamper you.
        </p>
      </div>

      {/* Booking card */}
      <div className="rounded-3xl p-4 sm:p-8 shadow-sm" style={{ background: 'white', border: '1px solid rgba(199,233,192,0.4)' }}>
        <StepIndicator currentStep={step} />
        <AnimatePresence mode="wait">
          {step === 1 && <ServiceStep key="service" />}
          {step === 2 && <CustomerStep key="customer" />}
          {step === 3 && <PaymentStep key="payment" />}
        </AnimatePresence>
      </div>

      {/* Trust signals */}
      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
        {[
          { icon: '🔒', label: 'Secure Booking' },
          { icon: '📧', label: 'Instant Receipt' },
          { icon: '✨', label: 'Expert Therapists' },
        ].map((item) => (
          <div key={item.label} className="py-3 sm:py-4 rounded-2xl text-xs font-medium"
            style={{ background: 'var(--spa-green)', color: 'var(--spa-muted)' }}>
            <div className="text-base sm:text-lg mb-1">{item.icon}</div>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <BookingProvider>
      <BookingFlow />
    </BookingProvider>
  );
}