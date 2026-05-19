import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { T } from '../i18n/translations';
import './Footer.css';

export default function Footer() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <footer className="footer">
      <div className="footer-inner container-wide">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="fl-mark">✦</span>
              <span>NK BEAUTY</span>
            </div>
            <p>{t.ft_desc}</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/nk__beautystudio" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://www.facebook.com/p/NK-Beauty-%E1%83%94%E1%83%9C%E1%83%A5%E1%83%94%E1%83%98-%E1%83%91%E1%83%98%E1%83%A3%E1%83%97%E1%83%98-100063538983928/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <div className="fn-col">
              <h5>{t.ft_services}</h5>
              {t.ft_svc_links.map(l => (
                <Link key={l} to="/catalog">{l}</Link>
              ))}
            </div>
            <div className="fn-col">
              <h5>{t.ft_visit}</h5>
              <span>79, Sulkhan Tsintsadze Street</span>
              <span>Tbilisi, Georgia</span>
              <span className="fn-sep" />
              <span>Mon–Sat 09–20</span>
              <span>Sunday 10–17</span>
            </div>
            <div className="fn-col">
              <h5>{t.ft_contact}</h5>
              <a href="tel:+99532123456">+995 574 13 03 95</a>
              <a href="mailto:hello@nkbeauty.ge">hello@nkbeauty.ge</a>
              <span className="fn-sep" />
              <Link to="/signin">{t.ft_book}</Link>
              <Link to="/orders">{t.ft_orders}</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {t.ft_copy}</span>
          <div className="fb-links">
            <a href="#">{t.ft_privacy}</a>
            <a href="#">{t.ft_terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}