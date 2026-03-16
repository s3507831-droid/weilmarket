import { useState, useEffect, useCallback } from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { Toast, DoodleLayer, Loader, PageTransition } from '../components/UI';
import { useSound } from '../lib/useSound';
import { useRouter } from 'next/router';

const BACKEND = 'https://weilmarket-backend.onrender.com';

const PAGE_LABELS = {
  '/':            '🏚 Entering the Haunted Hall',
  '/marketplace': '🛒 Opening the Applet Vault',
  '/dashboard':   '📊 Loading Cursed Analytics',
  '/ai':          '🤖 Awakening the AI Spirits',
  '/governance':  '🗳 Entering the DAO Chamber',
  '/staking':     '💀 Entering the Stake Crypt',
  '/deploy':      '🚀 Preparing for Launch',
};

function shortAddr(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

export default function App({ Component, pageProps }) {
  const [theme, setTheme]                 = useState('halloween');
  const [wallet, setWallet]               = useState(null);
  const [toast,  setToast]                = useState({ msg: '', icon: '👻', visible: false });
  const [loaded, setLoaded]               = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transLabel, setTransLabel]       = useState('');
  const [showModal, setShowModal]         = useState(false);
  const router = useRouter();
  const sound  = useSound();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Restore wallet from localStorage on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('weil_wallet');
    if (saved) {
      setWallet(saved);
      registerUser(saved);
    }
    // Listen for WeilWallet account changes
    if (window.WeilWallet?.on) {
      window.WeilWallet.on('accountsChanged', (accounts) => {
        if (accounts?.length > 0) {
          const addr = typeof accounts[0] === 'string' ? accounts[0] : accounts[0]?.address;
          if (addr) {
            setWallet(addr);
            localStorage.setItem('weil_wallet', addr);
            registerUser(addr);
          }
        } else {
          setWallet(null);
          localStorage.removeItem('weil_wallet');
        }
      });
    }
  }, []);

  async function registerUser(addr) {
    try {
      await fetch(`${BACKEND}/api/users/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: addr }),
      });
    } catch(e) {}
  }

  useEffect(() => {
    const handleStart = (url) => {
      setTransLabel(PAGE_LABELS[url] || 'Loading...');
      setTransitioning(true);
      sound.playWhoosh();
    };
    const handleDone = (url) => {
      setTimeout(() => {
        setTransitioning(false);
        sound.playForPage?.(url);
      }, 300);
    };
    router.events.on('routeChangeStart',    handleStart);
    router.events.on('routeChangeComplete', handleDone);
    router.events.on('routeChangeError',    () => setTransitioning(false));
    return () => {
      router.events.off('routeChangeStart',    handleStart);
      router.events.off('routeChangeComplete', handleDone);
      router.events.off('routeChangeError',    () => {});
    };
  }, [router, sound]);

  const showToast = useCallback((msg, icon = '👻') => {
    setToast({ msg, icon, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  }, []);

  async function connectWallet() {
  await new Promise(r => setTimeout(r, 500));
  
  // Try all possible wallet object names
  const provider = window.WeilWallet || window.weilliptic || window.Weilliptic || window.weil;
  
  console.log('WeilWallet:', window.WeilWallet);
  console.log('weilliptic:', window.weilliptic);
  console.log('Weilliptic:', window.Weilliptic);

  if (provider) {
    try {
      const accounts = await provider.request({ method: 'weil_requestAccounts' });
      console.log('accounts:', accounts);
      if (accounts?.length > 0) {
        const acc = accounts[0];
        const addr = typeof acc === 'string' ? acc : acc?.address ?? acc?.account ?? acc?.id;
        if (addr) {
          setWallet(addr);
          localStorage.setItem('weil_wallet', addr);
          await registerUser(addr);
          showToast('✓ Connected! ' + shortAddr(addr), '👛');
          return;
        }
      }
    } catch(e) {
      console.error('Connect error:', e);
      showToast('Error: ' + e.message, '⚠️');
      return;
    }
  }
  setShowModal(true);
}

  async function handleDisconnect() {
    // Try to disconnect from WeilWallet extension
    if (typeof window !== 'undefined' && window.WeilWallet) {
      try { await window.WeilWallet.request({ method: 'wallet_disconnect' }); } catch(e) {}
    }
    // Always clear local state
    setWallet(null);
    localStorage.removeItem('weil_wallet');
    showToast('Wallet disconnected 👋', '👋');
  }

  function handleTheme(t) {
    setTheme(t);
    sound.playWhoosh();
    const names = { halloween:'Haunted Realm 🎃', dark:'Dark Mode 🌙', light:'Daylight ☀️', neon:'Neon Dimension ⚡' };
    showToast(names[t] || 'Theme changed', '🎨');
  }

  function handleLoaderDone() {
    setLoaded(true);
    sound.playHaunted?.();
  }

  return (
    <>
      {!loaded && <Loader onDone={handleLoaderDone}/>}
      <DoodleLayer/>

      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:'radial-gradient(ellipse at 20% 30%,var(--glow2) 0%,transparent 50%), radial-gradient(ellipse at 80% 70%,var(--glow) 0%,transparent 50%)' }}/>
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        backgroundImage:'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
        backgroundSize:'50px 50px', opacity:0.3 }}/>
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.45) 100%)' }}/>

      <Navbar
        wallet={wallet}
        onConnect={connectWallet}
        onDisconnect={handleDisconnect}
        theme={theme}
        onTheme={handleTheme}
        sound={sound}
      />
      <PageTransition visible={transitioning} label={transLabel}/>

      <main style={{ paddingTop:58, position:'relative', zIndex:2 }}>
        <Component {...pageProps} wallet={wallet} onToast={showToast} sound={sound}/>
      </main>

      <Toast msg={toast.msg} icon={toast.icon} visible={toast.visible}/>

      {/* WeilWallet not installed modal */}
      {showModal && (
  <div style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }}
    onClick={() => setShowModal(false)}>
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:'2rem', maxWidth:400, width:'90%', boxShadow:'0 0 60px rgba(255,106,0,0.2)', position:'relative' }}
      onClick={e => e.stopPropagation()}>
      <button onClick={() => setShowModal(false)}
        style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', color:'var(--text3)', fontSize:'1.2rem', cursor:'pointer' }}>×</button>
      <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
        <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>👛</div>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1.3rem', color:'var(--accent)', marginBottom:'0.5rem' }}>WeilWallet Required</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--text3)', lineHeight:1.7 }}>
          WeilMarket requires the WeilWallet browser extension to connect your wallet and interact with the blockchain.
        </div>
      </div>
      <a href="https://chromewebstore.google.com/search/WeilWallet" target="_blank" rel="noreferrer"
        style={{ display:'block', width:'100%', background:'var(--accent)', color:'#fff', borderRadius:8, padding:'0.85rem', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:'0.75rem', fontWeight:700, textDecoration:'none', letterSpacing:'0.05em', boxSizing:'border-box' }}>
        🔗 Install WeilWallet Extension
      </a>
    </div>
  </div>
)}
    </>
  );
}