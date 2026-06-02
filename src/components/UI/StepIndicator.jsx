import { motion } from 'framer-motion';

const steps = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Details' },
  { num: 3, label: 'Payment' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ scale: currentStep === s.num ? 1.1 : 1 }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all"
              style={{
                background:
                  currentStep > s.num
                    ? 'var(--spa-primary)'
                    : currentStep === s.num
                    ? 'var(--spa-dark)'
                    : 'white',
                color:
                  currentStep > s.num
                    ? 'var(--spa-dark)'
                    : currentStep === s.num
                    ? 'white'
                    : 'var(--spa-muted)',
                border:
                  currentStep === s.num
                    ? 'none'
                    : '2px solid rgba(199,233,192,0.8)',
              }}
            >
              {currentStep > s.num ? '✓' : s.num}
            </motion.div>
            <span className="text-[10px] sm:text-xs font-medium" style={{ color: currentStep >= s.num ? 'var(--spa-dark)' : 'var(--spa-muted)' }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-8 sm:w-16 h-0.5 mb-4 sm:mb-4 mx-0 sm:mx-1 transition-all duration-500"
              style={{ background: currentStep > s.num ? 'var(--spa-primary)' : 'rgba(199,233,192,0.5)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}