import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container-wide">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="fl-mark">✦</span>
              <span>Lumière</span>
            </div>
            <p>A sanctuary of artistry where every treatment is crafted with intention, expertise, and an unwavering commitment to your beauty.</p>
            <div className="footer-social">
              <a href="#">◈</a>
              <a href="#">◉</a>
              <a href="#">◆</a>
            </div>
          </div>

          <div className="footer-nav">
            <div className="fn-col">
              <h5>Services</h5>
              <Link to="/catalog">Hair Treatments</Link>
              <Link to="/catalog">Nail Studio</Link>
              <Link to="/catalog">Skin & Facials</Link>
              <Link to="/catalog">Brows & Lashes</Link>
              <Link to="/catalog">Body Rituals</Link>
            </div>
            <div className="fn-col">
              <h5>Visit</h5>
              <span>14 Rustaveli Ave</span>
              <span>Tbilisi, Georgia</span>
              <span className="fn-sep" />
              <span>Mon–Sat 09–20</span>
              <span>Sunday 10–17</span>
            </div>
            <div className="fn-col">
              <h5>Contact</h5>
              <a href="tel:+99532123456">+995 32 123 456</a>
              <a href="mailto:hello@lumiere.ge">hello@lumiere.ge</a>
              <span className="fn-sep" />
              <Link to="/signin">Book Now</Link>
              <Link to="/orders">My Orders</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lumière Beauty Maison</span>
          <div className="fb-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
