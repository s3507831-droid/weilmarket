import { useState, useEffect } from 'react';
import { MOCK_PROPOSALS, voteProposal } from '../lib/weil';

export default function Governance({ wallet, onToast, sound }) {
  const [proposals, setProposals] = useState(MOCK_PROPOSALS.map(p => ({ ...p, voted: null })));
  const [animated, setAnimated]   = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  async function vote(id, choice) {
    if (!wallet) { onToast('Connect wallet first!', '⚠️'); return; }
    const res = await voteProposal(id, choice, wallet);
    setProposals(ps => ps.map(p => p.id === id ? { ...p, voted: choice } : p));
    sound?.playVote?.();
    onToast(`Vote cast on ${id} — ${choice.toUpperCase()} 🗳️`, '✓');
  }

  const LEADERS = [
    { rank:'🥇', name:'0xd3aD...bEEf', votes:47 },
    { rank:'🥈', name:'0xC0fF...eE42', votes:38 },
    { rank:'🥉', name:'0xb00B...1E5A', votes:29 },
    { rank:'4.', name:'0xDEAD...C0DE', votes:21 },
    { rank:'5.', name:'0x1337...h4x0', votes:15 },
  ];

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div className="section-title">🗳 DAO Governance</div>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem' }} className="gov-grid">

        {/* Proposals */}
        <div>
          {proposals.map(p => (
            <div key={p.id} style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem', marginBottom:'1rem', transition:'all 0.3s' }}>
              <div style={{ fontSize:'0.6rem', color:'var(--text3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.35rem' }}>
                {p.id} · {p.open ? '🟢 Active' : '🔴 Closed'} · {p.total} votes
              </div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.1rem', color:'var(--text)', marginBottom:'0.5rem' }}>{p.title}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--text2)', lineHeight:1.55, marginBottom:'1rem' }}>{p.desc}</div>

              {/* YES bar */}
              <div style={{ height:6, background:'var(--bg3)', borderRadius:3, overflow:'hidden', marginBottom:'0.25rem' }}>
                <div style={{ height:'100%', width: animated ? p.yes+'%' : '0%', background:'linear-gradient(90deg,var(--green),#00cc88)', borderRadius:3, transition:'width 1.2s cubic-bezier(.4,0,.2,1)' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.62rem', color:'var(--text3)', marginBottom:'0.75rem' }}>
                <span>✓ YES — {p.yes}%</span><span>✗ NO — {p.no}%</span>
              </div>

              {p.open && !p.voted && (
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {['yes','no'].map(c => (
                    <button key={c} onClick={() => vote(p.id, c)} style={{
                      flex:1, background:'none', cursor:'pointer',
                      border: c==='yes' ? '1px solid rgba(57,255,20,0.25)' : '1px solid rgba(255,26,26,0.25)',
                      color: c==='yes' ? 'var(--green)' : 'var(--red)',
                      fontFamily:'var(--font-mono)', fontSize:'0.65rem', fontWeight:700,
                      padding:'0.45rem', borderRadius:4, transition:'all 0.2s',
                      letterSpacing:'0.06em', textTransform:'uppercase',
                    }}>
                      {c==='yes' ? '✓ Vote YES' : '✗ Vote NO'}
                    </button>
                  ))}
                </div>
              )}
              {p.voted && (
                <div style={{ fontSize:'0.68rem', color:'var(--green)', fontWeight:700 }}>
                  ✓ You voted {p.voted.toUpperCase()} on this proposal
                </div>
              )}
              {!p.open && (
                <div style={{ fontSize:'0.65rem', color:'var(--text3)' }}>Voting closed</div>
              )}
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div>
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem' }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>🏆 Voter Leaderboard</div>
            {LEADERS.map(l => (
              <div key={l.name} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.75rem', borderRadius:6, background:'var(--bg2)', border:'1px solid var(--border)', marginBottom:'0.5rem' }}>
                <div style={{ fontFamily:'var(--font-head)', fontSize:'1.1rem', color:'var(--accent)', width:'2rem', textAlign:'center', flexShrink:0 }}>{l.rank}</div>
                <div style={{ flex:1, fontSize:'0.72rem', color:'var(--text)', fontFamily:'var(--font-mono)' }}>{l.name}</div>
                <div style={{ fontSize:'0.68rem', color:'var(--accent2)', fontWeight:700 }}>{l.votes} votes</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.gov-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
