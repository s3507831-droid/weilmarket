import { useState, useEffect } from 'react';
import AppletCard from '../components/AppletCard';
import { getApplets } from '../lib/weil';

const FILTERS = ['All','NLP','Image','Data','Finance','Utility'];

export default function Marketplace({ wallet, onToast }) {
  const [filter, setFilter]   = useState('All');
  const [query,  setQuery]    = useState('');
  const [applets, setApplets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getApplets().then(data => {
      setApplets(data);
      setLoading(false);
    });
  }, []);

  const visible = applets.filter(a => {
    const matchCat = filter === 'All' || a.category === filter.toLowerCase();
    const q = query.toLowerCase();
    const matchQ = !q || a.name?.toLowerCase().includes(q) || a.desc?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q) || a.category?.includes(q);
    return matchCat && matchQ;
  });

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:'1.75rem' }}>
        <div className="section-title">🛒 All Applets</div>
        <span style={{ fontSize:'0.68rem', color:'var(--text3)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
          {visible.length} applets
        </span>
      </div>

      <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', alignItems:'center', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:4, padding:'0 0.75rem', flex:1, maxWidth:280 }}>
          <span style={{ color:'var(--text3)' }}>🔮</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the haunted market..."
            style={{ background:'none', border:'none', outline:'none', color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:'0.72rem', padding:'0.5rem 0', width:'100%' }}/>
        </div>
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter===f ? 'rgba(255,106,0,0.08)' : 'var(--bg2)',
              border: filter===f ? '1px solid var(--accent)' : '1px solid var(--border)',
              color: filter===f ? 'var(--accent)' : 'var(--text3)',
              fontFamily:'var(--font-mono)', fontSize:'0.62rem', fontWeight:700,
              padding:'0.32rem 0.75rem', borderRadius:3, cursor:'pointer',
              textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.2s',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', color:'var(--text3)', padding:'3rem', fontFamily:'var(--font-head)', fontSize:'1.2rem' }}>👻 Loading applets from blockchain...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1rem' }}>
          {visible.length
            ? visible.map((a,i) => <AppletCard key={a._id ?? a.id ?? i} applet={a} wallet={wallet} onToast={onToast}/>)
            : <div style={{ gridColumn:'1/-1', textAlign:'center', color:'var(--text3)', padding:'3rem', fontFamily:'var(--font-head)', fontSize:'1.2rem' }}>👻 No applets found...</div>
          }
        </div>
      )}
    </div>
  );
}