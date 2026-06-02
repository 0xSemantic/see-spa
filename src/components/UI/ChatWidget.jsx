import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
        style={{ background: '#3d5a3e', color: 'white', boxShadow: '0 8px 24px rgba(61,90,62,0.4)' }}
      >
        💬
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: 'white', border: '1px solid rgba(199,233,192,0.6)' }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center" style={{ background: '#2c3e2d', color: 'white' }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <span className="font-display font-semibold">Serene Spa Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl leading-none">
                ×
              </button>
            </div>

            {/* Chat body */}
            <div className="p-4 space-y-4 h-80 overflow-y-auto" style={{ background: '#fefaf5' }}>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: '#c7e9c0', color: '#2c3e2d' }}>
                  🌿
                </div>
                <div className="flex-1 p-3 rounded-2xl rounded-tl-none text-sm" style={{ background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  Hello! 👋 Thanks for visiting Serene Spa.
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: '#c7e9c0', color: '#2c3e2d' }}>
                  🌿
                </div>
                <div className="flex-1 p-3 rounded-2xl rounded-tl-none text-sm" style={{ background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  This chat feature is currently in <strong>demo mode</strong> and not fully functional.<br /><br />
                  For any inquiries, please reach out to us at <span className="font-mono text-xs" style={{ color: '#3d5a3e' }}>support@serenespa.com</span> or call +234 800 123 4567.
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: '#c7e9c0', color: '#2c3e2d' }}>
                  🌿
                </div>
                <div className="flex-1 p-3 rounded-2xl rounded-tl-none text-sm" style={{ background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  We'll respond within 24 hours. Thank you for your understanding! 🙏
                </div>
              </div>
            </div>

            {/* Input area (non-functional, just for show) */}
            <div className="p-3 border-t" style={{ borderColor: 'rgba(199,233,192,0.4)', background: 'white' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full text-sm border"
                  style={{ borderColor: 'rgba(199,233,192,0.6)', background: '#fefaf5' }}
                  disabled
                />
                <button
                  disabled
                  className="px-4 py-2 rounded-full text-sm font-medium opacity-50 cursor-not-allowed"
                  style={{ background: '#3d5a3e', color: 'white' }}
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-center mt-2" style={{ color: 'var(--spa-muted)' }}>
                Demo — no real chat support
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}