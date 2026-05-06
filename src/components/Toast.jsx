const ICONS = { success: '✓', error: '✕', info: '◈' };
export default function Toast({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item ${t.type}`}>
          <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>{ICONS[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
