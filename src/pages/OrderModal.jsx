import { useState } from 'react';
import { createOrder, updateOrder, STATUS } from '../services/ordersService';
import { SERVICES } from '../services/catalogData';

const INIT = { clientName:'', service:'', date:'', time:'', price:'', status:'pending', notes:'' };
const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

export default function OrderModal({ order, preService, onClose, onSaved }) {
  const isEdit = !!order;
  const [form, setForm] = useState(() => {
    if (order) return { ...order };
    return { ...INIT, service: preService?.name || '', price: preService?.price || '' };
  });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);

  const ch = (e) => {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      if (name === 'service') {
        const match = SERVICES.find(s => s.name === value);
        if (match) next.price = match.price;
      }
      return next;
    });
    setErrs(e => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.service)           e.service    = 'Required';
    if (!form.date)              e.date       = 'Required';
    if (!form.time)              e.time       = 'Required';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrs(v); return; }
    setBusy(true);
    try {
      const data = { ...form };
      const saved = isEdit ? await updateOrder(order.id, data) : await createOrder(data);
      onSaved(saved, !isEdit);
    } catch (e) {
      setErrs({ _: e.message || 'Save failed. Try again.' });
    } finally { setBusy(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box ord-modal" onClick={e => e.stopPropagation()}>
        <div className="om-header">
          <h2>{isEdit ? 'Edit Appointment' : 'New Appointment'}</h2>
          <button className="om-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div className="om-row">
            <div className="field">
              <label>Client Name</label>
              <input name="clientName" type="text" placeholder="Full name" value={form.clientName} onChange={ch} />
              {errs.clientName && <span className="field-error">{errs.clientName}</span>}
            </div>
            <div className="field">
              <label>Service</label>
              <select name="service" value={form.service} onChange={ch}>
                <option value="">Select…</option>
                {SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              {errs.service && <span className="field-error">{errs.service}</span>}
            </div>
          </div>

          <div className="om-row">
            <div className="field">
              <label>Date</label>
              <input name="date" type="date" value={form.date} onChange={ch} min={new Date().toISOString().split('T')[0]} />
              {errs.date && <span className="field-error">{errs.date}</span>}
            </div>
            <div className="field">
              <label>Time</label>
              <select name="time" value={form.time} onChange={ch}>
                <option value="">Select…</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errs.time && <span className="field-error">{errs.time}</span>}
            </div>
          </div>

          <div className="om-row">
            <div className="field">
              <label>Price (€)</label>
              <input name="price" type="text" value={form.price ? `€${form.price}` : '—'} readOnly style={{ opacity: 0.6, cursor: 'default' }} />
            </div>
            {isEdit && (
              <div className="field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={ch}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea name="notes" rows={3} value={form.notes} onChange={ch} placeholder="Special requests…" style={{ resize:'vertical' }} />
          </div>

          {errs._ && <p style={{ fontSize:'0.78rem', color:'#c87070' }}>⚠ {errs._}</p>}

          <div className="om-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}><span>Cancel</span></button>
            <button type="submit" className="btn btn-gold" disabled={busy}>
              <span>{busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Book Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
