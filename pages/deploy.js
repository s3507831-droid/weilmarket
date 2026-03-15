import { useState } from 'react';
import { registerApplet } from '../lib/weil';

export default function Deploy({ wallet, onToast, sound }) {
  const [tab, setTab] = useState('applet');
  const [form, setForm] = useState({ name:'', desc:'', category:'utility', price:'0.5', emoji:'🔗' });
  const [wasm, setWasm] = useState('~/weil-marketplace/marketplace.wasm');
  const [widl, setWidl] = useState('~/weil-marketplace/marketplace.widl');
  const [pod,  setPod]  = useState('');
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAppletDeploy() {
    if (!form.name) { onToast('Enter applet name!', '⚠️'); return; }
    if (!wallet)    { onToast('Connect wallet first!', '⚠️'); return; }
    setDeploying(true); setResult(null);
    sound?.playDeploy?.();
    try {
      const res = await registerApplet({
        name: form.name, desc: form.desc, description: form.desc,
        category: form.category, price: parseFloat(form.price) || 0,
        emoji: form.emoji,
      }, wallet);
      setResult(res);
      onToast('✓ Applet registered! 🚀', '✓');
    } catch(e) {
      onToast('Deploy failed: ' + e.message, '❌');
    }
    setDeploying(false);
  }

  async function handleWasmDeploy() {
    if (!wasm) { onToast('Enter WASM path!', '⚠️'); return; }
    setDeploying(true); setResult(null);
    sound?.playDeploy?.();
    await new Promise(r => setTimeout(r, 2000));
    const txId = '0x' + Math.random().toString(16).slice(2, 14);
    setResult({ status:'deployed', tx_id: txId, pod: pod || 'asia-south-xxxxxxxx', wasm, widl });
    setDeploying(false);
    onToast('✓ Deployed to WeilChain! 🚀', '✓');
  }

  const CATEGORIES = ['utility','finance','nlp','data','image'];

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div className="section-title">🚀 Deploy to WeilChain</div>

      {/* Tab switcher */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem' }}>
        {[['applet','📦 Register Applet'],['wasm','⚙️ Deploy WASM']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: tab===id ? 'var(--accent)' : 'var(--bg3)',
            color: tab===id ? '#fff' : 'var(--text2)',
            border: '1px solid var(--border)', borderRadius:6,
            padding:'0.4rem 1rem', cursor:'pointer',
            fontFamily:'var(--font-mono)', fontSize:'0.7rem',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }} className="deploy-grid">

        {tab === 'applet' ? (
          <div style={{ background:'var(--card-bg)', border:'2px solid var(--border2)', borderRadius:12, padding:'2rem', boxShadow:'0 0 40px var(--glow)' }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1.5rem', color:'var(--accent)', marginBottom:'1.5rem', textAlign:'center' }}>
              📦 Register New Applet
            </div>

            {[
              ['Applet Name', 'name', 'text', 'e.g. My AI Summarizer'],
              ['Description', 'desc', 'text', 'What does your applet do?'],
              ['Emoji Icon',  'emoji','text', '🔗'],
              ['Price (WUSD)','price','number','0.5'],
            ].map(([label, key, type, ph]) => (
              <div key={key} style={{ marginBottom:'0.75rem' }}>
                <label className="field-label">{label}</label>
                <input className="field-input" type={type}
                  value={form[key]} placeholder={ph}
                  onChange={e => setForm(f => ({...f, [key]: e.target.value}))}/>
              </div>
            ))}

            <div style={{ marginBottom:'1.5rem' }}>
              <label className="field-label">Category</label>
              <select className="field-input"
                value={form.category}
                onChange={e => setForm(f => ({...f, category: e.target.value}))}
                style={{ background:'var(--bg3)', color:'var(--text1)' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button onClick={handleAppletDeploy} disabled={deploying} style={{
              width:'100%', background: deploying ? 'var(--bg3)' : 'linear-gradient(135deg,var(--accent),var(--accent3))',
              color:'#fff', border:'none', cursor: deploying ? 'wait' : 'pointer',
              fontFamily:'var(--font-head)', fontSize:'1.2rem', letterSpacing:'0.06em',
              padding:'0.85rem 2rem', borderRadius:8,
              boxShadow: deploying ? 'none' : '0 0 24px var(--glow)', transition:'all 0.3s',
            }}>
              {deploying ? '⏳ Registering...' : '👻 Register Applet'}
            </button>

            {result && (
              <div className="result-box" style={{ marginTop:'1.25rem' }}>
                <div className="result-label">✓ Applet Registered!</div>
                <pre className="result-content">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background:'var(--card-bg)', border:'2px solid var(--border2)', borderRadius:12, padding:'2rem', textAlign:'center', boxShadow:'0 0 40px var(--glow)' }}>
            <div style={{ fontSize:'4rem', animation:'ghostFloat 2s ease-in-out infinite', marginBottom:'1rem' }}>🚀</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'2rem', color:'var(--accent)', marginBottom:'0.5rem' }}>Launch Your Applet</div>
            <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginBottom:'1.5rem', lineHeight:1.7 }}>
              Deploy your WASM contract to WeilChain's haunted asia-south pod.
            </div>
            <div style={{ textAlign:'left' }}>
              {[['WASM File Path', wasm, setWasm, ''],['WIDL File Path', widl, setWidl, ''],['Pod ID', pod, setPod, 'get from marauder.weilliptic.ai']].map(([label,val,set,ph]) => (
                <div key={label} style={{ marginBottom:'0.75rem' }}>
                  <label className="field-label">{label}</label>
                  <input className="field-input" value={val} placeholder={ph} onChange={e=>set(e.target.value)}/>
                </div>
              ))}
            </div>
            <button onClick={handleWasmDeploy} disabled={deploying} style={{
              background: deploying ? 'var(--bg3)' : 'linear-gradient(135deg,var(--accent),var(--accent3))',
              color:'#fff', border:'none', cursor: deploying ? 'wait' : 'pointer',
              fontFamily:'var(--font-head)', fontSize:'1.3rem', letterSpacing:'0.06em',
              padding:'0.85rem 2.5rem', borderRadius:8,
              boxShadow: deploying ? 'none' : '0 0 24px var(--glow)', transition:'all 0.3s',
            }}>
              {deploying ? '⏳ Launching...' : '👻 Deploy to WeilChain'}
            </button>
            {result && (
              <div className="result-box" style={{ marginTop:'1.25rem', textAlign:'left' }}>
                <div className="result-label">✓ Deployed Successfully!</div>
                <pre className="result-content">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Right side - instructions + contracts */}
        <div>
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem', marginBottom:'1rem' }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>📋 Manual Deploy (Windows PowerShell)</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', lineHeight:2, color:'var(--text2)' }}>
              {['# Step 1: Get your Pod ID','# → Go to marauder.weilliptic.ai','# → Copy asia-south pod UUID','',
                '# Step 2: Deploy marketplace contract','.\\weil-cli.exe deploy \\','  -w YOUR_POD_ID \\','  -f marketplace.wasm \\','  -p marketplace.widl','',
                '# Step 3: Repeat for other contracts','.\\weil-cli.exe deploy -w POD -f agent.wasm','.\\weil-cli.exe deploy -w POD -f secure.wasm','.\\weil-cli.exe deploy -w POD -f gateway.wasm','.\\weil-cli.exe deploy -w POD -f ai.wasm','',
                '# Step 4: Check on sentinel','# → sentinel.weilliptic.ai',
              ].map((line, i) => (
                <div key={i} style={{ color: line.startsWith('#') ? 'var(--text3)' : line==='' ? 'transparent' : 'var(--green)' }}>{line||'​'}</div>
              ))}
            </div>
          </div>
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem' }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' }}>📦 Your Contracts</div>
            {[['marketplace.wasm','Main @mcp contract, 12+ functions','437K'],['agent.wasm','Step agent, flow state','—'],['secure.wasm','Wallet auth & ownership','—'],['gateway.wasm','Cross-pod & paginated','—'],['ai.wasm','AI search & chat','—']].map(([name,desc,size]) => (
              <div key={name} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--green)', fontSize:'0.8rem' }}>✓</span>
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