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
              <span>NkBeauty</span>
            </div>
            <p>{t.ft_desc}</p>
            <div className="footer-social">
              <a href="#">◈</a>
              <a href="#">◉</a>
              <a href="#">◆</a>
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
              <span>14 Rustaveli Ave</span>
              <span>Tbilisi, Georgia</span>
              <span className="fn-sep" />
              <span>Mon–Sat 09–20</span>
              <span>Sunday 10–17</span>
            </div>
            <div className="fn-col">
              <h5>{t.ft_contact}</h5>
              <a href="tel:+99532123456">+995 32 123 456</a>
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
