import { useState, useEffect, useCallback } from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { Toast, DoodleLayer, Loader, PageTransition } from '../components/UI';
import { useSound } from '../lib/useSound';
import { useRouter } from 'next/router';

const PAGE_LABELS = {
  '/':           '🏚 Entering the Haunted Hall',
  '/marketplace':'🛒 Opening the Applet Vault',
  '/dashboard':  '📊 Loading Cursed Analytics',
  '/ai':         '🤖 Awakening the AI Spirits',
  '/governance': '🗳 Entering the DAO Chamber',
  '/staking':    '💀 Entering the Stake Crypt',
  '/deploy':     '🚀 Preparing for Launch',
};

export default function App({ Component, pageProps }) {
  const [theme, setTheme]           = useState('halloween');
  const [wallet, setWallet]         = useState(null);
  const [toast, setToast]           = useState({ msg: '', icon: '👻', visible: false });
  const [loaded, setLoaded]         = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transLabel, setTransLabel] = useState('');
  const router = useRouter();
  const sound  = useSound();

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Page transition on route change
  useEffect(() => {
    const handleStart = (url) => {
      setTransLabel(PAGE_LABELS[url] || 'Loading...');
      setTransitioning(true);
      sound.playWhoosh();
    };
    const handleDone  = () => setTimeout(() => setTransitioning(false), 300);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleDone);
    router.events.on('routeChangeError', handleDone);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleDone);
      router.events.off('routeChangeError', handleDone);
    };
  }, [router, sound]);

  const showToast = useCallback((msg, icon = '👻') => {
    setToast({ msg, icon, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  }, []);

  function connectWallet() {
    const addrs = ['0xd3aD...bEEf','0xC0fF...eE42','0xb00B...1E5A','0xDEAD...C0DE'];
    const addr = addrs[Math.floor(Math.random() * addrs.length)];
    setWallet(addr);
    showToast('Wallet connected! ' + addr, '👛');
  }

  function handleTheme(t) {
    setTheme(t);
    sound.playWhoosh();
    const names = { halloween:'Haunted Realm 🎃', dark:'Dark Mode 🌙', light:'Daylight ☀️', neon:'Neon Dimension ⚡' };
    showToast(names[t] || 'Theme changed', '🎨');
  }

  function handleLoaderDone() {
    setLoaded(true);
    sound.playHaunted();
  }

  return (
    <>
      {!loaded && <Loader onDone={handleLoaderDone}/>}
      <DoodleLayer/>
      {/* Atmospheric backgrounds */}
      <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        background:'radial-gradient(ellipse at 20% 30%,var(--glow2) 0%,transparent 50%), radial-gradient(ellipse at 80% 70%,var(--glow) 0%,transparent 50%)'}}/>
      <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        backgroundImage:'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
        backgroundSize:'50px 50px', opacity:0.3 }}/>
      <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        background:'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.45) 100%)'}}/>

      <Navbar wallet={wallet} onConnect={connectWallet} theme={theme} onTheme={handleTheme}/>
      <PageTransition visible={transitioning} label={transLabel}/>

      <main style={{ paddingTop: 58, position: 'relative', zIndex: 2 }}>
        <Component {...pageProps} wallet={wallet} onToast={showToast} sound={sound}/>
      </main>

      <Toast msg={toast.msg} icon={toast.icon} visible={toast.visible}/>
    </>
  );
}
