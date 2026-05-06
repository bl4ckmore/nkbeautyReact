import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { getServices } from '../services/servicesService';
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
    if (!form.name.trim())  e.name    = 'Required';
    if (!form.phone.trim()) e.phone   = 'Required';
    if (!form.service)      e.service = 'Required';
    if (!form.date)         e.date    = 'Required';
    if (!form.time)         e.time    = 'Required';
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
      setErrs({ _: e.message || 'Something went wrong. Please try again.' });
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
            <h2>Booking Received!</h2>
            <p>Thank you, <strong>{form.name}</strong>. We'll confirm your appointment shortly.</p>
            <button className="btn btn-gold" onClick={onClose}><span>Close</span></button>
          </div>
        ) : (
          <>
            <div className="bm-header">
              <h2>Book an Appointment</h2>
              <p>Fill in your details and we'll confirm shortly.</p>
            </div>

            <form onSubmit={submit} noValidate>
              <div className="bm-row">
                <div className="field">
                  <label>Full Name</label>
                  <input name="name" type="text" placeholder="Salome Beridze" value={form.name} onChange={ch} />
                  {errs.name && <span className="field-error">{errs.name}</span>}
                </div>
                <div className="field">
                  <label>Phone Number</label>
                  <input name="phone" type="tel" placeholder="+995 5XX XXX XXX" value={form.phone} onChange={ch} />
                  {errs.phone && <span className="field-error">{errs.phone}</span>}
                </div>
              </div>

              <div className="field">
                <label>Service</label>
                <select name="service" value={form.service} onChange={ch}>
                  <option value="">Select a service…</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.category} — {s.name} (€{s.price})</option>
                  ))}
                </select>
                {errs.service && <span className="field-error">{errs.service}</span>}
              </div>

              <div className="bm-row">
                <div className="field">
                  <label>Date</label>
                  <input name="date" type="date" value={form.date} onChange={ch} min={new Date().toISOString().split('T')[0]} />
                  {errs.date && <span className="field-error">{errs.date}</span>}
                </div>
                <div className="field">
                  <label>Time</label>
                  <select name="time" value={form.time} onChange={ch}>
                    <option value="">Select time…</option>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errs.time && <span className="field-error">{errs.time}</span>}
                </div>
              </div>

              <div className="field">
                <label>Notes <span style={{ color:'var(--cream-dim)', fontWeight:400 }}>(optional)</span></label>
                <textarea name="notes" rows={3} placeholder="Any special requests…" value={form.notes} onChange={ch} style={{ resize:'vertical' }} />
              </div>

              {errs._ && <p className="bm-error">⚠ {errs._}</p>}

              <div className="bm-footer">
                <button type="button" className="btn btn-outline" onClick={onClose}><span>Cancel</span></button>
                <button type="submit" className="btn btn-gold" disabled={busy}>
                  <span>{busy ? 'Booking…' : 'Book Appointment'}</span>
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
