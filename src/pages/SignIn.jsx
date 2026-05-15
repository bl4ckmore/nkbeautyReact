import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignIn.css';

const BG = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80';

export default function SignIn() {
  const [mode, setMode]   = useState('in');
  const [form, setForm]   = useState({ name:'', email:'', password:'', confirm:'' });
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);
  const { signIn, signUp } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const bookService = loc.state?.bookService;

  const ch = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setErr(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (mode === 'up') {
      if (!form.name.trim())         return setErr('Name is required');
      if (form.password !== form.confirm) return setErr('Passwords do not match');
      if (form.password.length < 6)  return setErr('Password must be at least 6 characters');
    }
    if (!form.email.includes('@'))   return setErr('Enter a valid email');
    if (!form.password)              return setErr('Password required');
    setBusy(true);
    try {
      mode === 'in'
        ? await signIn(form.email, form.password)
        : await signUp(form.name, form.email, form.password);
      nav(loc.state?.from || (bookService ? '/orders' : '/'), { replace: true });
    } catch (e) { setErr(e.message || 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="si-page page">
      {/* LEFT: image panel */}
      <div className="si-panel">
        <div className="si-panel-bg" style={{ backgroundImage: `url(${BG})` }} />
        <div className="si-panel-overlay" />
        <div className="si-panel-content">
          <Link to="/" className="si-logo">
            <span>✦</span> NkBeauty
          </Link>
          <div className="si-panel-quote">
            <p>"Where beauty becomes<br /><em>an experience.</em>"</p>
          </div>
          <div className="si-panel-badges">
            <span>★★★★★ 4.9 Rating</span>
            <span>1,400+ Clients</span>
          </div>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="si-form-side">
        <div className="si-form-wrap">
          {bookService && (
            <div className="si-notice">
              <span className="eyebrow">Booking</span>
              <strong>{bookService.name}</strong>
              <span className="si-notice-price">€{bookService.price}</span>
            </div>
          )}

          <h1>{mode === 'in' ? 'Welcome back.' : 'Join NkBeauty.'}</h1>
          <p>{mode === 'in' ? 'Sign in to manage your appointments.' : 'Create your account to book and track appointments.'}</p>

          {/* Toggle */}
          <div className="si-toggle">
            <button className={mode === 'in' ? 'act' : ''} onClick={() => { setMode('in'); setErr(''); }}>Sign In</button>
            <button className={mode === 'up' ? 'act' : ''} onClick={() => { setMode('up'); setErr(''); }}>Create Account</button>
            <div className="si-toggle-indicator" style={{ transform: mode === 'in' ? 'translateX(0)' : 'translateX(100%)' }} />
          </div>

          <form onSubmit={submit} noValidate>
            {mode === 'up' && (
              <div className="field">
                <label>Full Name</label>
                <input name="name" type="text" placeholder="Salome Beridze" value={form.name} onChange={ch} autoComplete="name" />
              </div>
            )}
            <div className="field">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={ch} autoComplete="email" />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={ch} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} />
            </div>
            {mode === 'up' && (
              <div className="field">
                <label>Confirm Password</label>
                <input name="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={ch} autoComplete="new-password" />
              </div>
            )}

            {err && <p className="si-err">⚠ {err}</p>}

            <button type="submit" className="si-submit btn btn-gold" disabled={busy}>
              <span>{busy ? 'Please wait…' : mode === 'in' ? 'Sign In' : 'Create Account'}</span>
              {!busy && <span>→</span>}
            </button>
          </form>

          {mode === 'in' && <a href="#" className="si-forgot">Forgot your password?</a>}

          <p className="si-switch">
            {mode === 'in'
              ? <>No account? <button onClick={() => setMode('up')}>Create one</button></>
              : <>Have an account? <button onClick={() => setMode('in')}>Sign in</button></>
            }
          </p>

          <Link to="/" className="si-back">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
