import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { SERVICES } from '../services/catalogData';
import { useLang } from '../context/LanguageContext';
import { T } from '../i18n/translations';
import './Home.css';

const FEATURED = SERVICES.filter(s => s.popular);

const IMAGES = {
  hero:    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=80',
  about:   'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
  srv1:    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80',
  srv2:    'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
  srv3:    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
  srv4:    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80',
  gallery1:'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
  gallery2:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  gallery3:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
  gallery4:'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
  cta:     'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1920&q=80',
};

const STAT_NUMS = [1400, 8, 12, 97];

function Counter({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const runCounter = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { runCounter(); }
      else { if (rafRef.current) cancelAnimationFrame(rafRef.current); setVal(0); }
    }, { threshold: 0 });
    obs.observe(el);
    return () => { obs.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

function ServiceRow({ s, img, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`svc-row reveal d${(index % 4) + 1}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="svc-row-bg" style={{ backgroundImage: `url(${img})`, opacity: hov ? 1 : 0 }} />
      <div className="svc-row-overlay" style={{ opacity: hov ? 0.82 : 0 }} />
      <div className="svc-row-content">
        <span className="svc-row-num">0{index + 1}</span>
        <div className="svc-row-info">
          <span className="svc-row-cat">{s.category}</span>
          <h3 className={hov ? 'shifted' : ''}>{s.name}</h3>
        </div>
        <p className="svc-row-desc" style={{ opacity: hov ? 1 : 0 }}>{s.description}</p>
        <span className="svc-row-price">€{s.price}</span>
        <span className="svc-row-arrow" style={{ opacity: hov ? 1 : 0, transform: hov ? 'translateX(0)' : 'translateX(-10px)' }}>→</span>
      </div>
    </div>
  );
}

export default function Home({ onBook }) {
  const { lang } = useLang();
  const t = T[lang];
  useReveal(0.1);
  const heroBgRef = useRef(null);

  useEffect(() => {
    const bg = heroBgRef.current;
    const onScroll = () => {
      if (bg) bg.style.transform = `translateY(${window.scrollY * 0.38}px) scale(1.1)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const svcImages = [IMAGES.srv1, IMAGES.srv2, IMAGES.srv3, IMAGES.srv4];

  return (
    <div className="home page">
      {/* HERO */}
      <section className="hero">
        <div ref={heroBgRef} className="hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
        <div className="hero-overlay" />
        <div className="hero-body container-wide">
          <div className="hero-label reveal">
            <span className="hero-line" />
            <span className="eyebrow">{t.hero_eyebrow}</span>
          </div>
          <h1 className="hero-title">
            <span className="ht-line ht-1">{t.hero_line1}</span>
            <em className="ht-line ht-2">{t.hero_line2}</em>
            <span className="ht-line ht-3">{t.hero_line3}</span>
          </h1>
          <p className="hero-sub reveal d3">{t.hero_sub}</p>
          <div className="hero-actions reveal d4">
            <button className="btn btn-gold" onClick={() => onBook()}>
              <span>{t.hero_reserve}</span>
              <span className="btn-arrow">→</span>
            </button>
            <Link to="/catalog" className="btn btn-outline">
              <span>{t.hero_explore}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...t.ticker, ...t.ticker, ...t.ticker].map((item, i) => (
            <span key={i}>{item}<span className="tk-dot">✦</span></span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="about">
        <div className="container-wide">
          <div className="about-grid">
            <div className="about-visual reveal-left">
              <div className="about-img-wrap">
                <img src={IMAGES.about} alt="NkBeauty salon interior" loading="lazy" />
                <div className="about-img-overlay" />
              </div>
              <div className="about-badge">
                <span className="ab-num">4.9</span>
                <span className="ab-stars">★★★★★</span>
                <span className="ab-label">{t.about_rating}</span>
              </div>
            </div>
            <div className="about-text">
              <p className="eyebrow reveal">{t.about_eyebrow}</p>
              <div className="rule reveal d1"><span className="rule-dot">✦</span></div>
              <h2 className="reveal d2">
                {t.about_h2a}<br />
                <em>{t.about_h2b}</em>
              </h2>
              <p className="reveal d3">{t.about_p1}</p>
              <p className="reveal d4">{t.about_p2}</p>
              <div className="about-checks reveal d5">
                {t.about_checks.map(f => (
                  <div key={f} className="ac-item">
                    <span className="ac-check">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/catalog" className="btn btn-gold reveal d6">
                <span>{t.about_cta}</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container-wide">
          <div className="stats-grid">
            {t.stats.map((s, i) => (
              <div key={`${lang}-${s.label}`} className={`stat-item d${i + 1}`}>
                <div className="stat-num">
                  <Counter target={STAT_NUMS[i]} suffix={s.suffix} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL SERVICES */}
      <section className="svc-section">
        <div className="container-wide">
          <div className="svc-header">
            <p className="eyebrow reveal">{t.svc_eyebrow}</p>
            <div className="rule reveal d1"><span className="rule-dot">✦</span></div>
            <h2 className="reveal d2">{t.svc_h2a}<em>{t.svc_h2b}</em></h2>
          </div>
          <div className="svc-list">
            {FEATURED.map((s, i) => (
              <ServiceRow key={s.id} s={s} img={svcImages[i % svcImages.length]} index={i} />
            ))}
          </div>
          <div className="svc-footer reveal">
            <Link to="/catalog" className="btn btn-outline"><span>{t.svc_all}</span></Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section">
        <div className="gallery-header container-wide">
          <p className="eyebrow reveal">{t.gal_eyebrow}</p>
          <div className="rule reveal d1"><span className="rule-dot">✦</span></div>
          <h2 className="reveal d2">{t.gal_h2a}<em>{t.gal_h2b}</em></h2>
        </div>
        <div className="gallery-grid">
          <div className="gal-item tall reveal-scale d1">
            <img src={IMAGES.gallery1} alt="Hair color" loading="lazy" />
            <div className="gal-overlay"><span>{t.gal_labels[0]}</span></div>
          </div>
          <div className="gal-item reveal-scale d2">
            <img src={IMAGES.gallery2} alt="Portrait" loading="lazy" />
            <div className="gal-overlay"><span>{t.gal_labels[1]}</span></div>
          </div>
          <div className="gal-item wide reveal-scale d3">
            <img src={IMAGES.gallery3} alt="Portrait" loading="lazy" />
            <div className="gal-overlay"><span>{t.gal_labels[2]}</span></div>
          </div>
          <div className="gal-item reveal-scale d4">
            <img src={IMAGES.gallery4} alt="Salon" loading="lazy" />
            <div className="gal-overlay"><span>{t.gal_labels[3]}</span></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-inner reveal-scale">
            <div className="quote-mark">"</div>
            <blockquote>{t.quote}</blockquote>
            <div className="quote-author">
              <div className="qa-line" />
              <span className="qa-name">Salome G.</span>
              <span className="qa-role">{t.quote_role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg" style={{ backgroundImage: `url(${IMAGES.cta})` }} />
        <div className="cta-overlay" />
        <div className="cta-body container">
          <p className="eyebrow reveal">{t.cta_eyebrow}</p>
          <h2 className="reveal d2">{t.cta_h2a}<em>{t.cta_h2b}</em>?</h2>
          <p className="reveal d3">{t.cta_sub}</p>
          <button className="btn btn-gold reveal d4" onClick={() => onBook()}>
            <span>{t.cta_btn}</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}