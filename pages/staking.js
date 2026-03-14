import { useState } from 'react';
import { STAKE_POOLS, stakeTokens } from '../lib/weil';

export default function Staking({ wallet, onToast, sound }) {
  const [amounts, setAmounts] = useState({});
  const [stakes] = useState([
    { pool:'AI Oracle Pool', staked:'250.0', reward:'6.125', since:'2 days ago' },
    { pool:'DeFi Vault',     staked:'100.0', reward:'2.283', since:'5 days ago' },
  ]);

  async function handleStake(poolId) {
    const amt = amounts[poolId];
    if (!wallet) { onToast('Connect wallet first!', '⚠️'); return; }
    if (!amt) { onToast('Enter an amount!', '⚠️'); return; }
    const res = await stakeTokens(poolId, Number(amt), wallet);
    sound?.playStake?.();
    onToast(`💀 Staked ${amt} WUSD in Pool ${poolId} · ${res.apy}% APY`, '💎');
    setAmounts(p => ({ ...p, [poolId]: '' }));
  }

  async function handleClaim(pool) {
    if (!wallet) { onToast('Connect wallet first!', '⚠️'); return; }
    await new Promise(r => setTimeout(r, 500));
    sound?.playStake?.();
    onToast(`✓ Rewards claimed from ${pool} 🎃`, '💰');
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div className="section-title">💀 Stake & Earn</div>

      {/* Pool cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {STAKE_POOLS.map(p => (
          <div key={p.id} style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:10, padding:'1.5rem', position:'relative', overflow:'hidden', transition:'all 0.3s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='0 8px 32px var(--glow)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ position:'absolute', top:-30, right:-30, width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle,var(--glow) 0%,transparent 70%)', pointerEvents:'none' }}/>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', color:'var(--accent)', marginBottom:'0.25rem' }}>{p.name}</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', color:'var(--green)', textShadow:'0 0 12px rgba(57,255,20,0.4)', marginBottom:'0.5rem' }}>
              {p.apy}% <span style={{ fontSize:'1rem', color:'var(--text3)' }}>APY</span>
            </div>
            <div style={{ fontSize:'0.68rem', color:'var(--text2)', lineHeight:1.65, marginBottom:'1rem' }}>
              🔒 Lock: {p.lock} &nbsp;|&nbsp; 📦 TVL: {p.tvl} WUSD<br/>{p.desc}
            </div>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <input
                className="field-input"
                type="number"
                placeholder={`Min: ${p.min} WUSD`}
                value={amounts[p.id] || ''}
                onChange={e => setAmounts(prev => ({ ...prev, [p.id]: e.target.value }))}
              />
              <button onClick={() => handleStake(p.id)} style={{
                background:'var(--accent)', color:'#fff', border:'none', cursor:'pointer',
                fontFamily:'var(--font-mono)', fontSize:'0.7rem', fontWeight:700,
                padding:'0.55rem 1rem', borderRadius:4, transition:'all 0.2s',
                letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap',
              }}>
                Stake
              </button>
            </div>
            <div style={{ fontSize:'0.68rem', color:'var(--text3)', display:'flex', justifyContent:'space-between', paddingTop:'0.75rem', borderTop:'1px solid var(--border)' }}>
              <span>Pending rewards</span>
              <span style={{ color:'var(--green)', fontWeight:700 }}>+{(Math.random()*2).toFixed(3)} WUSD</span>
            </div>
            <button onClick={() => handleClaim(p.name)} style={{
              width:'100%', marginTop:'0.75rem', background:'none',
              border:'1px solid var(--border)', color:'var(--text2)',
              fontFamily:'var(--font-mono)', fontSize:'0.65rem', fontWeight:700,
              padding:'0.45rem', borderRadius:4, cursor:'pointer', transition:'all 0.2s',
              letterSpacing:'0.06em', textTransform:'uppercase',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text2)'; }}
            >
              💀 Claim Rewards
            </button>
          </div>
        ))}
      </div>

      {/* My stakes */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>📜 My Stakes</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.7rem' }}>
            <thead>
              <tr>{['Pool','Staked','Pending Reward','Since','Action'].map(h=>(
                <th key={h} style={{ textAlign:'left', fontSize:'0.58rem', color:'var(--text3)', letterSpacing:'0.12em', textTransform:'uppercase', padding:'0.5rem 0.75rem', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {stakes.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--text)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>{s.pool}</td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--accent)', fontWeight:700, borderBottom:'1px solid rgba(255,100,0,0.05)' }}>{s.staked} WUSD</td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--green)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>+{s.reward} WUSD</td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--text3)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>{s.since}</td>
                  <td style={{ padding:'0.65rem 0.75rem', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    <button onClick={() => onToast('✓ Unstaked successfully 👻', '✓')} style={{ background:'none', border:'1px solid var(--border)', color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:'0.6rem', padding:'0.25rem 0.5rem', borderRadius:3, cursor:'pointer' }}>
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
