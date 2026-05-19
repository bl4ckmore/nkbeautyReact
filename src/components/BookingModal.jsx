import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { getServices } from '../services/servicesService';
import { useLang } from '../context/LanguageContext';
import { T } from '../i18n/translations';
import './BookingModal.css';

const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
               '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
               '17:00','17:30','18:00','18:30','19:00'];

const INIT = { name: '', phone: '', service: '', date: '', time: '', notes: '' };

export default function BookingModal({ preService, onClose }) {
  const [services, setServices] = useState([]);
  const [form, setForm]         = useState({ ...INIT, service: preService?.name || '' });
  const [errs, setErrs]         = useState({});
  const [busy, setBusy]         = useState(false);
  const [success, setSuccess]   = useState(false);
  const { lang } = useLang();
  const t = T[lang];

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
  }, []);

  const ch = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrs(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name    = t.bm_required;
    if (!form.phone.trim()) e.phone   = t.bm_required;
    if (!form.service)      e.service = t.bm_required;
    if (!form.date)         e.date    = t.bm_required;
    if (!form.time)         e.time    = t.bm_required;
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrs(v); return; }
    setBusy(true);
    try {
      const svc = services.find(s => s.name === form.service);
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          clientName: form.name,
          phone:      form.phone,
          serviceId:  svc.id,
          date:       form.date,
          time:       form.time.length === 5 ? `${form.time}:00` : form.time,
          notes:      form.notes,
        }),
      });
      setSuccess(true);
    } catch (e) {
      setErrs({ _: e.message || t.bm_error });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bm-backdrop" onClick={onClose}>
      <div className="bm-box" onClick={e => e.stopPropagation()}>
        <button className="bm-close" onClick={onClose}>✕</button>

        {success ? (
          <div className="bm-success">
            <span className="bm-success-icon">✦</span>
            <h2>{t.bm_success_h}</h2>
            <p>Thank you, <strong>{form.name}</strong>. {t.bm_success_p}</p>
            <button className="btn btn-gold" onClick={onClose}><span>{t.bm_close}</span></button>
          </div>
        ) : (
          <>
            <div className="bm-header">
              <h2>{t.bm_title}</h2>
              <p>{t.bm_sub}</p>
            </div>

            <form onSubmit={submit} noValidate>
              <div className="bm-row">
                <div className="field">
                  <label>{t.bm_name}</label>
                  <input name="name" type="text" placeholder={t.bm_name_ph} value={form.name} onChange={ch} />
                  {errs.name && <span className="field-error">{errs.name}</span>}
                </div>
                <div className="field">
                  <label>{t.bm_phone}</label>
                  <input name="phone" type="tel" placeholder={t.bm_phone_ph} value={form.phone} onChange={ch} />
                  {errs.phone && <span className="field-error">{errs.phone}</span>}
                </div>
              </div>

              <div className="field">
                <label>{t.bm_service}</label>
                <select name="service" value={form.service} onChange={ch}>
                  <option value="">{t.bm_svc_ph}</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>
                      {(t.categories[s.category] || s.category)} — {s.name} (€{s.price})
                    </option>
                  ))}
                </select>
                {errs.service && <span className="field-error">{errs.service}</span>}
              </div>

              <div className="bm-row">
                <div className="field">
                  <label>{t.bm_date}</label>
                  <input name="date" type="date" value={form.date} onChange={ch} min={new Date().toISOString().split('T')[0]} />
                  {errs.date && <span className="field-error">{errs.date}</span>}
                </div>
                <div className="field">
                  <label>{t.bm_time}</label>
                  <select name="time" value={form.time} onChange={ch}>
                    <option value="">{t.bm_time_ph}</option>
                    {TIMES.map(tm => <option key={tm} value={tm}>{tm}</option>)}
                  </select>
                  {errs.time && <span className="field-error">{errs.time}</span>}
                </div>
              </div>

              <div className="field">
                <label>{t.bm_notes} <span style={{ color:'var(--cream-dim)', fontWeight:400 }}>{t.bm_notes_opt}</span></label>
                <textarea name="notes" rows={3} placeholder={t.bm_notes_ph} value={form.notes} onChange={ch} style={{ resize:'vertical' }} />
              </div>

              {errs._ && <p className="bm-error">⚠ {errs._}</p>}

              <div className="bm-footer">
                <button type="button" className="btn btn-outline" onClick={onClose}><span>{t.bm_cancel}</span></button>
                <button type="submit" className="btn btn-gold" disabled={busy}>
                  <span>{busy ? t.bm_busy : t.bm_submit}</span>
                  {!busy && <span>→</span>}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
