import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders, deleteOrder, STATUS } from '../services/ordersService';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import OrderModal from './OrderModal';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [delId, setDelId]       = useState(null);
  const [editing, setEditing]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const loc = useLocation();
  const { toasts, addToast } = useToast();

  useEffect(() => {
    load();
    if (loc.state?.newOrder) setShowForm(true);
  }, []);

  const load = async () => {
    setLoading(true);
    try   { setOrders(await getOrders()); }
    catch { addToast('Failed to load orders', 'error'); }
    finally { setLoading(false); }
  };

  const handleDel = async () => {
    try   { await deleteOrder(delId); setOrders(p => p.filter(o => o.id !== delId)); addToast('Appointment removed', 'success'); }
    catch { addToast('Failed to delete', 'error'); }
    finally { setDelId(null); }
  };

  const handleSaved = (order, isNew) => {
    if (isNew) setOrders(p => [...p, order]);
    else setOrders(p => p.map(o => o.id === order.id ? order : o));
    addToast(isNew ? 'Appointment booked!' : 'Updated successfully', 'success');
    setShowForm(false); setEditing(null);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const counts = { total: orders.length, pending: 0, confirmed: 0, completed: 0 };
  orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });

  if (loading) return (
    <div className="ord-loading page">
      <div className="ord-spinner" />
      <p>Loading appointments…</p>
    </div>
  );

  return (
    <div className="orders-page page">
      <Toast toasts={toasts} />

      {/* HEADER */}
      <div className="ord-header">
        <div className="container-wide">
          <div className="ord-header-top">
            <div>
              <p className="eyebrow">My Account</p>
              <h1>Appointments</h1>
            </div>
            <button className="btn btn-gold" onClick={() => { setEditing(null); setShowForm(true); }}>
              <span>New Appointment</span>
              <span>+</span>
            </button>
          </div>
          <div className="ord-stats">
            {[
              { key:'total', label:'Total', color: 'var(--cream)' },
              { key:'pending', label:'Pending', color: STATUS.pending.color },
              { key:'confirmed', label:'Confirmed', color: STATUS.confirmed.color },
              { key:'completed', label:'Completed', color: STATUS.completed.color },
            ].map(s => (
              <div key={s.key} className="ord-stat">
                <span className="os-num" style={{ color: s.color }}>{counts[s.key]}</span>
                <span className="os-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide">
        {/* FILTER */}
        <div className="ord-filters">
          {['all','pending','confirmed','completed','cancelled'].map(f => (
            <button key={f} className={`cf-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* TABLE */}
        {filtered.length === 0 ? (
          <div className="ord-empty">
            <span className="oe-icon">◈</span>
            <h3>No appointments</h3>
            <p>{filter !== 'all' ? `No ${filter} appointments found` : "You have no appointments yet"}</p>
            <button className="btn btn-gold" onClick={() => setShowForm(true)}>
              <span>Book First Appointment</span>
            </button>
          </div>
        ) : (
          <div className="ord-table-wrap">
            <table className="ord-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date / Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const st = STATUS[o.status] || STATUS.pending;
                  return (
                    <tr key={o.id}>
                      <td><code>{o.id}</code></td>
                      <td>
                        <div className="td-client">
                          <div className="td-av">{o.clientName[0]}</div>
                          <span>{o.clientName}</span>
                        </div>
                      </td>
                      <td className="td-service">{o.service}</td>
                      <td>
                        <div className="td-date">
                          <span>{o.date}</span>
                          <span className="td-time">{o.time}</span>
                        </div>
                      </td>
                      <td className="td-price">€{o.price}</td>
                      <td>
                        <span className="status-pill" style={{ '--sc': st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td>
                        <div className="td-actions">
                          <button className="ta-btn edit" onClick={() => { setEditing(o); setShowForm(true); }} title="Edit">✏</button>
                          <button className="ta-btn del"  onClick={() => setDelId(o.id)} title="Delete">✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DELETE CONFIRM */}
      {delId && (
        <div className="modal-backdrop" onClick={() => setDelId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:'0.75rem' }}>Delete appointment?</h2>
            <p style={{ color:'var(--cream-dim)', fontSize:'0.88rem', marginBottom:'2rem' }}>This cannot be undone.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDelId(null)}><span>Cancel</span></button>
              <button className="btn btn-gold" style={{ '--gold':'#c87070', '--gold-light':'#d98080' }} onClick={handleDel}><span>Delete</span></button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <OrderModal
          order={editing}
          preService={loc.state?.service}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
