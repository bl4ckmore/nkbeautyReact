import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const links = [
    { to: '/',        label: 'Home'     },
    { to: '/catalog', label: 'Services' },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--solid' : ''}`}>
        <div className="nav-inner container-wide">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-mark">✦</span>
            Lumière
          </Link>

          <ul className="nav-links">
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={loc.pathname === l.to || (l.to !== '/' && loc.pathname.startsWith(l.to)) ? 'active' : ''}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <button className="btn btn-gold" onClick={onBook}><span>Book Now</span></button>
          </div>

          <button className={`nav-burger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        <div className="nm-top">
          <span className="nav-logo">✦ Lumière</span>
          <button className="nm-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="nm-links">
          {links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          <button onClick={() => { setOpen(false); onBook(); }}>Book Appointment</button>
        </nav>
      </div>
      {open && <div className="nav-shade" onClick={() => setOpen(false)} />}
    </>
  );
}
