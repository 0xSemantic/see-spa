import { motion } from 'framer-motion';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-3 border-t-transparent"
        style={{ border: '3px solid var(--spa-primary)', borderTopColor: 'transparent' }}
      />
      <p className="text-sm" style={{ color: 'var(--spa-muted)' }}>{text}</p>
    </div>
  );
}
