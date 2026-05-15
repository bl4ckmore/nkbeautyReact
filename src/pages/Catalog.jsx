import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { getServices } from '../services/servicesService';
import { SERVICES as FALLBACK } from '../services/catalogData';
import { useLang } from '../context/LanguageContext';
import { T } from '../i18n/translations';
import './Catalog.css';

const SERVICE_IMGS = {
  'Balayage & Toning':    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  'Keratin Smoothing':    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
  'Precision Cut & Style':'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  'Classic Manicure':     'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
  'Gel Extension Set':    'https://images.unsplash.com/photo-1604655914635-a6d157bfebfd?auto=format&fit=crop&w=600&q=80',
  'Luxury Pedicure':      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  'Deep Hydration Facial':'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
  'Microdermabrasion':    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
  'Lash Lift & Tint':     'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80',
  'Brow Lamination':      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
  'Aromatherapy Massage': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'Body Wrap & Scrub':    'https://images.unsplash.com/photo-1485893086445-ed75865251e0?auto=format&fit=crop&w=600&q=80',
};

export default function Catalog({ onBook }) {
  const [services,   setServices]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [active,     setActive]     = useState('all');
  const [loading,    setLoading]    = useState(true);
  const { lang } = useLang();
  const t = T[lang];
  useReveal(0.1, [loading]);

  useEffect(() => {
    getServices().then(data => {
      setServices(data);
      setCategories([...new Set(data.map(s => s.category))]);
    }).catch(() => {
      setServices(FALLBACK);
      setCategories([...new Set(FALLBACK.map(s => s.category))]);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = active === 'all' ? services : services.filter(s => s.category === active);

  return (
    <div className="catalog page">
      <div className="cat-hero">
        <div className="cat-hero-bg" />
        <div className="container-wide">
          <p className="eyebrow reveal">{t.cat_eyebrow}</p>
          <div className="rule reveal d1"><span className="rule-dot">✦</span></div>
          <h1 className="reveal d2">{t.cat_h1a}<br /><em>{t.cat_h1b}</em></h1>
          <p className="reveal d3">{t.cat_sub}</p>
        </div>
      </div>

      <div className="cat-filters-wrap">
        <div className="container-wide">
          <div className="cat-filters">
            <button
              className={`cf-btn ${active === 'all' ? 'active' : ''}`}
              onClick={() => setActive('all')}
            >
              {t.cat_filter_all}
            </button>
            {categories.map(c => (
              <button
                key={c}
                className={`cf-btn ${active === c ? 'active' : ''}`}
                onClick={() => setActive(c)}
              >
                {t.categories[c] || c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide">
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'6rem 0' }}>
            <div style={{ width:36, height:36, border:'2px solid rgba(196,163,90,0.3)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <div className="cat-grid">
            {filtered.map((s, i) => (
              <ServiceCard
                key={s.id}
                s={s}
                t={t}
                img={SERVICE_IMGS[s.name]}
                delay={Math.min(i % 3, 2) + 1}
                onBook={() => onBook(s)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="cat-bottom">
        <div className="container-wide">
          <div className="cat-bottom-inner">
            <div>
              <h3>{t.cat_help_h}</h3>
              <p>{t.cat_help_p}</p>
            </div>
            <a href="tel:+99532123456" className="btn btn-gold">
              <span>{t.cat_call}</span><span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ s, t, img, delay, onBook }) {
  const [hov, setHov] = useState(false);
  return (
    <div className={`sc reveal d${delay}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="sc-img" style={{ opacity: hov ? 1 : 0 }}>
        {img && <img src={img} alt={s.name} loading="lazy" />}
      </div>
      <div className="sc-img-overlay" style={{ opacity: hov ? 1 : 0 }} />
      {s.popular && <div className="sc-badge">{t.cat_badge}</div>}
      <div className="sc-body">
        <div className="sc-top">
          <span className="sc-icon">{s.icon}</span>
          <span className="sc-cat eyebrow">{t.categories[s.category] || s.category}</span>
        </div>
        <h3 className="sc-name">{s.name}</h3>
        <p className="sc-desc">{s.description}</p>
      </div>
      <div className="sc-footer">
        <div className="sc-meta">
          <div><span className="sc-meta-label">{t.cat_duration}</span><span className="sc-meta-val">{s.duration}</span></div>
          <div><span className="sc-meta-label">{t.cat_price}</span><span className="sc-meta-price">€{s.price}</span></div>
        </div>
        <button className="sc-book" onClick={onBook}>{t.cat_book} →</button>
      </div>
    </div>
  );
}
