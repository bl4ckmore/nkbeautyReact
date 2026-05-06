import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { SERVICES } from '../services/catalogData';
import './Home.css';

/* ─── featured 3 for editorial list ─── */
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

const TICKER = ['Hair', 'Nails', 'Skin', 'Lashes', 'Brows', 'Massage', 'Balayage', 'Facials'];
const doubled = [...TICKER, ...TICKER, ...TICKER];

const STATS = [
  { num: 1400, suffix: '+', label: 'Clients Served' },
  { num: 8,    suffix: ' yrs', label: 'of Excellence' },
  { num: 12,   suffix: '',     label: 'Expert Artists' },
  { num: 97,   suffix: '%',    label: 'Satisfaction Rate' },
];

/* ─── animated counter ─── */
function Counter({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = ref.current;

    const runCounter = () => {
      // Cancel any in-progress animation
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
      if (entry.isIntersecting) {
        runCounter();
      } else {
        // Reset to 0 when out of view so it counts up fresh next time
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setVal(0);
      }
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => { obs.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── editorial service row ─── */
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
        <p className="svc-row-desc" style={{ opacity: hov ? 1 : 0 }}>{s.desc}</p>
        <span className="svc-row-price">€{s.price}</span>
        <span className="svc-row-arrow" style={{ opacity: hov ? 1 : 0, transform: hov ? 'translateX(0)' : 'translateX(-10px)' }}>→</span>
      </div>
    </div>
  );
}

export default function Home({ onBook }) {
  useReveal(0.1);
  const heroBgRef = useRef(null);

  /* Parallax hero */
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
      {/* ══════ HERO ══════ */}
      <section className="hero">
        <div
          ref={heroBgRef}
          className="hero-bg"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        />
        <div className="hero-overlay" />

        <div className="hero-body container-wide">
          <div className="hero-label reveal">
            <span className="hero-line" />
            <span className="eyebrow">Tbilisi's Premier Beauty Maison</span>
          </div>

          <h1 className="hero-title">
            <span className="ht-line ht-1">The Art of</span>
            <em className="ht-line ht-2">Radiance</em>
            <span className="ht-line ht-3">Redefined.</span>
          </h1>

          <p className="hero-sub reveal d3">
            A sanctuary where expertise meets artistry — every appointment<br />
            is a ritual crafted entirely for you.
          </p>

          <div className="hero-actions reveal d4">
            <button className="btn btn-gold" onClick={() => onBook()}>
              <span>Reserve Your Visit</span>
              <span className="btn-arrow">→</span>
            </button>
            <Link to="/catalog" className="btn btn-outline">
              <span>Explore Services</span>
            </Link>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══════ TICKER ══════ */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {doubled.map((t, i) => (
            <span key={i}>{t}<span className="tk-dot">✦</span></span>
          ))}
        </div>
      </div>

      {/* ══════ ABOUT ══════ */}
      <section className="about">
        <div className="container-wide">
          <div className="about-grid">
            <div className="about-visual reveal-left">
              <div className="about-img-wrap">
                <img src={IMAGES.about} alt="Lumière salon interior" loading="lazy" />
                <div className="about-img-overlay" />
              </div>
              <div className="about-badge">
                <span className="ab-num">4.9</span>
                <span className="ab-stars">★★★★★</span>
                <span className="ab-label">Client Rating</span>
              </div>
            </div>

            <div className="about-text">
              <p className="eyebrow reveal">Our Philosophy</p>
              <div className="rule reveal d1"><span className="rule-dot">✦</span></div>
              <h2 className="reveal d2">
                Beauty is an art.<br />
                <em>We are the artists.</em>
              </h2>
              <p className="reveal d3">At Lumière, treatments are more than services — they are rituals of self-care, moments of transformation. Our master artists bring years of expertise and a passion for craft to every appointment.</p>
              <p className="reveal d4">Using only premium, ethically sourced products, we tailor each experience entirely to you — your features, your lifestyle, your vision.</p>
              <div className="about-checks reveal d5">
                {['Premium Products Only', 'Certified Specialists', 'Personal Consultations', 'Guaranteed Hygiene'].map(f => (
                  <div key={f} className="ac-item">
                    <span className="ac-check">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/catalog" className="btn btn-gold reveal d6">
                <span>View All Services</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="stats">
        <div className="container-wide">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.label} className={`stat-item reveal d${i + 1}`}>
                <div className="stat-num">
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ EDITORIAL SERVICES ══════ */}
      <section className="svc-section">
        <div className="container-wide">
          <div className="svc-header">
            <p className="eyebrow reveal">Signature Treatments</p>
            <div className="rule reveal d1"><span className="rule-dot">✦</span></div>
            <h2 className="reveal d2">What We <em>Do Best</em></h2>
          </div>
          <div className="svc-list">
            {FEATURED.map((s, i) => (
              <ServiceRow key={s.id} s={s} img={svcImages[i % svcImages.length]} index={i} />
            ))}
          </div>
          <div className="svc-footer reveal">
            <Link to="/catalog" className="btn btn-outline"><span>See All 12 Treatments</span></Link>
          </div>
        </div>
      </section>

      {/* ══════ GALLERY ══════ */}
      <section className="gallery-section">
        <div className="gallery-header container-wide">
          <p className="eyebrow reveal">Visual Portfolio</p>
          <div className="rule reveal d1"><span className="rule-dot">✦</span></div>
          <h2 className="reveal d2">Moments of <em>Transformation</em></h2>
        </div>
        <div className="gallery-grid">
          <div className="gal-item tall reveal-scale d1">
            <img src={IMAGES.gallery1} alt="Hair color" loading="lazy" />
            <div className="gal-overlay"><span>Hair Colour</span></div>
          </div>
          <div className="gal-item reveal-scale d2">
            <img src={IMAGES.gallery2} alt="Portrait" loading="lazy" />
            <div className="gal-overlay"><span>Beauty Studio</span></div>
          </div>
          <div className="gal-item wide reveal-scale d3">
            <img src={IMAGES.gallery3} alt="Portrait" loading="lazy" />
            <div className="gal-overlay"><span>Signature Look</span></div>
          </div>
          <div className="gal-item reveal-scale d4">
            <img src={IMAGES.gallery4} alt="Salon" loading="lazy" />
            <div className="gal-overlay"><span>Our Studio</span></div>
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIAL ══════ */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-inner reveal-scale">
            <div className="quote-mark">"</div>
            <blockquote>
              The team at Lumière don't just do your hair — they give you a whole new sense of self. The atmosphere, the precision, the care. There is nowhere else like it.
            </blockquote>
            <div className="quote-author">
              <div className="qa-line" />
              <span className="qa-name">Salome G.</span>
              <span className="qa-role">Client since 2021</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="cta-section">
        <div className="cta-bg" style={{ backgroundImage: `url(${IMAGES.cta})` }} />
        <div className="cta-overlay" />
        <div className="cta-body container">
          <p className="eyebrow reveal">Begin Your Journey</p>
          <h2 className="reveal d2">Ready to <em>Transform</em>?</h2>
          <p className="reveal d3">Book your appointment and step into a world of refined beauty.</p>
          <button className="btn btn-gold reveal d4" onClick={() => onBook()}>
            <span>Book Your Appointment</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
