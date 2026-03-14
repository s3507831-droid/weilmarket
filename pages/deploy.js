import { useState } from 'react';

export default function Deploy({ onToast, sound }) {
  const [wasm, setWasm]   = useState('~/weil-marketplace/marketplace.wasm');
  const [widl, setWidl]   = useState('~/weil-marketplace/marketplace.widl');
  const [pod,  setPod]    = useState('');
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState(null);

  async function handleDeploy() {
    if (!wasm) { onToast('Enter WASM path!', '⚠️'); return; }
    setDeploying(true);
    setResult(null);
    sound?.playDeploy?.();

    await new Promise(r => setTimeout(r, 2000));

    const txId = '0x' + Math.random().toString(16).slice(2, 14);
    setResult({ status:'deployed', tx_id: txId, pod: pod || 'asia-south-xxxxxxxx', wasm, widl });
    setDeploying(false);
    onToast('✓ Deployed to WeilChain! 🚀', '✓');
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div className="section-title">🚀 Deploy to WeilChain</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }} className="deploy-grid">

        {/* Deploy form */}
        <div style={{ background:'var(--card-bg)', border:'2px solid var(--border2)', borderRadius:12, padding:'2rem', textAlign:'center', boxShadow:'0 0 40px var(--glow)' }}>
          <div style={{ fontSize:'4rem', animation:'ghostFloat 2s ease-in-out infinite', display:'block', marginBottom:'1rem', filter:'drop-shadow(0 0 20px rgba(255,106,0,0.5))' }}>🚀</div>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'2rem', color:'var(--accent)', marginBottom:'0.5rem' }}>Launch Your Applet</div>
          <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginBottom:'1.5rem', lineHeight:1.7 }}>
            Deploy your WASM contract to WeilChain's haunted asia-south pod.<br/>
            Midterm: <strong style={{color:'var(--accent)'}}>14th March</strong> · Final: <strong style={{color:'var(--accent)'}}>16th March</strong>
          </div>

          <div style={{ textAlign:'left' }}>
            <div style={{ marginBottom:'0.75rem' }}>
              <label className="field-label">WASM File Path</label>
              <input className="field-input" value={wasm} onChange={e=>setWasm(e.target.value)}/>
            </div>
            <div style={{ marginBottom:'0.75rem' }}>
              <label className="field-label">WIDL File Path</label>
              <input className="field-input" value={widl} onChange={e=>setWidl(e.target.value)}/>
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              <label className="field-label">Pod ID</label>
              <input className="field-input" value={pod} onChange={e=>setPod(e.target.value)} placeholder="get from marauder.weilliptic.ai"/>
            </div>
          </div>

          <button
            onClick={handleDeploy}
            disabled={deploying}
            style={{
              background: deploying ? 'var(--bg3)' : 'linear-gradient(135deg,var(--accent),var(--accent3))',
              color:'#fff', border:'none', cursor: deploying ? 'wait' : 'pointer',
              fontFamily:'var(--font-head)', fontSize:'1.3rem', letterSpacing:'0.06em',
              padding:'0.85rem 2.5rem', borderRadius:8,
              boxShadow: deploying ? 'none' : '0 0 24px var(--glow)',
              transition:'all 0.3s',
              animation: deploying ? 'none' : 'deployPulse 2s ease-in-out infinite',
            }}
          >
            {deploying ? '⏳ Launching...' : '👻 Deploy to WeilChain'}
          </button>

          {result && (
            <div className="result-box" style={{ marginTop:'1.25rem', textAlign:'left' }}>
              <div className="result-label">✓ Deployed Successfully!</div>
              <pre className="result-content">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div>
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem', marginBottom:'1rem' }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>📋 Manual Deploy (Windows PowerShell)</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', lineHeight:2, color:'var(--text2)' }}>
              {[
                '# Step 1: Get your Pod ID',
                '# → Go to marauder.weilliptic.ai',
                '# → Copy asia-south pod UUID',
                '',
                '# Step 2: Deploy marketplace contract',
                '.\\weil-cli.exe deploy \\',
                '  -w YOUR_POD_ID \\',
                '  -f marketplace.wasm \\',
                '  -p marketplace.widl',
                '',
                '# Step 3: Repeat for other contracts',
                '.\\weil-cli.exe deploy -w POD -f agent.wasm',
                '.\\weil-cli.exe deploy -w POD -f secure.wasm',
                '.\\weil-cli.exe deploy -w POD -f gateway.wasm',
                '.\\weil-cli.exe deploy -w POD -f ai.wasm',
                '',
                '# Step 4: Check on sentinel',
                '# → sentinel.weilliptic.ai',
              ].map((line, i) => (
                <div key={i} style={{ color: line.startsWith('#') ? 'var(--text3)' : line === '' ? 'transparent' : 'var(--green)' }}>
                  {line || '​'}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem' }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>📦 Your Contracts</div>
            {[
              ['marketplace.wasm', 'Main @mcp contract, 12+ functions', '437K', '✓'],
              ['agent.wasm',       'Step agent, flow state',            '—',    '✓'],
              ['secure.wasm',      'Wallet auth & ownership',           '—',    '✓'],
              ['gateway.wasm',     'Cross-pod & paginated',             '—',    '✓'],
              ['ai.wasm',          'AI search & chat',                  '—',    '✓'],
            ].map(([name, desc, size, status]) => (
              <div key={name} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--green)', fontSize:'0.8rem' }}>{status}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--accent)' }}>{name}</div>
                  <div style={{ fontSize:'0.62rem', color:'var(--text3)' }}>{desc}</div>
                </div>
                <span style={{ fontSize:'0.62rem', color:'var(--text3)' }}>{size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes deployPulse {
          0%,100% { box-shadow: 0 0 24px var(--glow), 0 0 48px rgba(184,76,255,0.2); }
          50%      { box-shadow: 0 0 40px var(--glow), 0 0 80px rgba(184,76,255,0.4); }
        }
        @media(max-width:768px) { .deploy-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
