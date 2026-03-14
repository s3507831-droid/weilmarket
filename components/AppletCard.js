import { useState } from 'react';
import AppletModal from './AppletModal';

export default function AppletCard({ applet, wallet, onToast }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '1.25rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s',
          animation: 'fadeUp 0.4s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--border2)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 32px var(--glow)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8, fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,106,0,0.1)', border: '1px solid var(--border)',
            boxShadow: '0 0 8px var(--glow)',
          }}>
            {applet.emoji}
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {applet.badges.map(b => <span key={b} className={`badge badge-${b}`}>{b.toUpperCase()}</span>)}
            {applet.hot && <span className="badge badge-hot">🔥HOT</span>}
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
          {applet.name}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text2)', lineHeight: 1.55, marginBottom: '1rem' }}>
          {applet.desc}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>
            {applet.price} <span style={{ fontSize: '0.58rem', color: 'var(--text3)', fontWeight: 400 }}>WUSD</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text3)' }}>⭐ {applet.rating}</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--text3)' }}>⚡ {applet.invokes}</span>
          </div>
        </div>

        <button
          onClick={e => { e.stopPropagation(); setModalOpen(true); }}
          style={{
            width: '100%', marginTop: '0.85rem',
            background: 'rgba(255,106,0,0.08)', border: '1px solid rgba(255,106,0,0.2)',
            color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
            padding: '0.48rem', borderRadius: 4, cursor: 'pointer',
            letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,106,0,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
        >
          👻 Invoke Applet
        </button>
      </div>

      {modalOpen && (
        <AppletModal
          applet={applet}
          wallet={wallet}
          onClose={() => setModalOpen(false)}
          onToast={onToast}
        />
      )}
    </>
  );
}
