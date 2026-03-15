import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { shortAddr } from '../lib/weil';

const THEMES = [
  { id: 'halloween', emoji: '🎃', label: 'Halloween' },
  { id: 'dark',      emoji: '🌙', label: 'Dark'      },
  { id: 'light',     emoji: '☀️',  label: 'Light'     },
  { id: 'neon',      emoji: '⚡', label: 'Neon'      },
];

const TABS = [
  { href: '/',            full: '🏚 Home'   },
  { href: '/marketplace', full: '🛒 Market' },
  { href: '/dashboard',   full: '📊 Dash'   },
  { href: '/ai',          full: '🤖 AI'     },
  { href: '/governance',  full: '🗳 DAO'    },
  { href: '/staking',     full: '💀 Stake'  },
  { href: '/deploy',      full: '🚀 Deploy' },
];

export default function Navbar({ wallet, onConnect, onDisconnect, theme, onTheme, sound }) {
  const router = useRouter();
  const [scrolled, setScrolled]         = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    const handler = () => setShowDropdown(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDropdown]);

  const click = () => sound?.playClick?.();
  const hover = () => sound?.playHover?.();

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem', height: 58,
        background: 'var(--nav-bg)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.5s, border-color 0.4s',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.35)' : 'none',
      }}>

        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none' }} onClick={click}>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: '1.45rem',
            color: 'var(--accent)', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            textShadow: '0 0 14px var(--glow)', cursor: 'pointer', userSelect: 'none',
          }}>
            <span style={{ display: 'inline-block', animation: 'ghostFloat 3s ease-in-out infinite' }}>👻</span>
            WeilMarket
          </div>
        </Link>

        {/* NAV TABS */}
        <div style={{ display: 'flex', gap: '0.12rem' }} className="nav-tabs-desktop">
          {TABS.map(t => {
            const active = router.pathname === t.href;
            return (
              <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
                <button onClick={click} onMouseEnter={hover} style={{
                  background: active ? 'rgba(255,106,0,0.1)' : 'none',
                  border: active ? '1px solid rgba(255,106,0,0.25)' : '1px solid transparent',
                  cursor: 'pointer', color: active ? 'var(--accent)' : 'var(--text3)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.67rem',
                  padding: '0.35rem 0.72rem', borderRadius: 4,
                  letterSpacing: '0.05em', transition: 'all 0.2s',
                  textTransform: 'uppercase', position: 'relative',
                }}>
                  {t.full}
                  {active && <span style={{
                    position: 'absolute', bottom: -1, left: '50%',
                    transform: 'translateX(-50%)', width: '60%', height: 2,
                    background: 'var(--accent)', borderRadius: 2,
                    boxShadow: '0 0 6px var(--accent)',
                  }}/>}
                </button>
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>

          {/* THEME SWITCHER */}
          <div style={{
            display: 'flex', gap: '0.18rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 7, padding: '0.22rem',
          }}>
            {THEMES.map(th => (
              <button key={th.id}
                onClick={() => { onTheme(th.id); click(); }}
                onMouseEnter={hover}
                title={th.label}
                style={{
                  width: 28, height: 28, borderRadius: 5, border: 'none', cursor: 'pointer',
                  fontSize: '0.8rem',
                  background: theme === th.id ? 'linear-gradient(135deg,var(--accent),var(--accent3))' : 'none',
                  transition: 'all 0.22s',
                  transform: theme === th.id ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: theme === th.id ? '0 0 8px var(--glow)' : 'none',
                }}
              >{th.emoji}</button>
            ))}
          </div>

          {/* WALLET */}
          {wallet ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowDropdown(prev => !prev); click(); }}
                onMouseEnter={hover}
                style={{
                  fontSize: '0.65rem', color: 'var(--text2)',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  padding: '0.3rem 0.7rem', borderRadius: 4,
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--green)', boxShadow: '0 0 7px var(--green)',
                  animation: 'blink 2s step-end infinite', flexShrink: 0,
                }}/>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{shortAddr(wallet)}</span>
                <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>▼</span>
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '0.4rem',
                  minWidth: 200, zIndex: 9999,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                    color: 'var(--text3)', padding: '0.3rem 0.5rem',
                    wordBreak: 'break-all', borderBottom: '1px solid var(--border)',
                    marginBottom: '0.3rem',
                  }}>
                    {wallet}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(wallet);
                      setShowDropdown(false);
                      click();
                    }}
                    style={dropItemStyle}
                  >
                    📋 Copy Address
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      onDisconnect();
                      click();
                    }}
                    style={{ ...dropItemStyle, color: '#ff4444' }}
                  >
                    🔌 Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => { onConnect(); click(); }}
              onMouseEnter={hover}
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700,
                padding: '0.4rem 0.95rem', borderRadius: 4, letterSpacing: '0.05em',
                transition: 'all 0.2s', textTransform: 'uppercase',
                boxShadow: '0 0 14px rgba(255,106,0,0.35)',
              }}
            >Connect Wallet</button>
          )}
        </div>
      </nav>

      <style>{`
        @media(max-width:820px){ .nav-tabs-desktop{ display:none !important; } }
      `}</style>
    </>
  );
}

const dropItemStyle = {
  display: 'block', width: '100%', textAlign: 'left',
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  color: 'var(--text2)', padding: '0.5rem 0.5rem',
  borderRadius: 5, transition: 'background 0.15s',
  letterSpacing: '0.03em',
};