import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { shortAddr } from '../lib/weil';

const THEMES = [
  { id: 'halloween', emoji: '🎃' },
  { id: 'dark',      emoji: '🌙' },
  { id: 'light',     emoji: '☀️' },
  { id: 'neon',      emoji: '⚡' },
];

const TABS = [
  { href: '/',           label: '🏚 Home'    },
  { href: '/marketplace',label: '🛒 Market'  },
  { href: '/dashboard',  label: '📊 Dash'    },
  { href: '/ai',         label: '🤖 AI'      },
  { href: '/governance', label: '🗳 DAO'     },
  { href: '/staking',    label: '💀 Stake'   },
  { href: '/deploy',     label: '🚀 Deploy'  },
];

export default function Navbar({ wallet, onConnect, theme, onTheme }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem', height: 58,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.5s, border-color 0.4s',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: '1.5rem',
            color: 'var(--accent)', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            textShadow: '0 0 12px var(--glow)', cursor: 'pointer',
          }}>
            <span style={{ display: 'inline-block', animation: 'ghostFloat 3s ease-in-out infinite' }}>👻</span>
            WeilMarket
          </div>
        </Link>

        {/* Desktop tabs */}
        <div style={{ display: 'flex', gap: '0.15rem' }} className="nav-tabs-desktop">
          {TABS.map(t => {
            const active = router.pathname === t.href;
            return (
              <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
                <button style={{
                  background: active ? 'rgba(255,106,0,0.08)' : 'none',
                  border: active ? '1px solid rgba(255,106,0,0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  color: active ? 'var(--accent)' : 'var(--text3)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.67rem',
                  padding: '0.35rem 0.7rem', borderRadius: 4,
                  letterSpacing: '0.05em', transition: 'all 0.2s',
                  textTransform: 'uppercase',
                }}>
                  {t.label}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Theme switcher */}
          <div style={{
            display: 'flex', gap: '0.2rem',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '0.2rem',
          }}>
            {THEMES.map(th => (
              <button key={th.id} onClick={() => onTheme(th.id)} title={th.id} style={{
                width: 26, height: 26, borderRadius: 4, border: 'none',
                cursor: 'pointer', fontSize: '0.75rem',
                background: theme === th.id ? 'var(--accent)' : 'none',
                transition: 'all 0.2s',
              }}>
                {th.emoji}
              </button>
            ))}
          </div>

          {/* Wallet */}
          {wallet ? (
            <div style={{
              fontSize: '0.65rem', color: 'var(--text2)',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              padding: '0.28rem 0.65rem', borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }}/>
              {shortAddr(wallet)}
            </div>
          ) : (
            <button onClick={onConnect} style={{
              background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700,
              padding: '0.38rem 0.9rem', borderRadius: 4, letterSpacing: '0.05em',
              transition: 'all 0.2s', textTransform: 'uppercase',
              boxShadow: '0 0 12px rgba(255,106,0,0.3)',
            }}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-tabs-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
