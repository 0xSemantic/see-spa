export default function Footer() {
  return (
    <footer style={{ background: '#2c3e2d', padding: '60px 32px 40px', color: 'rgba(199,233,192,0.7)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(199,233,192,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 18, color: '#c7e9c0' }}>Serene Spa</div>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>Wellness & Beauty</div>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.9, maxWidth: 280 }}>
              A sanctuary for those who believe that self-care is not a luxury, it is a necessity. Open daily, appointments available online.
            </p>
          </div>
          {[
            { title: 'Services', links: ['Medicure', 'Manicure', 'Pedicure', 'Facial'] },
            { title: 'Visit', links: ['Book Online', 'Gift Cards', 'Group Bookings', 'Our Story'] },
            { title: 'Support', links: ['FAQ', 'Contact Us', 'Staff Portal', 'Refund Policy'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c7e9c0', marginBottom: 20, letterSpacing: '0.06em' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ fontSize: 13, color: 'rgba(199,233,192,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.target.style.color = '#c7e9c0'; }}
                    onMouseLeave={e => { e.target.style.color = 'rgba(199,233,192,0.6)'; }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(199,233,192,0.1)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
          <span>© {new Date().getFullYear()} Serene Spa. All rights reserved.</span>
          <span style={{ opacity: 0.5 }}>Full system — test cards: 4111... · 5555... · 3782...</span>
        </div>
      </div>
    </footer>
  );
}