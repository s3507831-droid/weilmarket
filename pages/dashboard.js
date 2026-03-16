import { useEffect, useState, useCallback } from 'react';
import { withdrawEarnings } from '../lib/weil';

const BACKEND = 'https://weilmarket-backend.onrender.com';
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Dashboard({ wallet, onToast }) {
  const [data, setData]           = useState(null);
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [withdrawRes, setWithdrawRes] = useState(null);
  const [loading, setLoading]     = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/users/${wallet}/dashboard`);
      const json = await res.json();
      if (json.success && json.data) setData(json.data);
    } catch(e) {}
    setLoading(false);
  }, [wallet]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  async function handleWithdraw() {
    if (!wallet) { onToast('Connect wallet first!', '⚠️'); return; }
    const res = await withdrawEarnings(Number(withdrawAmt), wallet);
    setWithdrawRes(res);
    onToast('✓ Withdrawn ' + res.amount_wusd + ' WUSD 💸', '✓');
    loadDashboard();
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div className="section-title">📊 My Dashboard</div>

      {!wallet && (
        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'2rem', textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', color:'var(--accent)' }}>👛 Connect your WeilWallet to see your dashboard</div>
        </div>
      )}

      {/* Stats cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          ['My Applets',   data?.my_applets  ?? '0', 'registered'],
          ['WUSD Balance', data?.balance     ?? '0.0000', 'WUSD'],
          ['Earnings',     data?.earnings    ?? '0.0000', 'total WUSD'],
          ['Invocations',  data?.invocations ?? '0', 'total calls'],
        ].map(([label, val, sub]) => (
          <div key={label} style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.2rem', transition:'all 0.3s' }}>
            <div style={{ fontSize:'0.6rem', color:'var(--text3)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>{label}</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1.8rem', color:'var(--accent)' }}>{loading ? '...' : val}</div>
            <div style={{ fontSize:'0.62rem', color:'var(--text3)', marginTop:'0.25rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem', marginBottom:'1rem' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>📊 Weekly Revenue (WUSD)</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:'0.5rem', height:100, marginBottom:'1.5rem' }}>
          {(data?.weekly_revenue ?? [0,0,0,0,0,0,0]).map((v, i) => {
            const arr = data?.weekly_revenue ?? [0,0,0,0,0,0,0];
            const max = Math.max(...arr, 1);
            return (
              <div key={i} style={{ flex:1, position:'relative' }}>
                <div title={`${DAYS[i]}: ${v} WUSD`} style={{
                  background:'linear-gradient(180deg,var(--accent),rgba(255,106,0,0.3))',
                  borderRadius:'3px 3px 0 0',
                  height: Math.max((v/max*90), 4) + 'px',
                  transition:'height 1s ease', cursor:'pointer',
                }}/>
                <div style={{ textAlign:'center', fontSize:'0.52rem', color:'var(--text3)', marginTop:'0.3rem' }}>{DAYS[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdraw */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem', marginBottom:'1rem' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>💸 Withdraw Earnings</div>
        <div style={{ display:'flex', gap:'0.75rem', maxWidth:400 }}>
          <input className="field-input" type="number" value={withdrawAmt} onChange={e=>setWithdrawAmt(e.target.value)} placeholder="500000 (micro-WUSD)"/>
          <button className="btn-primary" style={{ whiteSpace:'nowrap' }} onClick={handleWithdraw}>Withdraw</button>
        </div>
        {withdrawRes && (
          <div className="result-box" style={{ marginTop:'1rem' }}>
            <div className="result-label">Response</div>
            <pre className="result-content">{JSON.stringify(withdrawRes, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Audit trail */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)' }}>🔍 Audit Trail</div>
          <button onClick={loadDashboard} style={{ background:'none', border:'1px solid var(--border)', color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:'0.6rem', padding:'0.25rem 0.6rem', borderRadius:3, cursor:'pointer' }}>↻ Refresh</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.7rem' }}>
            <thead>
              <tr>{['Function','Applet','Amount','When','Status'].map(h=>(
                <th key={h} style={{ textAlign:'left', fontSize:'0.58rem', color:'var(--text3)', letterSpacing:'0.12em', textTransform:'uppercase', padding:'0.5rem 0.75rem', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {!wallet ? (
                <tr><td colSpan={5} style={{ padding:'2rem', textAlign:'center', color:'var(--text3)' }}>Connect wallet to see history</td></tr>
              ) : !data?.audit?.length ? (
                <tr><td colSpan={5} style={{ padding:'2rem', textAlign:'center', color:'var(--text3)' }}>No transactions yet — invoke an applet to see history here</td></tr>
              ) : data.audit.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--accent)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    {r.fn ?? r.type ?? 'invoke'}
                  </td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--text2)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    {r.applet ?? r.appletName ?? r.appletId?.name ?? '—'}
                  </td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--text3)', fontSize:'0.65rem', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    {r.detail ?? (r.feePaid ? r.feePaid + ' WUSD' : r.amount ? r.amount + ' WUSD' : '—')}
                  </td>
                  <td style={{ padding:'0.65rem 0.75rem', color:'var(--text3)', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    {r.time ?? (r.createdAt ? new Date(r.createdAt).toLocaleTimeString() : '—')}
                  </td>
                  <td style={{ padding:'0.65rem 0.75rem', borderBottom:'1px solid rgba(255,100,0,0.05)' }}>
                    <span style={{ fontSize:'0.62rem', padding:'0.15rem 0.5rem', borderRadius:2, fontWeight:700,
                      background: r.status==='ok'||r.status==='success' ? 'rgba(57,255,20,0.1)' : 'rgba(255,26,26,0.1)',
                      color: r.status==='ok'||r.status==='success' ? 'var(--green)' : 'var(--red)',
                      border: r.status==='ok'||r.status==='success' ? '1px solid rgba(57,255,20,0.2)' : '1px solid rgba(255,26,26,0.2)',
                    }}>
                      {r.status==='ok'||r.status==='success' ? '✓ OK' : '✗ Fail'}
                    </span>
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