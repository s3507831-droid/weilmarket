import { useState } from 'react';
import { semanticSearch, MOCK_APPLETS } from '../lib/weil';

export default function AI({ wallet, onToast }) {
  const [searchQ, setSearchQ]   = useState('');
  const [searchRes, setSearchRes] = useState(null);
  const [cmpA, setCmpA]         = useState('');
  const [cmpB, setCmpB]         = useState('');
  const [cmpRes, setCmpRes]     = useState(null);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput]= useState('');
  const [chatApplet, setChatApplet]= useState('');
  const [payloadId, setPayloadId]= useState('');
  const [payloadIntent, setPayloadIntent]= useState('');
  const [payloadRes, setPayloadRes]= useState(null);
  const [catIntel, setCatIntel] = useState('nlp');
  const [catRes, setCatRes]     = useState(null);
  const [loading, setLoading]   = useState({});

  function setLoad(k, v) { setLoading(p => ({...p, [k]:v})); }

  async function doSearch() {
    if (!searchQ) return;
    setLoad('search', true);
    const res = await semanticSearch(searchQ);
    setSearchRes({ query: searchQ, results: res, total_found: res.length });
    setLoad('search', false);
  }

  async function doCompare() {
    const a = parseInt(cmpA), b = parseInt(cmpB);
    if (!a || !b) return;
    setLoad('cmp', true);
    await new Promise(r => setTimeout(r, 600));
    const pa = MOCK_APPLETS.find(x => x.id === a) || { name:'Applet '+a, rating:4.0, invokes:50, id:a };
    const pb = MOCK_APPLETS.find(x => x.id === b) || { name:'Applet '+b, rating:4.2, invokes:80, id:b };
    const sA = pa.rating * 40 + pa.invokes, sB = pb.rating * 40 + pb.invokes;
    const winner = sA >= sB ? pa : pb;
    setCmpRes({ applet_a:{id:a,name:pa.name,score:sA}, applet_b:{id:b,name:pb.name,score:sB}, winner:winner.name });
    setLoad('cmp', false);
  }

  async function startChat() {
    if (!chatApplet) return;
    const id = parseInt(chatApplet);
    const a = MOCK_APPLETS.find(x => x.id === id) || { name:'Applet '+id, desc:'On-chain smart applet' };
    setChatMsgs([{ role:'assistant', text:`👻 Hi! I'm the AI ghost for '${a.name}'. ${a.desc} How can I help you?` }]);
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMsgs(p => [...p, { role:'user', text:msg }]);
    await new Promise(r => setTimeout(r, 700));
    const lower = msg.toLowerCase();
    let reply;
    if (lower.includes('how')||lower.includes('use')) reply = '🕸️ Call pay_and_invoke(applet_id, params_json, amount). Format: {"text":"your input"}. Cost: 500000 micro-WUSD.';
    else if (lower.includes('example')) reply = '⚡ Example: {"text":"Summarize"} → {"summary":"...", "word_count":12}';
    else if (lower.includes('price')||lower.includes('cost')) reply = '💀 Costs 0.5 WUSD/invoke. Use pay_and_invoke() for atomic payment.';
    else reply = '👻 I can help with: usage, examples, pricing, deployment. What do you need, wandering soul?';
    setChatMsgs(p => [...p, { role:'assistant', text:reply }]);
  }

  async function doPayload() {
    if (!payloadId) return;
    setLoad('payload', true);
    await new Promise(r => setTimeout(r, 500));
    const a = MOCK_APPLETS.find(x => x.id === parseInt(payloadId)) || { name:'Applet '+payloadId };
    setPayloadRes({ applet_id:payloadId, applet_name:a.name, intent:payloadIntent, suggested_payload:{text:"<your_text>"}, tip:"Replace <> values and call invoke_applet()" });
    setLoad('payload', false);
  }

  async function doCatIntel() {
    setLoad('cat', true);
    await new Promise(r => setTimeout(r, 700));
    const applets = MOCK_APPLETS.filter(a => a.category === catIntel);
    const avg = applets.length ? (applets.reduce((s,a)=>s+a.rating,0)/applets.length).toFixed(1) : 0;
    const best = [...applets].sort((a,b)=>b.rating-a.rating)[0];
    setCatRes({ category:catIntel, total:applets.length, avg_rating:avg, best_applet:best?.name||null, insight:`'${catIntel}' has ${applets.length} applets with ${avg} avg rating` });
    setLoad('cat', false);
  }

  const panelStyle = { background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:8, padding:'1.25rem' };
  const titleStyle = { fontFamily:'var(--font-head)', fontSize:'1rem', color:'var(--accent)', marginBottom:'1rem' };

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
      <div className="section-title">🤖 AI Tools</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>

        {/* Semantic Search */}
        <div style={panelStyle}>
          <div style={titleStyle}>🔮 Semantic Search</div>
          <input className="field-input" value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="summarize text in hindi" style={{marginBottom:'0.75rem'}}/>
          <button className="btn-primary" style={{width:'100%'}} onClick={doSearch} disabled={loading.search}>
            {loading.search ? '🔮 Searching...' : '🔮 Search'}
          </button>
          {searchRes && <div className="result-box"><div className="result-label">Results</div><pre className="result-content">{JSON.stringify(searchRes, null,2)}</pre></div>}
        </div>

        {/* Compare */}
        <div style={panelStyle}>
          <div style={titleStyle}>⚖️ Compare Applets</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.75rem'}}>
            <input className="field-input" type="number" value={cmpA} onChange={e=>setCmpA(e.target.value)} placeholder="Applet A ID"/>
            <input className="field-input" type="number" value={cmpB} onChange={e=>setCmpB(e.target.value)} placeholder="Applet B ID"/>
          </div>
          <button className="btn-primary" style={{width:'100%'}} onClick={doCompare} disabled={loading.cmp}>
            {loading.cmp ? 'Comparing...' : '⚖️ Compare'}
          </button>
          {cmpRes && <div className="result-box"><div className="result-label">Result</div><pre className="result-content">{JSON.stringify(cmpRes,null,2)}</pre></div>}
        </div>

        {/* AI Chat */}
        <div style={{...panelStyle, gridColumn:'1/-1'}}>
          <div style={titleStyle}>💬 AI Chat</div>
          <div style={{display:'flex',gap:'0.75rem',marginBottom:'0.75rem'}}>
            <input className="field-input" type="number" value={chatApplet} onChange={e=>setChatApplet(e.target.value)} placeholder="Applet ID" style={{maxWidth:150}}/>
            <button className="btn-primary" onClick={startChat}>Start Chat</button>
          </div>
          <div style={{ height:220, overflowY:'auto', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:6, padding:'1rem', marginBottom:'0.75rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {chatMsgs.map((m, i) => (
              <div key={i} style={{ display:'flex', gap:'0.6rem', flexDirection: m.role==='assistant'?'row-reverse':'row', alignItems:'flex-start' }}>
                <div style={{ width:28,height:28,borderRadius:6,background: m.role==='user'?'rgba(255,106,0,0.15)':'rgba(184,76,255,0.15)', display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',flexShrink:0 }}>
                  {m.role==='user'?'🧙':'👻'}
                </div>
                <div style={{ maxWidth:'75%', fontSize:'0.72rem', lineHeight:1.55, padding:'0.6rem 0.85rem', borderRadius:6, background: m.role==='user'?'rgba(255,106,0,0.08)':'var(--bg2)', border: m.role==='user'?'1px solid rgba(255,106,0,0.15)':'1px solid var(--border)', color:'var(--text2)' }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <input className="field-input" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask about this applet..." onKeyDown={e=>e.key==='Enter'&&sendChat()}/>
            <button className="btn-primary" onClick={sendChat}>Send</button>
          </div>
        </div>

        {/* Category Intel */}
        <div style={panelStyle}>
          <div style={titleStyle}>📡 Category Intelligence</div>
          <div style={{marginBottom:'0.75rem'}}>
            <label className="field-label">Category</label>
            <select className="field-select" value={catIntel} onChange={e=>setCatIntel(e.target.value)}>
              {['nlp','image','data','finance','utility'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <button className="btn-primary" style={{width:'100%'}} onClick={doCatIntel} disabled={loading.cat}>
            {loading.cat ? 'Analysing...' : 'Analyse Category'}
          </button>
          {catRes && <div className="result-box"><div className="result-label">Intel</div><pre className="result-content">{JSON.stringify(catRes,null,2)}</pre></div>}
        </div>

        {/* Generate Payload */}
        <div style={panelStyle}>
          <div style={titleStyle}>🧪 Generate Payload</div>
          <div style={{marginBottom:'0.75rem'}}>
            <label className="field-label">Applet ID</label>
            <input className="field-input" type="number" value={payloadId} onChange={e=>setPayloadId(e.target.value)} placeholder="3"/>
          </div>
          <div style={{marginBottom:'0.75rem'}}>
            <label className="field-label">Your Intent</label>
            <input className="field-input" value={payloadIntent} onChange={e=>setPayloadIntent(e.target.value)} placeholder="summarize this article"/>
          </div>
          <button className="btn-primary" style={{width:'100%'}} onClick={doPayload} disabled={loading.payload}>
            {loading.payload ? 'Generating...' : 'Generate Payload'}
          </button>
          {payloadRes && <div className="result-box"><div className="result-label">Payload</div><pre className="result-content">{JSON.stringify(payloadRes,null,2)}</pre></div>}
        </div>
      </div>
    </div>
  );
}
