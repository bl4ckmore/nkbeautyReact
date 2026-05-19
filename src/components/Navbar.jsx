import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { T } from '../i18n/translations';
import './Navbar.css';
import nkLogo from '../assets/images/nk.png';

export default function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const loc = useLocation();
  const { lang, toggle } = useLang();
  const t = T[lang];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const links = [
    { to: '/',        label: t.nav_home     },
    { to: '/catalog', label: t.nav_services },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--solid' : ''}`}>
        <div className="nav-inner container-wide">
          <Link to="/" className="nav-logo">
            <img src={nkLogo} alt="NK" className="nav-logo-img" />
          BEAUTY
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
            <button className="lang-pill" onClick={toggle} aria-label="Switch language">
              <span className={lang === 'en' ? 'lp-active' : ''}>EN</span>
              <span className="lp-sep">|</span>
              <span className={lang === 'ge' ? 'lp-active' : ''}>GE</span>
            </button>
            <button className="btn btn-gold" onClick={onBook}><span>{t.nav_book}</span></button>
          </div>

          <button className={`nav-burger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        <div className="nm-top">
          <span className="nav-logo"><img src={nkLogo} alt="NK" className="nav-logo-img" />BEAUTY</span>
          <button className="nm-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="nm-links">
          {links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          <button className="nm-book" onClick={() => { setOpen(false); onBook(); }}>{t.nav_book}</button>
          <div className="nm-lang">
            <button className="lang-pill" onClick={toggle} aria-label="Switch language">
              <span className={lang === 'en' ? 'lp-active' : ''}>EN</span>
              <span className="lp-sep">|</span>
              <span className={lang === 'ge' ? 'lp-active' : ''}>GE</span>
            </button>
          </div>
        </nav>
      </div>
      {open && <div className="nav-shade" onClick={() => setOpen(false)} />}
    </>
  );
}