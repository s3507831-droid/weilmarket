import { useState, useEffect, useCallback } from 'react';
import { stakeTokens } from '../lib/weil';

const BACKEND = 'https://weilmarket-backend.onrender.com';

const STAKE_POOLS = [
  { id:1, name:'AI Oracle Pool 🤖', apy:24.5, lock:'30 days', lockDays:30, tvl:'12,400', min:100, desc:'Power AI applet inference, earn from invocation fees.' },
  { id:2, name:'DeFi Vault 💰',     apy:18.2, lock:'14 days', lockDays:14, tvl:'8,200',  min:50,  desc:'Support DeFi oracle applets, earn from price feed subs.' },
  { id:3, name:'Flash Pool ⚡',     apy:31.8, lock:'7 days',  lockDays:7,  tvl:'3,100',  min:25,  desc:'High-yield short staking for flash invocations.' },
];

export default function Staking({ wallet, onToast, sound }) {
  const [amounts, setAmounts] = useState({});
  const [myStakes, setMyStakes] = useState([]);

  const loadStakes = useCallback(async () => {
    if (!wallet) return;
    try {
      const res = await fetch(`${BACKEND}/api/staking/${wallet}`);
      const json = await res.json();
      if (json.success) setMyStakes(json.stakes ?? []);
    } catch(e) {}
  }, [wallet]);

  useEffect(() => { loadStakes(); }, [loadStakes]);

  async function handleStake(poolId) {
    const amt = amounts[poolId];
    if (!wallet) { onToast('Connect wallet first!', '⚠️'); return; }
    if (!amt)    { onToast('Enter an amount!', '⚠️'); return; }
    try {
      const res = await fetch(`${BACKEND}/api/staking/stake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet, poolId, amount: Number(amt) }),
      });
      const json = await res.json();
      if (json.success) {
        sound?.playStake?.();
        onToast(`💀 Staked ${amt} WUSD · ${STAKE_POOLS.find(p=>p.id===poolId)?.apy}% APY`, '💎');
        setAmounts(p => ({ ...p, [poolId]: '' }));
        loadStakes();
      } else {
        onToast(json.error ?? 'Stake failed', '⚠️');
      }
    } catch(e) {
      onToast('Stake failed: ' + e.message, '⚠️');
    }
  }

  async function handleUnstake(stakeId) {
    if (!wallet) return;
    try {
      const res = await fetch(`${BACKEND}/api/staking/unstake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet, stakeId }),
      });
      const json = await res.json();
      if (json.success) {
        onToast(`✓ Unstaked! Rewards: ${json.rewards} WUSD 🎃`, '💰');
        loadStakes();
      }
    } catch(e) {}
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div className="section-title">💀 Stake & Earn</div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {STAKE_POOLS.map(p => (
          <div key={p.id} style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:10, padding:'1.5rem', position:'relative', overflow:'hidden', transition:'all 0.3s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='0 8px 32px var(--glow)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle,var(--glow) 0%,transparent 70%)', pointerEvents:'none' }}/>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', color:'var(--accent)', marginBottom:'0.25rem' }}>{p.name}</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', color:'var(--green)', textShadow:'0 0 12px rgba(57,255,20,0.4)', marginBottom:'0.5rem' }}>
              {p.apy}% <span style={{ fontSize:'1rem', color:'var(--text3)' }}>APY</span>
            </div>
            <div style={{ fontSize:'0.68rem', color:'var(--text2)', lineHeight:1.65, marginBottom:'1rem' }}>
              🔒 Lock: {p.lock} &nbsp;|&nbsp; 📦 TVL: {p.tvl} WUSD<br/>{p.desc}
            </div>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <input className="field-input" type="number" placeholder={`Min: ${p.min} WUSD`}
                value={amounts[p.id] || ''} onChange={e => setAmounts(prev => ({ ...prev, [p.id]: e.target.value }))}/>
              <button onClick={() => handleStake(p.id)} style={{
                background:'var(--accent)', color:'#fff', border:'none', cursor:'pointer',
                fontFamily:'var(--font-mono)', fontSize:'0.7rem', fontWeight:700,
                padding:'0.55rem 1rem', borderRadius:4, transition:'all 0.2s',
                letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap',
              }}>Stake</button>
            </div>
          </div>
        ))}
      </div>

      {/* Real stakes from backend */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)' }}>📜 My Stakes</div>
          <button onClick={loadStakes} style={{ background:'none', border:'1px solid var(--border)', color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:'0.6rem', padding:'0.25rem 0.6rem', borderRadius:3, cursor:'pointer' }}>↻ Refresh</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.7rem' }}>
            <thead>
              <tr>{['Pool','Staked','APY','Unlocks','Status','Action'].map(h=>(
                <th key={h} style={{ textAlign:'left', fontSize:'0.58rem', color:'var(--text3)', letterSpacing:'0.12em', textTransform:'uppercase', padding:'0.5rem 0.75rem', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {!wallet ? (
                <tr><td colSpan={6} style={{ padding:'2rem', textAlign:'center', color:'var(--text3)' }}>Connect wallet to see your stakes</td></tr>
              ) : myStakes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:'2rem', textAlign:'center', color:'var(--text3)' }}>No active stakes — stake in a pool above to see history here</td></tr>
              ) : myStakes.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--text)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    {STAKE_POOLS.find(p=>p.id===s.poolId)?.name ?? 'Pool ' + s.poolId}
                  </td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--accent)', fontWeight:700, borderBottom:'1px solid rgba(255,100,0,0.05)' }}>{s.amount} WUSD</td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--green)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>{s.apy}%</td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--text3)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    {s.unlocksAt ? new Date(s.unlocksAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding:'0.65rem 0.75rem', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    <span style={{ fontSize:'0.62rem', padding:'0.15rem 0.5rem', borderRadius:2, fontWeight:700, background:'rgba(57,255,20,0.1)', color:'var(--green)', border:'1px solid rgba(57,255,20,0.2)' }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding:'0.65rem 0.75rem', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    <button onClick={() => handleUnstake(s._id)} style={{ background:'none', border:'1px solid var(--border)', color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:'0.6rem', padding:'0.25rem 0.5rem', borderRadius:3, cursor:'pointer' }}>
                      Unstake
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}