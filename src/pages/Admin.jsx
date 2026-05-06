import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getStats, getAdminOrders, updateOrderStatus, deleteAdminOrder, getUsers,
  getAdminServices, createService, updateService, deleteService,
} from '../services/adminService';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import './Admin.css';

const STATUS_OPTS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const STATUS_COLORS = { Pending:'#c4a35a', Confirmed:'#7aaa8a', Cancelled:'#c87070', Completed:'#7098c8' };
const FILTERS = ['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
const CATEGORIES = ['Hair', 'Nails', 'Skin', 'Brows & Lashes', 'Body'];
const SERVICE_INIT = { category:'', name:'', description:'', duration:'', price:'', icon:'✦', popular: false };

export default function Admin() {
  const { user, signOut } = useAuth();
  const { toasts, addToast } = useToast();

  const [tab, setTab]         = useState('orders');
  const [stats, setStats]     = useState(null);
  const [orders, setOrders]   = useState([]);
  const [users, setUsers]     = useState([]);
  const [services, setServices] = useState([]);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);

  // order delete confirm
  const [delOrderId, setDelOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // service crud
  const [delServiceId, setDelServiceId] = useState(null);
  const [serviceForm, setServiceForm]   = useState(null); // null = closed, {} = open
  const [serviceErrs, setServiceErrs]   = useState({});
  const [serviceBusy, setServiceBusy]   = useState(false);

  useEffect(() => { loadStats(); loadOrders(); }, []);
  useEffect(() => { if (tab === 'users'    && users.length    === 0) loadUsers();    }, [tab]);
  useEffect(() => { if (tab === 'services' && services.length === 0) loadServices(); }, [tab]);
  useEffect(() => { loadOrders(); }, [filter]);

  const loadStats    = async () => { try { setStats(await getStats()); } catch {} };
  const loadOrders   = async () => {
    setLoading(true);
    try { setOrders(await getAdminOrders(filter)); }
    catch { addToast('Failed to load orders', 'error'); }
    finally { setLoading(false); }
  };
  const loadUsers    = async () => {
    setLoading(true);
    try { setUsers(await getUsers()); }
    catch { addToast('Failed to load users', 'error'); }
    finally { setLoading(false); }
  };
  const loadServices = async () => {
    setLoading(true);
    try { setServices(await getAdminServices()); }
    catch { addToast('Failed to load services', 'error'); }
    finally { setLoading(false); }
  };

  // ── Orders ──
  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: updated.status } : o));
      loadStats();
      addToast(`Status → ${status}`, 'success');
    } catch (e) { addToast(e.message || 'Update failed', 'error'); }
    finally { setUpdatingId(null); }
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteAdminOrder(delOrderId);
      setOrders(prev => prev.filter(o => o.id !== delOrderId));
      loadStats();
      addToast('Order deleted', 'success');
    } catch (e) { addToast(e.message || 'Delete failed', 'error'); }
    finally { setDelOrderId(null); }
  };

  // ── Services ──
  const openServiceForm = (service = null) => {
    setServiceErrs({});
    setServiceForm(service
      ? { ...service, price: String(service.price) }
      : { ...SERVICE_INIT }
    );
  };

  const serviceFormCh = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setServiceErrs(e => ({ ...e, [name]: '' }));
  };

  const validateService = () => {
    const e = {};
    if (!serviceForm.category)              e.category    = 'Required';
    if (!serviceForm.name.trim())           e.name        = 'Required';
    if (!serviceForm.description.trim())    e.description = 'Required';
    if (!serviceForm.duration.trim())       e.duration    = 'Required';
    if (!serviceForm.price || isNaN(Number(serviceForm.price)) || Number(serviceForm.price) <= 0)
      e.price = 'Valid price required';
    if (!serviceForm.icon.trim())           e.icon        = 'Required';
    return e;
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const errs = validateService();
    if (Object.keys(errs).length) { setServiceErrs(errs); return; }
    setServiceBusy(true);
    try {
      const dto = { ...serviceForm, price: Number(serviceForm.price) };
      const isEdit = !!serviceForm.id;
      const saved = isEdit
        ? await updateService(serviceForm.id, dto)
        : await createService(dto);
      setServices(prev =>
        isEdit ? prev.map(s => s.id === saved.id ? saved : s) : [...prev, saved]
      );
      addToast(isEdit ? 'Service updated' : 'Service created', 'success');
      setServiceForm(null);
    } catch (err) {
      setServiceErrs({ _: err.message || 'Save failed' });
    } finally { setServiceBusy(false); }
  };

  const handleDeleteService = async () => {
    try {
      await deleteService(delServiceId);
      setServices(prev => prev.filter(s => s.id !== delServiceId));
      addToast('Service deleted', 'success');
    } catch (e) { addToast(e.message || 'Delete failed', 'error'); }
    finally { setDelServiceId(null); }
  };

  const Spinner = () => (
    <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
      <div className="ord-spinner" />
    </div>
  );

  return (
    <div className="admin-page page">
      <Toast toasts={toasts} />

      {/* HEADER */}
      <div className="admin-header">
        <div className="container-wide">
          <div className="admin-header-inner">
            <div>
              <h1>Admin <em>Panel</em></h1>
              <p style={{ fontSize:'0.8rem', color:'var(--cream-dim)', marginTop:'0.25rem' }}>{user?.email}</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <span className="admin-badge">Administrator</span>
              <button className="btn btn-outline" onClick={signOut}><span>Sign Out</span></button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide">

        {/* STATS */}
        {stats && (
          <div className="admin-stats">
            {[
              { label:'Total Orders', value: stats.total,     color:'var(--cream)' },
              { label:'Pending',      value: stats.pending,   color: STATUS_COLORS.Pending   },
              { label:'Confirmed',    value: stats.confirmed, color: STATUS_COLORS.Confirmed },
              { label:'Completed',    value: stats.completed, color: STATUS_COLORS.Completed },
              { label:'Cancelled',    value: stats.cancelled, color: STATUS_COLORS.Cancelled },
            ].map(s => (
              <div className="astat" key={s.label}>
                <span className="astat-num" style={{ color: s.color }}>{s.value}</span>
                <span className="astat-lbl">{s.label}</span>
              </div>
            ))}
            <div className="astat astat-rev">
              <span className="astat-num">€{stats.totalRevenue.toFixed(0)}</span>
              <span className="astat-lbl">Revenue</span>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="admin-tabs">
          {['orders', 'services', 'users'].map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <>
            <div className="admin-filters">
              {FILTERS.map(f => (
                <button key={f} className={`cf-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
            {loading ? <Spinner /> : orders.length === 0 ? (
              <div className="admin-empty"><span style={{ fontSize:'2rem' }}>◈</span><p>No orders found</p></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Client</th><th>Service</th><th>Date / Time</th><th>Price</th><th>Status</th><th>Booked by</th><th></th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><code>#{o.id}</code></td>
                        <td>{o.clientName}</td>
                        <td style={{ color:'var(--cream-dim)' }}>{o.service}</td>
                        <td>
                          <div className="td-date">
                            <span>{o.date}</span>
                            <span className="td-time">{o.time?.substring(0, 5)}</span>
                          </div>
                        </td>
                        <td style={{ color:'var(--gold)' }}>€{o.price}</td>
                        <td>
                          <select
                            className="status-select"
                            value={o.status}
                            disabled={updatingId === o.id}
                            onChange={e => handleStatusChange(o.id, e.target.value)}
                            style={{ color: STATUS_COLORS[o.status] }}
                          >
                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          {o.userName
                            ? <div className="td-user-info"><span>{o.userName}</span><span className="td-user-email">{o.userEmail}</span></div>
                            : <span style={{ color:'var(--cream-dim)' }}>—</span>}
                        </td>
                        <td><button className="btn-del" onClick={() => setDelOrderId(o.id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── SERVICES TAB ── */}
        {tab === 'services' && (
          <>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.25rem' }}>
              <button className="btn btn-gold" onClick={() => openServiceForm()}>
                <span>Add Service</span><span>+</span>
              </button>
            </div>
            {loading ? <Spinner /> : services.length === 0 ? (
              <div className="admin-empty"><span style={{ fontSize:'2rem' }}>◈</span><p>No services yet</p></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Category</th><th>Name</th><th>Duration</th><th>Price</th><th>Popular</th><th></th></tr></thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s.id}>
                        <td><code>#{s.id}</code></td>
                        <td style={{ color:'var(--cream-dim)' }}>{s.category}</td>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                            <span>{s.icon}</span>
                            <span>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ color:'var(--cream-dim)' }}>{s.duration}</td>
                        <td style={{ color:'var(--gold)' }}>€{s.price}</td>
                        <td>{s.popular ? <span style={{ color:'var(--gold)' }}>★</span> : <span style={{ color:'var(--cream-dim)' }}>—</span>}</td>
                        <td>
                          <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button className="ta-btn edit" onClick={() => openServiceForm(s)} title="Edit">✏</button>
                            <button className="btn-del" onClick={() => setDelServiceId(s.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          loading ? <Spinner /> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Orders</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><code>#{u.id}</code></td>
                      <td>{u.name}</td>
                      <td style={{ color:'var(--cream-dim)' }}>{u.email}</td>
                      <td><span className={`role-pill ${u.role}`}>{u.role}</span></td>
                      <td style={{ color:'var(--cream-dim)' }}>{u.createdAt?.split('T')[0]}</td>
                      <td>{u.orderCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ── SERVICE FORM MODAL ── */}
      {serviceForm && (
        <div className="modal-backdrop" onClick={() => setServiceForm(null)}>
          <div className="modal-box ord-modal" style={{ maxWidth:'560px' }} onClick={e => e.stopPropagation()}>
            <div className="om-header">
              <h2>{serviceForm.id ? 'Edit Service' : 'New Service'}</h2>
              <button className="om-close" onClick={() => setServiceForm(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveService} noValidate style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
              <div className="om-row">
                <div className="field">
                  <label>Category</label>
                  <select name="category" value={serviceForm.category} onChange={serviceFormCh}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {serviceErrs.category && <span className="field-error">{serviceErrs.category}</span>}
                </div>
                <div className="field">
                  <label>Icon</label>
                  <input name="icon" type="text" value={serviceForm.icon} onChange={serviceFormCh} placeholder="✦" />
                  {serviceErrs.icon && <span className="field-error">{serviceErrs.icon}</span>}
                </div>
              </div>

              <div className="field">
                <label>Name</label>
                <input name="name" type="text" value={serviceForm.name} onChange={serviceFormCh} placeholder="Service name" />
                {serviceErrs.name && <span className="field-error">{serviceErrs.name}</span>}
              </div>

              <div className="field">
                <label>Description</label>
                <textarea name="description" rows={3} value={serviceForm.description} onChange={serviceFormCh} placeholder="Short description…" style={{ resize:'vertical' }} />
                {serviceErrs.description && <span className="field-error">{serviceErrs.description}</span>}
              </div>

              <div className="om-row">
                <div className="field">
                  <label>Duration</label>
                  <input name="duration" type="text" value={serviceForm.duration} onChange={serviceFormCh} placeholder="60min" />
                  {serviceErrs.duration && <span className="field-error">{serviceErrs.duration}</span>}
                </div>
                <div className="field">
                  <label>Price (€)</label>
                  <input name="price" type="number" value={serviceForm.price} onChange={serviceFormCh} placeholder="0" min="0" />
                  {serviceErrs.price && <span className="field-error">{serviceErrs.price}</span>}
                </div>
              </div>

              <label style={{ display:'flex', alignItems:'center', gap:'0.6rem', cursor:'pointer', fontSize:'0.88rem', color:'var(--cream-dim)' }}>
                <input name="popular" type="checkbox" checked={serviceForm.popular} onChange={serviceFormCh} style={{ width:'auto' }} />
                Mark as Signature / Popular
              </label>

              {serviceErrs._ && <p style={{ fontSize:'0.78rem', color:'#c87070' }}>⚠ {serviceErrs._}</p>}

              <div className="om-footer">
                <button type="button" className="btn btn-outline" onClick={() => setServiceForm(null)}><span>Cancel</span></button>
                <button type="submit" className="btn btn-gold" disabled={serviceBusy}>
                  <span>{serviceBusy ? 'Saving…' : serviceForm.id ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE ORDER CONFIRM ── */}
      {delOrderId && (
        <div className="modal-backdrop" onClick={() => setDelOrderId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:'0.75rem' }}>Delete order?</h2>
            <p style={{ color:'var(--cream-dim)', fontSize:'0.88rem', marginBottom:'2rem' }}>This cannot be undone.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDelOrderId(null)}><span>Cancel</span></button>
              <button className="btn btn-gold" style={{ '--gold':'#c87070','--gold-light':'#d98080' }} onClick={handleDeleteOrder}><span>Delete</span></button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE SERVICE CONFIRM ── */}
      {delServiceId && (
        <div className="modal-backdrop" onClick={() => setDelServiceId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:'0.75rem' }}>Delete service?</h2>
            <p style={{ color:'var(--cream-dim)', fontSize:'0.88rem', marginBottom:'2rem' }}>This will also remove all linked orders.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDelServiceId(null)}><span>Cancel</span></button>
              <button className="btn btn-gold" style={{ '--gold':'#c87070','--gold-light':'#d98080' }} onClick={handleDeleteService}><span>Delete</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
