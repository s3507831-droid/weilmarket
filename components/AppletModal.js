import { useState } from 'react';
import { invokeApplet } from '../lib/weil';

export default function AppletModal({ applet, wallet, onClose, onToast }) {
  const [tab, setTab] = useState('info');
  const [params, setParams] = useState('{"text": "your input here"}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewScore, setReviewScore] = useState('5');

  async function handleInvoke() {
    if (!wallet) { onToast('Connect wallet first! 👛', '⚠️'); return; }
    setLoading(true);
    try {
      const res = await invokeApplet(applet.id, JSON.parse(params || '{}'), wallet);
      setResult(res);
      onToast(`✓ Invoked ${applet.name} · ${applet.price} WUSD`, '⚡');
    } catch (e) {
      onToast('Error: ' + e.message, '❌');
    }
    setLoading(false);
  }

  async function handleReview() {
    if (!reviewText) return;
    await new Promise(r => setTimeout(r, 400));
    onToast(`Review submitted! Score: ${reviewScore} ⭐`, '⭐');
    setReviewText('');
  }

  const MOCK_REVIEWS = [
    { text: 'Great applet, fast and reliable invocations!', score: 5 },
    { text: 'Works perfectly for my NLP pipeline.', score: 5 },
    { text: 'Solid reliability, highly recommended.', score: 4 },
  ];

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 10, width: '100%', maxWidth: 640, maxHeight: '82vh', overflowY: 'auto',
        boxShadow: '0 0 60px var(--glow)',
        animation: 'modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 1,
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.2rem', color: 'var(--accent)' }}>
            {applet.emoji} {applet.name}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {['info', 'invoke', 'reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? 'rgba(255,106,0,0.1)' : 'var(--bg2)',
                border: tab === t ? '1px solid rgba(255,106,0,0.3)' : '1px solid var(--border)',
                color: tab === t ? 'var(--accent)' : 'var(--text3)',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                padding: '0.32rem 0.75rem', borderRadius: 3, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Info tab */}
          {tab === 'info' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                {[
                  ['Price', applet.price + ' WUSD', 'var(--accent)'],
                  ['Rating', '⭐ ' + applet.rating, 'var(--yellow)'],
                  ['Invocations', applet.invokes, 'var(--green)'],
                  ['Category', applet.category, 'var(--text2)'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', color }}>{val}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.65 }}>{applet.desc}</p>
              <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {applet.badges.map(b => <span key={b} className={`badge badge-${b}`}>{b.toUpperCase()}</span>)}
              </div>
            </div>
          )}

          {/* Invoke tab */}
          {tab === 'invoke' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="field-label">Parameters (JSON)</label>
                <textarea className="field-textarea" value={params} onChange={e => setParams(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }}/>
              </div>
              <button
                onClick={handleInvoke}
                disabled={loading}
                style={{
                  width: '100%', background: 'var(--accent)', color: '#fff',
                  border: 'none', cursor: loading ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                  padding: '0.75rem', borderRadius: 4, letterSpacing: '0.06em',
                  textTransform: 'uppercase', opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? '⏳ Invoking...' : '👻 Pay & Invoke'}
              </button>
              {result && (
                <div className="result-box" style={{ marginTop: '1rem' }}>
                  <div className="result-label">Invocation Result</div>
                  <pre className="result-content">{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {tab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {MOCK_REVIEWS.map((r, i) => (
                  <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--yellow)', marginBottom: '0.3rem' }}>{'⭐'.repeat(r.score)}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{r.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="field-label">Your Review</label>
                  <textarea className="field-textarea" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write your review..."/>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="field-label" style={{ margin: 0 }}>Score:</label>
                  <select className="field-select" value={reviewScore} onChange={e => setReviewScore(e.target.value)} style={{ width: 80 }}>
                    {['5','4','3','2','1'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleReview}
                  style={{
                    background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.5rem 1rem', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
}
