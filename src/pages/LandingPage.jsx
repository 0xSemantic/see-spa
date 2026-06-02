import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ─── data (unchanged) ─────────────────────────────────── */
const SERVICES = [
  {
    id: 'medicure',
    icon: '💊',
    name: 'Medicure',
    tagline: 'Medical-grade care',
    desc: "Therapeutic treatment targeting calluses, cracked heels, and nail conditions. Our certified therapists use clinical-grade tools for results that go beyond cosmetic.",
    price: '₦15,000',
    duration: '60 min',
    color: '#e8f5e9',
    accent: '#4caf50',
  },
  {
    id: 'manicure',
    icon: '💅',
    name: 'Manicure',
    tagline: 'Polished perfection',
    desc: "From cuticle care to a high-gloss finish, every detail tended to. Choose from a curated palette of premium lacquers or go for a natural buff shine.",
    price: '₦10,000',
    duration: '45 min',
    color: '#fff8e1',
    accent: '#f9a825',
  },
  {
    id: 'pedicure',
    icon: '🦶',
    name: 'Pedicure',
    tagline: 'From sole to soul',
    desc: "A warm herbal soak, exfoliating scrub, pressure-point massage, and immaculate nail finish. Your feet carry you everywhere, let us carry them for an hour.",
    price: '₦12,000',
    duration: '50 min',
    color: '#e3f2fd',
    accent: '#1e88e5',
  },
  {
    id: 'facial',
    icon: '✨',
    name: 'Facial',
    tagline: 'Skin, reimagined',
    desc: "Deep pore cleansing, vitamin-infused serums, and a customised hydration protocol. Your skin's specific needs guide every step of this transformative treatment.",
    price: '₦20,000',
    duration: '75 min',
    color: '#fce4ec',
    accent: '#e91e63',
  },
];

const TESTIMONIALS = [
  { name: 'Adaeze O.', role: 'Lagos', quote: "I've been to many spas but Serene is on another level. The medicure treatment cleared up years of stubborn calluses in one session. I left floating.", stars: 5 },
  { name: 'Tolu B.', role: 'Abuja', quote: "Booked online in under 3 minutes, showed my receipt code at the door, and within minutes I was in a chair. Seamless, beautiful, worth every naira.", stars: 5 },
  { name: 'Chisom N.', role: 'Port Harcourt', quote: "The facial changed my skincare life. The therapist knew exactly what my skin needed. The glow lasted two weeks. I'm already booked for next month.", stars: 5 },
];

const PROCESS = [
  { step: '01', title: 'Choose Your Treatment', desc: 'Browse our menu of premium spa services and select the one that calls to you.' },
  { step: '02', title: 'Pick Your Moment', desc: 'Select a date and time that fits your schedule. Real-time availability, no surprises.' },
  { step: '03', title: 'Confirm & Pay', desc: 'Secure checkout in seconds. Your receipt code is generated instantly.' },
  { step: '04', title: 'Arrive & Unwind', desc: 'Show your code at the door and step into pure relaxation. We handle the rest.' },
];

/* ─── animated counter ─────────────────────────────────── */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = to / 60;
        const tick = setInterval(() => {
          start += step;
          if (start >= to) { setVal(to); clearInterval(tick); }
          else setVal(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── floating leaf SVG ────────────────────────────────── */
function Leaf({ style, className = '' }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" style={style} className={className}>
      <path d="M30 75 C10 55 5 35 15 15 C25-5 45 5 50 25 C55 45 45 65 30 75Z"
        fill="currentColor" opacity="0.18" />
      <path d="M30 75 L30 20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ─── main component ───────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [activeService, setActiveService] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#2c3e2d', overflowX: 'hidden' }}>
      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
        .landing-desktop-nav {
            display: none !important;
        }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .hero-right-stack {
            display: none !important;
          }
          .process-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .trust-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .service-panel {
            grid-template-columns: 1fr !important;
          }
          .service-left, .service-right {
            padding: 2rem !important;
          }
          .service-left h3 {
            font-size: 2rem !important;
          }
          .service-left .price {
            font-size: 1.5rem !important;
          }
          .nav-links {
            gap: 1rem !important;
          }
          .nav-links a, .nav-links .book-btn {
            font-size: 0.75rem !important;
            padding: 0.5rem 0.8rem !important;
          }
          .hero-badge {
            font-size: 0.7rem !important;
            padding: 0.25rem 0.8rem !important;
          }
          .hero-stats {
            flex-wrap: wrap;
            gap: 1.5rem !important;
          }
          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .cta-buttons a, .cta-buttons button {
            width: 100%;
            text-align: center;
          }
          .section-padding {
            padding: 3rem 1.5rem !important;
          }
          .service-tabs {
            gap: 0.5rem !important;
          }
          .service-tabs button {
            padding: 0.5rem 1rem !important;
            font-size: 0.75rem !important;
          }
        }
        @media (max-width: 480px) {
          .hero h1 {
            font-size: 2.5rem !important;
          }
          .hero p {
            font-size: 0.9rem !important;
          }
          .receipt-code-example {
            font-size: 0.8rem !important;
          }
        }
      `}</style>

      {/* ══════════ NAV (responsive) ══════════ */}
      <motion.nav
        className="landing-desktop-nav"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'rgba(250,253,248,0.82)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(199,233,192,0.4)',
        }}
        >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3d5a3e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 18, lineHeight: 1, color: '#3d5a3e' }}>Serene Spa</div>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a9e7b', lineHeight: 1.3 }}>Wellness & Beauty</div>
            </div>
          </div>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#services" style={{ fontSize: 13, fontWeight: 500, color: '#7a9e7b', textDecoration: 'none' }}>Services</a>
            <a href="#how-it-works" style={{ fontSize: 13, fontWeight: 500, color: '#7a9e7b', textDecoration: 'none' }}>How It Works</a>
            <a href="#testimonials" style={{ fontSize: 13, fontWeight: 500, color: '#7a9e7b', textDecoration: 'none' }}>Reviews</a>
            <Link to="/admin" style={{ fontSize: 13, fontWeight: 500, color: '#7a9e7b', textDecoration: 'none' }}>Staff</Link>
            <Link to="/book" className="book-btn" style={{
              fontSize: 13, fontWeight: 600, padding: '10px 22px', borderRadius: 50,
              background: '#3d5a3e', color: 'white', textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 16px rgba(61,90,62,0.25)',
            }}>
              Book Now
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 68 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f0faf0 0%, #fef9e7 40%, #e8f5e9 100%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 75% 40%, rgba(199,233,192,0.5) 0%, transparent 55%), radial-gradient(circle at 20% 70%, rgba(254,247,210,0.6) 0%, transparent 50%)', zIndex: 1 }} />

        <Leaf style={{ position: 'absolute', top: '8%', right: '6%', width: 120, color: '#3d5a3e', transform: 'rotate(25deg)', zIndex: 1 }} />
        <Leaf style={{ position: 'absolute', bottom: '12%', left: '3%', width: 80, color: '#3d5a3e', transform: 'rotate(-40deg)', zIndex: 1 }} />
        <Leaf style={{ position: 'absolute', top: '40%', right: '18%', width: 60, color: '#a5d6a7', transform: 'rotate(60deg)', zIndex: 1 }} />

        <motion.div
          style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 1.5rem', position: 'relative', zIndex: 2, y: heroY, opacity: heroOpacity }}
        >
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* left copy */}
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item}>
                <span className="hero-badge" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12,
                  fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '7px 16px', borderRadius: 50,
                  background: 'rgba(199,233,192,0.6)', color: '#3d5a3e',
                  border: '1px solid rgba(61,90,62,0.15)', marginBottom: 28,
                }}>
                  <span>🌿</span> Lagos's Premier Spa Experience
                </span>
              </motion.div>

              <motion.h1 variants={item} style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 5vw, 76px)',
                fontWeight: 300, lineHeight: 1.08, color: '#2c3e2d', marginBottom: 28, letterSpacing: '-0.02em',
              }}>
                Where Every<br />
                Visit Becomes<br />
                <em style={{ fontStyle: 'italic', color: '#3d5a3e' }}>A Ritual</em>
              </motion.h1>

              <motion.p variants={item} style={{
                fontSize: 16, lineHeight: 1.8, color: '#5a7a5b', marginBottom: 40,
                maxWidth: 440,
              }}>
                From restorative medicures to radiance-boosting facials, our expert therapists deliver bespoke treatments in a sanctuary designed for complete calm. Book in minutes, arrive and exhale.
              </motion.p>

              <motion.div variants={item} className="cta-buttons" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to="/book" style={{
                  padding: '16px 36px', borderRadius: 50, background: '#3d5a3e',
                  color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 600,
                  boxShadow: '0 8px 32px rgba(61,90,62,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                }}>
                  Reserve Your Session <span style={{ fontSize: 18 }}>→</span>
                </Link>
                <a href="#services" style={{
                  padding: '16px 28px', borderRadius: 50, border: '1.5px solid rgba(61,90,62,0.25)',
                  color: '#3d5a3e', textDecoration: 'none', fontSize: 15, fontWeight: 500,
                  transition: 'background 0.2s',
                }}>
                  Explore Services
                </a>
              </motion.div>

              <motion.div className="hero-stats" variants={item} style={{ display: 'flex', gap: 40, marginTop: 52 }}>
                {[
                  { n: 2400, s: '+', label: 'Happy Guests' },
                  { n: 4, s: '', label: 'Signature Treatments' },
                  { n: 98, s: '%', label: 'Satisfaction Rate' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: '#3d5a3e', lineHeight: 1 }}>
                      <Counter to={stat.n} suffix={stat.s} />
                    </div>
                    <div style={{ fontSize: 12, color: '#7a9e7b', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* right: visual card stack (hidden on mobile) */}
            <div className="hero-right-stack">
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'relative', height: 540 }}
              >
                {/* back card */}
                <motion.div
                  animate={{ rotate: [-3, -2, -3], y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: 40, right: -20, width: 300, height: 400,
                    borderRadius: 28, background: '#c7e9c0',
                    boxShadow: '0 20px 60px rgba(61,90,62,0.15)',
                  }}
                />
                {/* mid card */}
                <motion.div
                  animate={{ rotate: [2, 3, 2], y: [0, 6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{
                    position: 'absolute', top: 20, right: 10, width: 300, height: 400,
                    borderRadius: 28, background: '#fae67c',
                    boxShadow: '0 20px 60px rgba(61,90,62,0.12)',
                  }}
                />
                {/* main card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  style={{
                    position: 'absolute', top: 0, right: 30, width: 310, height: 420,
                    borderRadius: 28, background: 'white',
                    boxShadow: '0 30px 80px rgba(61,90,62,0.2)',
                    padding: 32, display: 'flex', flexDirection: 'column', gap: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a9e7b' }}>Today's Featured</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: '#2c3e2d', marginTop: 4 }}>Signature Facial</div>
                    </div>
                    <div style={{ fontSize: 36 }}>✨</div>
                  </div>
                  <div style={{ borderRadius: 18, background: '#e6f3e6', padding: '24px 20px', flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#5a7a5b', lineHeight: 1.7 }}>Deep cleansing · Vitamin C serum · Hydration mask · Pressure point massage</div>
                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#7a9e7b' }}>Duration</div>
                        <div style={{ fontWeight: 600, color: '#3d5a3e' }}>75 minutes</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#7a9e7b' }}>From</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#3d5a3e' }}>₦20k</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: -4 }}>
                      {['#c7e9c0','#fae67c','#f8c8d8'].map((c, i) => (
                        <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? -8 : 0 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: '#7a9e7b' }}>+2,400 guests served</div>
                  </div>
                </motion.div>
                {/* floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  style={{
                    position: 'absolute', bottom: 80, left: 10, padding: '12px 20px',
                    borderRadius: 16, background: '#3d5a3e', color: 'white',
                    boxShadow: '0 12px 32px rgba(61,90,62,0.35)',
                  }}
                >
                  <div style={{ fontSize: 11, opacity: 0.75 }}>Next available</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Tomorrow · 10:00 AM</div>
                </motion.div>
                {/* receipt badge */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  style={{
                    position: 'absolute', top: 60, left: -20, padding: '10px 16px',
                    borderRadius: 12, background: '#fef7d2', border: '1px solid rgba(250,230,124,0.6)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#7a9e7b' }}>Receipt Code</div>
                  <div className="receipt-code-example" style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: '#3d5a3e', letterSpacing: '0.1em' }}>SP-7K4M</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2 }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a9e7b' }}>Discover more</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #7a9e7b, transparent)' }} />
        </motion.div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services" className="section-padding" style={{ padding: '120px 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 72 }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9e7b' }}>Our Menu</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 58px)', fontWeight: 300, color: '#2c3e2d', marginTop: 12, lineHeight: 1.15 }}>
              Treatments Crafted<br /><em>With Intention</em>
            </h2>
            <p style={{ fontSize: 15, color: '#5a7a5b', maxWidth: 480, margin: '20px auto 0', lineHeight: 1.8 }}>
              Each service is a complete ritual, not just a treatment. Our therapists are trained in both technique and presence.
            </p>
          </motion.div>

          <div className="service-tabs" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveService(i)}
                style={{
                  padding: '10px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, transition: 'all 0.25s',
                  background: activeService === i ? '#3d5a3e' : '#f0faf0',
                  color: activeService === i ? 'white' : '#5a7a5b',
                  boxShadow: activeService === i ? '0 4px 16px rgba(61,90,62,0.25)' : 'none',
                }}
              >
                {s.icon} {s.name}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="service-panel"
              style={{
                borderRadius: 32, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr',
                boxShadow: '0 20px 80px rgba(61,90,62,0.12)',
              }}
            >
              {/* left: colored */}
              <div className="service-left" style={{
                background: SERVICES[activeService].color,
                padding: '64px 56px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 72, marginBottom: 24 }}>{SERVICES[activeService].icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a9e7b', marginBottom: 8 }}>
                    {SERVICES[activeService].tagline}
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 400, color: '#2c3e2d', lineHeight: 1, marginBottom: 24 }}>
                    {SERVICES[activeService].name}
                  </h3>
                  <p style={{ fontSize: 15, color: '#5a7a5b', lineHeight: 1.9 }}>
                    {SERVICES[activeService].desc}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#7a9e7b', marginBottom: 4 }}>Duration</div>
                    <div style={{ fontWeight: 600, color: '#3d5a3e', fontSize: 18 }}>{SERVICES[activeService].duration}</div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(61,90,62,0.15)' }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#7a9e7b', marginBottom: 4 }}>Price</div>
                    <div className="price" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#3d5a3e', fontSize: 28 }}>{SERVICES[activeService].price}</div>
                  </div>
                </div>
              </div>
              {/* right: white */}
              <div className="service-right" style={{ background: 'white', padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#7a9e7b', marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    What's included
                  </div>
                  {[
                    'Professional consultation',
                    'Premium product application',
                    'Relaxation & massage component',
                    'Post-treatment care advice',
                    'Digital receipt & booking record',
                  ].map((feat, i) => (
                    <motion.div
                      key={feat}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0faf0' }}
                    >
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#e6f3e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</div>
                      <span style={{ fontSize: 14, color: '#3d5a3e' }}>{feat}</span>
                    </motion.div>
                  ))}
                </div>
                <Link to="/book" style={{
                  marginTop: 40, display: 'block', textAlign: 'center',
                  padding: '16px', borderRadius: 16, background: '#3d5a3e',
                  color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(61,90,62,0.3)',
                }}>
                  Book {SERVICES[activeService].name} →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="section-padding" style={{ padding: '120px 1.5rem', background: '#f4fbf4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9e7b' }}>Simple Process</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: '#2c3e2d', marginTop: 12, lineHeight: 1.15 }}>
              From Booking to<br /><em>Bliss in 4 Steps</em>
            </h2>
          </motion.div>

          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  background: 'white', borderRadius: 24, padding: 32,
                  boxShadow: '0 4px 24px rgba(61,90,62,0.07)',
                  border: '1px solid rgba(199,233,192,0.5)',
                  position: 'relative',
                }}
              >
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 700,
                  color: 'rgba(199,233,192,0.9)', position: 'absolute', top: 16, right: 20, lineHeight: 1
                }}>
                  {p.step}
                </div>
                <div style={{ fontSize: 24, marginBottom: 16 }}>
                  {['🌿', '📅', '💳', '🛋️'][i]}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#2c3e2d', marginBottom: 10 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: '#5a7a5b', lineHeight: 1.75 }}>{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TRUST STRIP ══════════ */}
      <section style={{ padding: '72px 1.5rem', background: '#3d5a3e' }}>
        <div className="trust-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
          {[
            { icon: '🔒', title: 'Secure Booking', desc: 'Your data is encrypted. Your receipt code is unique and tamper-proof.' },
            { icon: '📧', title: 'Instant Receipt', desc: 'A confirmation email lands in your inbox the moment you book.' },
            { icon: '✅', title: 'Easy Check-In', desc: 'Just show your code at the door. No paperwork, no waiting.' },
            { icon: '💬', title: 'Real Support', desc: 'Our staff are on-hand before, during, and after your visit.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#c7e9c0', marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(199,233,192,0.7)', lineHeight: 1.8 }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="testimonials" className="section-padding" style={{ padding: '120px 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9e7b' }}>Guest Stories</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 54px)', fontWeight: 300, color: '#2c3e2d', marginTop: 12, lineHeight: 1.15, marginBottom: 60 }}>
              What Our Guests<br /><em>Say About Us</em>
            </h2>
          </motion.div>

          <div style={{ position: 'relative', minHeight: 240 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ fontSize: 40, marginBottom: 20 }}>
                  {'★'.repeat(TESTIMONIALS[activeTestimonial].stars)}
                </div>
                <blockquote style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 400, fontStyle: 'italic',
                  color: '#2c3e2d', lineHeight: 1.6, marginBottom: 32,
                }}>
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </blockquote>
                <div style={{ fontWeight: 600, color: '#3d5a3e' }}>{TESTIMONIALS[activeTestimonial].name}</div>
                <div style={{ fontSize: 13, color: '#7a9e7b' }}>{TESTIMONIALS[activeTestimonial].role}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: activeTestimonial === i ? 28 : 8, height: 8, borderRadius: 4,
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                  background: activeTestimonial === i ? '#3d5a3e' : '#c7e9c0',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section style={{ padding: '100px 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              borderRadius: 40, padding: 'clamp(2rem, 8vw, 5rem) 1.5rem', textAlign: 'center',
              background: 'linear-gradient(135deg, #e6f3e6 0%, #fef7d2 60%, #c7e9c0 100%)',
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(199,233,192,0.6)',
              boxShadow: '0 20px 80px rgba(61,90,62,0.1)',
            }}
          >
            <Leaf style={{ position: 'absolute', top: -20, right: -20, width: 140, color: '#3d5a3e', transform: 'rotate(20deg)' }} />
            <Leaf style={{ position: 'absolute', bottom: -30, left: -10, width: 100, color: '#3d5a3e', transform: 'rotate(-30deg)' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🌿</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: '#2c3e2d', lineHeight: 1.1, marginBottom: 20 }}>
                Your Sanctuary<br /><em>Awaits You</em>
              </h2>
              <p style={{ fontSize: 16, color: '#5a7a5b', lineHeight: 1.8, marginBottom: 44, maxWidth: 480, margin: '0 auto 44px' }}>
                Join thousands of guests who've made Serene Spa part of their self-care routine. Your first step is just a few clicks away.
              </p>
              <div className="cta-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/book" style={{
                  padding: '18px 44px', borderRadius: 50, background: '#3d5a3e',
                  color: 'white', textDecoration: 'none', fontSize: 16, fontWeight: 600,
                  boxShadow: '0 10px 36px rgba(61,90,62,0.35)',
                  transition: 'all 0.2s', display: 'inline-block',
                }}>
                  Book Your Treatment
                </Link>
                <a href="#services" style={{
                  padding: '18px 36px', borderRadius: 50, border: '1.5px solid rgba(61,90,62,0.3)',
                  color: '#3d5a3e', textDecoration: 'none', fontSize: 16, fontWeight: 500,
                  transition: 'background 0.2s', display: 'inline-block',
                }}>
                  View All Services
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}