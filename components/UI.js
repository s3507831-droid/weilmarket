import { useEffect, useState } from 'react';

// ── LOADING SCREEN ─────────────────────────────────
export function Loader({ onDone }) {
  const [msg, setMsg] = useState('Summoning blockchain spirits...');
  const [pct, setPct] = useState(0);
  const msgs = [
    'Summoning blockchain spirits...',
    'Awakening smart contracts...',
    'Haunting the asia-south pod...',
    'Brewing WUSD in the cauldron...',
    'The ghosts are ready...',
  ];

  useEffect(() => {
    let i = 0;
    const msgInt = setInterval(() => {
      i = Math.min(i + 1, msgs.length - 1);
      setMsg(msgs[i]);
    }, 480);
    const pctInt = setInterval(() => {
      setPct(p => {
        if (p >= 100) { clearInterval(pctInt); return 100; }
        return p + 2;
      });
    }, 48);
    const done = setTimeout(() => {
      clearInterval(msgInt);
      onDone();
    }, 2700);
    return () => { clearInterval(msgInt); clearInterval(pctInt); clearTimeout(done); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#050208',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Bats */}
      {['20%','55%','35%'].map((top, i) => (
        <span key={i} style={{
          position: 'absolute', top, left: '-40px', fontSize: '1.2rem',
          animation: `batFly ${3 + i * 0.5}s linear infinite`,
          animationDelay: `${-i * 1.2}s`, opacity: 0.6,
        }}>🦇</span>
      ))}

      {/* Ghost SVG */}
      <div style={{ animation: 'ghostFloat 2.5s ease-in-out infinite', marginBottom: '2rem', filter: 'drop-shadow(0 0 24px rgba(255,106,0,0.4))' }}>
        <svg viewBox="0 0 160 160" width="150" height="150" fill="none">
          <path fill="#f5dcc8" stroke="#ff6a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M30 95 C28 50 35 20 80 18 C125 16 134 48 132 95 C132 100 138 112 132 118 C126 124 120 115 116 122 C112 129 106 116 100 122 C94 128 88 116 80 122 C72 128 66 116 60 122 C54 128 48 129 44 122 C40 115 34 124 28 118 C22 112 30 100 30 95 Z"
          />
          <ellipse fill="#0a0507" stroke="#ff6a00" strokeWidth="1.5" cx="65" cy="72" rx="9" ry="10"/>
          <ellipse fill="#0a0507" stroke="#ff6a00" strokeWidth="1.5" cx="95" cy="72" rx="9" ry="10"/>
          <ellipse fill="#ff6a00" cx="67" cy="74" rx="3.5" ry="4"/>
          <ellipse fill="#ff6a00" cx="97" cy="74" rx="3.5" ry="4"/>
          <path fill="none" stroke="#0a0507" strokeWidth="2" strokeLinecap="round" d="M68 88 Q80 98 92 88"/>
          <text x="20" y="38" fontSize="12" fill="#ffcc00">✦</text>
          <text x="128" y="34" fontSize="10" fill="#b84cff">✦</text>
        </svg>
      </div>

      <div style={{ fontFamily: 'Creepster, cursive', fontSize: '2.6rem', color: '#ff6a00', letterSpacing: '0.08em', marginBottom: '0.5rem', textShadow: '0 0 30px rgba(255,106,0,0.6)' }}>
        👻 WeilMarket
      </div>
      <div style={{ fontSize: '0.72rem', color: '#c09878', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '2rem' }}>
        Haunted Applet Marketplace · IIT Mandi
      </div>
      <div style={{ width: 280, height: 4, background: 'rgba(255,106,0,0.1)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,106,0,0.2)', marginBottom: '0.75rem' }}>
        <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg,#ff6a00,#b84cff,#ff6a00)', borderRadius: 4, transition: 'width 0.1s linear' }}/>
      </div>
      <div style={{ fontSize: '0.63rem', color: '#7a5545', letterSpacing: '0.15em' }}>{msg}</div>

      <style>{`
        @keyframes batFly {
          0%   { transform: translateX(0) translateY(0); }
          25%  { transform: translateX(25vw) translateY(-20px); }
          50%  { transform: translateX(50vw) translateY(5px); }
          75%  { transform: translateX(75vw) translateY(-15px); }
          100% { transform: translateX(110vw) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── PAGE TRANSITION ────────────────────────────────
export function PageTransition({ visible, label }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'radial-gradient(ellipse at center, var(--bg3) 0%, var(--bg) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '1.25rem',
      opacity: visible ? 1 : 0, pointerEvents: visible ? 'all' : 'none',
      transition: 'opacity 0.25s',
    }}>
      <div style={{ fontSize: '3rem', animation: 'ghostFloat 1s ease-in-out infinite' }}>👻</div>
      <div style={{ fontFamily: 'Creepster, cursive', fontSize: '1.3rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
            animation: `dotBounce 0.6s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}/>
        ))}
      </div>
      <style>{`
        @keyframes dotBounce {
          0%,100% { transform: translateY(0); opacity: 0.4; }
          50%      { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── TOAST ──────────────────────────────────────────
export function Toast({ msg, icon, visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000,
      background: 'var(--bg2)', border: '1px solid var(--border2)',
      borderRadius: 6, padding: '0.85rem 1.2rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px var(--glow)',
      maxWidth: 340, minWidth: 220,
      transform: visible ? 'translateY(0)' : 'translateY(100px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <span style={{ fontSize: '1.1rem' }}>{icon || '👻'}</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--text)', letterSpacing: '0.02em' }}>{msg}</span>
    </div>
  );
}

// ── DOODLE LAYER ───────────────────────────────────
export function DoodleLayer() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {/* Ghost 1 — top left */}
      <div style={{ position: 'absolute', top: '8%', left: '3%', opacity: 0.12, animation: 'ghostDrift1 14s ease-in-out infinite' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path fill="#f5dcc8" stroke="#ff6a00" strokeWidth="2.2" strokeLinecap="round"
            d="M14 62 C13 38 19 13 50 11 C81 9 88 35 87 62 C87 66 92 74 87 79 C82 84 78 75 74 80 C70 85 65 75 50 80 C35 75 30 85 26 80 C22 75 17 84 12 79 C7 74 14 66 14 62 Z"/>
          <ellipse fill="#120a0d" cx="36" cy="44" rx="7" ry="8"/>
          <ellipse fill="#120a0d" cx="64" cy="44" rx="7" ry="8"/>
          <ellipse fill="#ff6a00" cx="38" cy="46" rx="2.5" ry="3"/>
          <ellipse fill="#ff6a00" cx="66" cy="46" rx="2.5" ry="3"/>
          <path fill="none" stroke="#120a0d" strokeWidth="1.8" strokeLinecap="round" d="M40 56 Q50 64 60 56"/>
          <text x="12" y="18" fontSize="9" fill="#ffcc00">✦</text>
          <text x="80" y="14" fontSize="7" fill="#b84cff">★</text>
        </svg>
      </div>

      {/* Ghost 2 — right */}
      <div style={{ position: 'absolute', top: '38%', right: '3%', opacity: 0.11, animation: 'ghostDrift2 18s ease-in-out infinite' }}>
        <svg width="85" height="85" viewBox="0 0 85 85" fill="none">
          <path fill="#f5dcc8" stroke="#b84cff" strokeWidth="2.2" strokeLinecap="round"
            d="M12 52 C11 30 17 10 42 9 C67 8 74 28 73 52 C73 56 78 63 73 68 C68 73 64 64 61 69 C57 74 52 63 42 68 C32 63 27 74 23 69 C19 64 15 73 10 68 C5 63 12 56 12 52 Z"/>
          <ellipse fill="#120a0d" cx="31" cy="37" rx="6" ry="7"/>
          <ellipse fill="#120a0d" cx="53" cy="37" rx="6" ry="7"/>
          <ellipse fill="#b84cff" cx="33" cy="39" rx="2" ry="2.5"/>
          <ellipse fill="#b84cff" cx="55" cy="39" rx="2" ry="2.5"/>
          <path fill="none" stroke="#120a0d" strokeWidth="1.6" strokeLinecap="round" d="M35 49 Q42 55 49 49"/>
          <text x="64" y="12" fontSize="8" fill="#ffcc00">✦</text>
        </svg>
      </div>

      {/* Ghost 3 — bottom left */}
      <div style={{ position: 'absolute', bottom: '18%', left: '6%', opacity: 0.1, animation: 'ghostDrift1 22s ease-in-out infinite reverse' }}>
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <path fill="#f5dcc8" stroke="#ff6a00" strokeWidth="2" strokeLinecap="round"
            d="M11 44 C10 26 14 9 35 8 C56 7 61 24 60 44 C60 47 64 53 60 57 C56 61 52 54 50 58 C47 62 43 54 35 58 C27 54 23 62 20 58 C17 54 13 61 9 57 C5 53 11 47 11 44 Z"/>
          <ellipse fill="#120a0d" cx="26" cy="31" rx="5" ry="6"/>
          <ellipse fill="#120a0d" cx="44" cy="31" rx="5" ry="6"/>
          <ellipse fill="#ff6a00" cx="28" cy="33" rx="1.8" ry="2"/>
          <ellipse fill="#ff6a00" cx="46" cy="33" rx="1.8" ry="2"/>
          <path fill="none" stroke="#120a0d" strokeWidth="1.5" strokeLinecap="round" d="M29 41 Q35 46 41 41"/>
        </svg>
      </div>

      {/* Robot — bottom right */}
      <div style={{ position: 'absolute', bottom: '25%', right: '5%', opacity: 0.1, animation: 'robotBob 12s ease-in-out infinite' }}>
        <svg width="90" height="108" viewBox="0 0 90 108" fill="none">
          <rect x="16" y="8" width="58" height="44" rx="8" fill="#1a0f13" stroke="#ff6a00" strokeWidth="2.2"/>
          <rect x="24" y="18" width="14" height="11" rx="3" fill="#ff6a00" opacity="0.8"/>
          <rect x="52" y="18" width="14" height="11" rx="3" fill="#ff6a00" opacity="0.8"/>
          <rect x="28" y="21" width="6" height="5" rx="1" fill="#ffcc00"/>
          <rect x="56" y="21" width="6" height="5" rx="1" fill="#ffcc00"/>
          <rect x="26" y="37" width="38" height="9" rx="3" fill="#0a0507" stroke="#ff6a00" strokeWidth="1.3"/>
          <circle cx="34" cy="41.5" r="2" fill="#ff6a00"/>
          <circle cx="40" cy="41.5" r="2" fill="#ff6a00" opacity="0.5"/>
          <circle cx="46" cy="41.5" r="2" fill="#ff6a00"/>
          <circle cx="52" cy="41.5" r="2" fill="#ff6a00" opacity="0.5"/>
          <line x1="45" y1="8" x2="45" y2="2" stroke="#ff6a00" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="45" cy="2" r="2.5" fill="#b84cff"/>
          <rect x="10" y="56" width="70" height="42" rx="6" fill="#1a0f13" stroke="#ff6a00" strokeWidth="2"/>
          <rect x="20" y="63" width="50" height="25" rx="4" fill="#0a0507" stroke="#ff6a00" strokeWidth="1"/>
          <circle cx="32" cy="75" r="5" fill="none" stroke="#ff6a00" strokeWidth="1.5"/>
          <circle cx="32" cy="75" r="2" fill="#ff6a00"/>
          <rect x="42" y="70" width="20" height="3" rx="1.5" fill="#ff6a00" opacity="0.5"/>
          <rect x="42" y="76" width="14" height="3" rx="1.5" fill="#b84cff" opacity="0.5"/>
          <rect x="0"  y="57" width="10" height="28" rx="4" fill="#1a0f13" stroke="#ff6a00" strokeWidth="1.6"/>
          <rect x="80" y="57" width="10" height="28" rx="4" fill="#1a0f13" stroke="#ff6a00" strokeWidth="1.6"/>
          <rect x="18" y="99" width="16" height="9" rx="3" fill="#1a0f13" stroke="#ff6a00" strokeWidth="1.3"/>
          <rect x="56" y="99" width="16" height="9" rx="3" fill="#1a0f13" stroke="#ff6a00" strokeWidth="1.3"/>
          <text x="2" y="52" fontSize="8" fill="#ffcc00">✦</text>
          <text x="78" y="46" fontSize="7" fill="#b84cff">✦</text>
        </svg>
      </div>

      {/* Skull — mid left */}
      <div style={{ position: 'absolute', top: '55%', left: '1%', opacity: 0.09, animation: 'ghostDrift2 20s ease-in-out infinite' }}>
        <svg width="58" height="62" viewBox="0 0 58 62" fill="none">
          <path fill="#f5dcc8" stroke="#ff6a00" strokeWidth="1.8" strokeLinecap="round"
            d="M10 32 C10 14 17 5 29 4 C41 3 50 13 50 31 C50 40 48 45 46 47 L46 55 C46 57 44 59 29 59 C14 59 12 57 12 55 L12 47 C10 45 10 40 10 32 Z"/>
          <ellipse fill="#0a0507" cx="19" cy="27" rx="6.5" ry="8"/>
          <ellipse fill="#0a0507" cx="39" cy="27" rx="6.5" ry="8"/>
          <ellipse fill="#ff6a00" cx="19" cy="27" rx="2.5" ry="3.5" opacity="0.5"/>
          <ellipse fill="#ff6a00" cx="39" cy="27" rx="2.5" ry="3.5" opacity="0.5"/>
          <path fill="#0a0507" d="M26 38 L29 34 L32 38 Q29 40 26 38 Z"/>
          <rect x="17" y="51" width="5.5" height="7" rx="1" fill="#0a0507" stroke="#ff6a00" strokeWidth="0.8"/>
          <rect x="26" y="51" width="5.5" height="7" rx="1" fill="#0a0507" stroke="#ff6a00" strokeWidth="0.8"/>
          <rect x="35" y="51" width="5.5" height="7" rx="1" fill="#0a0507" stroke="#ff6a00" strokeWidth="0.8"/>
        </svg>
      </div>

      {/* Pumpkin — bottom right far */}
      <div style={{ position: 'absolute', bottom: '6%', right: '1%', opacity: 0.09, animation: 'ghostDrift2 24s ease-in-out infinite' }}>
        <svg width="72" height="76" viewBox="0 0 72 76" fill="none">
          <path fill="none" stroke="#39ff14" strokeWidth="2.2" strokeLinecap="round" d="M36 7 C34 4 30 2 28 5 C32 5 34 9 36 11"/>
          <ellipse fill="#ff6a00" stroke="#cc4400" strokeWidth="1.8" cx="36" cy="48" rx="30" ry="24"/>
          <path fill="none" stroke="#cc4400" strokeWidth="1.3" strokeLinecap="round" d="M22 28 Q14 48 22 66" opacity="0.7"/>
          <path fill="none" stroke="#cc4400" strokeWidth="1.3" strokeLinecap="round" d="M50 28 Q58 48 50 66" opacity="0.7"/>
          <path fill="#0a0507" d="M23 40 L27 34 L31 36 L27 42 Z"/>
          <path fill="#0a0507" d="M41 40 L45 34 L49 36 L45 42 Z"/>
          <path fill="#0a0507" d="M19 52 Q24 60 30 55 Q36 60 42 55 Q48 60 53 52 Q46 65 36 65 Q26 65 19 52 Z"/>
        </svg>
      </div>

      <style>{`
        @keyframes ghostDrift1 {
          0%,100% { transform: translate(0,0) rotate(-3deg); }
          25%      { transform: translate(14px,-18px) rotate(2deg); }
          50%      { transform: translate(26px,0) rotate(-1deg); }
          75%      { transform: translate(8px,14px) rotate(3deg); }
        }
        @keyframes ghostDrift2 {
          0%,100% { transform: translate(0,0) rotate(2deg); }
          33%      { transform: translate(-18px,-14px) rotate(-3deg); }
          66%      { transform: translate(-4px,18px) rotate(1deg); }
        }
        @keyframes robotBob {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}
