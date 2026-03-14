// ─────────────────────────────────────────────────────
//  WeilChain SDK Wrapper
//  When contracts are deployed, replace CONTRACT_ADDRESS
//  and uncomment the real SDK calls below.
// ─────────────────────────────────────────────────────

// TODO: After deploying, set these values:
export const CONFIG = {
  CONTRACT_ADDRESS: null,          // e.g. "your-marketplace-contract-id"
  POD_ID:           null,          // e.g. "asia-south-xxxxxxxx"
  NETWORK:          "asia-south",
  SDK_ENDPOINT:     "https://marauder.weilliptic.ai",
};

// ── MOCK DATA ─────────────────────────────────────────
export const MOCK_APPLETS = [
  { id:1,  name:"TextGenius AI",   emoji:"📝", category:"nlp",     price:0.5, rating:4.8, invokes:342, desc:"Advanced NLP summarization and text processing with multi-language support.", badges:["mcp","ai"], hot:true  },
  { id:2,  name:"ImageChain",      emoji:"🎨", category:"image",   price:1.2, rating:4.6, invokes:218, desc:"On-chain image generation and transformation using diffusion models.",        badges:["mcp","hot"],hot:true  },
  { id:3,  name:"DeFi Oracle",     emoji:"📊", category:"finance", price:0.3, rating:4.7, invokes:589, desc:"Real-time price feeds and DeFi analytics from 50+ protocols.",               badges:["mcp"],      hot:false },
  { id:4,  name:"CodeAuditor",     emoji:"🔍", category:"utility", price:2.0, rating:4.9, invokes:156, desc:"Automated smart contract security analysis and vulnerability detection.",    badges:["mcp","ai"], hot:false },
  { id:5,  name:"DataStream",      emoji:"📡", category:"data",    price:0.8, rating:4.4, invokes:423, desc:"Real-time blockchain event indexing and data pipeline management.",          badges:["mcp"],      hot:false },
  { id:6,  name:"SentimentAI",     emoji:"🧠", category:"nlp",     price:0.4, rating:4.5, invokes:267, desc:"Social media sentiment analysis with blockchain data correlation.",          badges:["ai","new"], hot:false },
  { id:7,  name:"NFT Metadata",    emoji:"🖼", category:"utility", price:0.6, rating:4.3, invokes:198, desc:"Dynamic NFT metadata generation and on-chain storage.",                     badges:["mcp","new"],hot:false },
  { id:8,  name:"ChainBridge",     emoji:"🌉", category:"utility", price:1.5, rating:4.6, invokes:134, desc:"Cross-chain asset transfer and message passing between pods.",              badges:["mcp"],      hot:false },
  { id:9,  name:"MLPredictor",     emoji:"🤖", category:"data",    price:1.0, rating:4.4, invokes:312, desc:"On-chain ML inference for price prediction and anomaly detection.",         badges:["ai","mcp"], hot:true  },
  { id:10, name:"EventIndexer",    emoji:"⚡", category:"data",    price:0.2, rating:4.2, invokes:678, desc:"High-throughput blockchain event indexer with custom filters.",              badges:["mcp"],      hot:false },
  { id:11, name:"NFT Auction",     emoji:"🏆", category:"finance", price:0.7, rating:4.5, invokes:189, desc:"Decentralised NFT auction with on-chain escrow and bidding.",               badges:["mcp","hot"],hot:true  },
  { id:12, name:"PrivacyShield",   emoji:"🔒", category:"utility", price:1.8, rating:4.8, invokes:98,  desc:"Zero-knowledge proof generation for private on-chain transactions.",        badges:["mcp","ai"], hot:false },
];

export const MOCK_PROPOSALS = [
  { id:"PROP-001", title:"Reduce Base Invocation Fee",      desc:"Reduce minimum fee from 0.1 WUSD to 0.05 WUSD to increase adoption.", yes:68, no:32, total:247, open:true  },
  { id:"PROP-002", title:"Add Governance Staking Rewards",  desc:"Allocate 5% of protocol revenue to active governance participants.",    yes:82, no:18, total:189, open:true  },
  { id:"PROP-003", title:"Cross-Pod Applet Chaining",       desc:"Enable applets from different pods to chain in a single workflow.",     yes:91, no:9,  total:156, open:false },
  { id:"PROP-004", title:"AI Profile NFT Certificates",     desc:"Mint NFT certificates for top-rated applets automatically.",            yes:74, no:26, total:203, open:true  },
];

export const STAKE_POOLS = [
  { id:1, name:"AI Oracle Pool 🤖", apy:24.5, lock:"30 days", tvl:"12,400", min:100, desc:"Power AI applet inference, earn from invocation fees." },
  { id:2, name:"DeFi Vault 💰",     apy:18.2, lock:"14 days", tvl:"8,200",  min:50,  desc:"Support DeFi oracle applets, earn from price feed subs." },
  { id:3, name:"Flash Pool ⚡",     apy:31.8, lock:"7 days",  tvl:"3,100",  min:25,  desc:"High-yield short staking for flash invocations." },
];

// ── SDK FUNCTIONS ─────────────────────────────────────
// These return mock data now.
// After deploying contracts, replace with real SDK calls.

export async function getApplets() {
  // REAL: const sdk = new WeilSDK(CONFIG); return sdk.call(CONTRACT_ADDRESS, "list_applets", {});
  await delay(300);
  return MOCK_APPLETS;
}

export async function invokeApplet(appletId, params, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  // REAL: const sdk = new WeilSDK(CONFIG); return sdk.call(CONTRACT_ADDRESS, "pay_and_invoke", { applet_id: appletId, params_json: JSON.stringify(params) });
  await delay(900);
  return {
    status:      "success",
    tx_id:       "0x" + Math.random().toString(16).slice(2, 14),
    applet_id:   appletId,
    charged:     MOCK_APPLETS.find(a => a.id === appletId)?.price + " WUSD",
    output:      { result: "Processed successfully", timestamp: Date.now() },
    block:       Math.floor(Math.random() * 99999) + 10000,
  };
}

export async function registerApplet(data, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  await delay(800);
  return { status: "registered", applet_id: Math.floor(Math.random() * 900) + 100, ...data };
}

export async function withdrawEarnings(amountMicroWusd, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  await delay(700);
  return { status: "withdrawn", amount_wusd: (amountMicroWusd / 1e6).toFixed(2), wallet: walletAddress };
}

export async function voteProposal(proposalId, choice, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  await delay(500);
  return { status: "voted", proposal_id: proposalId, choice, tx_id: "0x" + Math.random().toString(16).slice(2, 10) };
}

export async function stakeTokens(poolId, amount, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  await delay(600);
  return { status: "staked", pool_id: poolId, amount_wusd: amount, apy: STAKE_POOLS.find(p => p.id === poolId)?.apy };
}

export async function semanticSearch(query, limit = 5) {
  await delay(600);
  const q = query.toLowerCase();
  return MOCK_APPLETS
    .filter(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.category.includes(q))
    .slice(0, limit)
    .map(a => ({ ...a, relevance_score: Math.floor(Math.random() * 30) + 70 }));
}

export async function getDashboard(walletAddress) {
  await delay(400);
  return {
    my_applets:  3,
    balance:     12.4,
    earnings:    48.7,
    invocations: 214,
    weekly_revenue: [4.2, 5.8, 3.1, 7.4, 9.2, 6.5, 11.3],
    audit: [
      { fn:"invoke_applet", applet:"NLP Summarizer", detail:"params:{text:...}", time:"2m ago", status:"ok"   },
      { fn:"review_applet", applet:"Hindi Translator",detail:"Score: 5",         time:"8m ago", status:"ok"   },
      { fn:"register_applet",applet:"Code Reviewer", detail:"New applet listed", time:"1h ago", status:"ok"   },
      { fn:"withdraw",       applet:"—",             detail:"5.0 WUSD",          time:"2h ago", status:"ok"   },
      { fn:"pay_and_invoke", applet:"Price Predictor",detail:"1.5 WUSD",         time:"3h ago", status:"fail" },
    ],
  };
}

// ── HELPERS ───────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

export function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
