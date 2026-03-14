import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppletCard from '../components/AppletCard';
import { MOCK_APPLETS } from '../lib/weil';

export default function Home({ wallet, onToast }) {
  const [counts, setCounts] = useState({ applets:0, invocations:0, wusd:0, devs:0 });
  const featured = MOCK_APPLETS.filter(a => a.hot).slice(0, 4);

  useEffect(() => {
    const targets = { applets:248, invocations:12400, wusd:48200, devs:32 };
    const keys = Object.keys(targets);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      if (step > 60) { setCounts(targets); clearInterval(iv); return; }
      setCounts(Object.fromEntries(keys.map(k => [k, Math.floor(targets[k] * step / 60)])));
    }, 30);
    return () => clearInterval(iv);
  }, []);

  function fmt(n) { return n >= 1000 ? (n/1000).toFixed(1)+'K' : n; }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
      {/* HERO */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem',
        alignItems: 'center', padding: '5rem 0 4rem',
      }} className="hero-grid">
        <div style={{ animation: 'fadeUp 0.6s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--accent)', border: '1px solid rgba(255,106,0,0.3)',
            padding: '0.28rem 0.8rem', borderRadius: 2, marginBottom: '1.5rem',
            background: 'rgba(255,106,0,0.05)',
          }}>
            👻 WeilChain · IIT Mandi Hackathon · Problem 2
          </div>
          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: '3.4rem', lineHeight: 1.05,
            letterSpacing: '0.02em', marginBottom: '1.25rem', color: 'var(--text)',
            textShadow: '0 0 40px var(--glow)',
          }}>
            The <span style={{ color: 'var(--accent)', textShadow: '0 0 20px var(--glow)' }}>Haunted</span> On-Chain Applet Marketplace
          </h1>
          <p style={{ fontSize: '0.84rem', lineHeight: 1.75, color: 'var(--text2)', marginBottom: '2rem', maxWidth: 440 }}>
            Discover, invoke, and monetize AI-powered applets on WeilChain.
            Pay in WUSD, chain spooky workflows, earn on every cursed call.
            Fully decentralised. MCP-native. Zero infrastructure.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/marketplace">
              <button className="btn-primary">🛒 Browse Applets</button>
            </Link>
            <Link href="/deploy">
              <button className="btn-outline">🚀 Deploy Now</button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:'2rem', marginTop:'2.5rem', paddingTop:'2rem', borderTop:'1px solid var(--border)' }}>
            {[
              ['Applets Live', fmt(counts.applets)],
              ['Invocations',  fmt(counts.invocations)],
              ['WUSD',         fmt(counts.wusd)],
              ['Developers',   fmt(counts.devs)],
            ].map(([label, val]) => (
              <div key={label}>
                <span style={{ fontFamily:'var(--font-head)', fontSize:'1.8rem', color:'var(--accent)', display:'block', textShadow:'0 0 12px var(--glow)' }}>{val}</span>
                <span style={{ fontSize:'0.6rem', color:'var(--text3)', letterSpacing:'0.12em', textTransform:'uppercase' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div style={{
          background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:8,
          overflow:'hidden', boxShadow:'0 0 40px var(--glow)',
          animation:'fadeUp 0.7s 0.15s ease both',
        }}>
          <div style={{ background:'var(--bg3)', padding:'0.6rem 1rem', display:'flex', alignItems:'center', gap:'0.5rem', borderBottom:'1px solid var(--border)' }}>
            <div style={{ width:10,height:10,borderRadius:'50%',background:'#ff5f57' }}/>
            <div style={{ width:10,height:10,borderRadius:'50%',background:'#febc2e' }}/>
            <div style={{ width:10,height:10,borderRadius:'50%',background:'#28c840' }}/>
            <span style={{ fontSize:'0.62rem', color:'var(--text3)', marginLeft:'0.5rem' }}>👻 weil-cli · marketplace · asia-south</span>
          </div>
          <div style={{ padding:'1.25rem', fontFamily:'var(--font-mono)', fontSize:'0.7rem', lineHeight:1.9 }}>
            {[
              ['$', "weil-cli invoke -a 3 -p '{\"text\":\"Summarize this\"}'", null],
              [null, null, "✓ Applet invoked · tx_id: 0xf3a2..."],
              [null, null, "✓ Charged: 0.5 WUSD · block: 14829"],
              ['$', "weil-cli chain-applets --workflow '[3,7,12]'", null],
              [null, null, "→ Step 1: NLP Summarizer     ✓"],
              [null, null, "→ Step 2: Translator (EN→HI) ✓"],
              [null, null, "→ Step 3: Voice Synthesizer  ✓"],
              [null, null, "✓ Workflow complete · 3 applets · 1.2 WUSD"],
              ['$', "weil-cli ai-search \"translate hindi\"", null],
              [null, null, "⬡ Top match: Translator v2 (score: 94)"],
            ].map(([prompt, cmd, out], i) => (
              <div key={i} style={{ display:'flex', gap:'0.5rem', marginBottom:'0.05rem' }}>
                {prompt && <span style={{ color:'var(--accent)' }}>{prompt}</span>}
                {cmd    && <span style={{ color:'var(--text)' }}>{cmd}</span>}
                {out    && <span style={{ color:'var(--green)', marginLeft: prompt ? 0 : '1rem' }}>{out}</span>}
              </div>
            ))}
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <span style={{ color:'var(--accent)' }}>$</span>
              <span style={{ animation:'blink 1s step-end infinite', color:'var(--text)' }}>_</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding:'0 0 4rem' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <div className="section-title">🔥 Featured Applets</div>
          <Link href="/marketplace" style={{ fontSize:'0.7rem', color:'var(--accent)', textDecoration:'none', letterSpacing:'0.08em' }}>View all →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem' }}>
          {featured.map(a => <AppletCard key={a.id} applet={a} wallet={wallet} onToast={onToast}/>)}
        </div>
      </div>

      <style>{`
        @media(max-width:768px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
