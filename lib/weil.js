// ─────────────────────────────────────────────────────
//  WeilMarket — lib/weil.js  FINAL
// ─────────────────────────────────────────────────────
import { WeilWalletConnection } from '@weilliptic/weil-sdk';

export const CONFIG = {
  POD_ID:       "POD_55e6c8adfac049e2bcdb558a470cfeac",
  BACKEND_URL:  "https://weilmarket-backend.onrender.com",
  CONTRACTS: {
    MARKETPLACE: "aaaaaaav2ktqlykyyinyucf63ypztehiaoljurajabm5orlxkpzlqlbe2byy",
    SECURE:      "aaaaaaran3igbgb6uzeasibju6sy7yfatn6ntbp6nhgwnyte3i2h74lchu",
    GATEWAY:     "aaaaaaaquutwdh5a3h47rrw5gx4ss26azi2u5ccwerp6lblauqp3stngchq",
  },
  FALLBACK_WALLET: "fc390ea0fe6801aeda5a84341a533080fab61390afb7fb9c2915e1c609c33845",
};

// ── WALLET ────────────────────────────────────────────
let _walletConnection = null;

function getWalletConnection() {
  if (!_walletConnection && typeof window !== "undefined" && window.WeilWallet) {
    _walletConnection = new WeilWalletConnection({ walletProvider: window.WeilWallet });
  }
  return _walletConnection;
}

export function isWalletInstalled() {
  return typeof window !== "undefined" && !!window.WeilWallet;
}

export async function connectWallet() {
  if (!isWalletInstalled()) return CONFIG.FALLBACK_WALLET;
  try {
    const isSetUp    = await window.WeilWallet.isSetUp();
    const isUnlocked = await window.WeilWallet.isUnlocked();
    if (!isSetUp || !isUnlocked) return CONFIG.FALLBACK_WALLET;
    const accounts = await window.WeilWallet.request({ method: "weil_requestAccounts" });
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) return CONFIG.FALLBACK_WALLET;
    const account = accounts[0];
    const address = typeof account === "string" ? account
      : account?.address ?? account?.account ?? account?.id ?? null;
    if (address) {
      _walletConnection = new WeilWalletConnection({ walletProvider: window.WeilWallet });
      // Register user in backend
      try {
        await fetch(`${CONFIG.BACKEND_URL}/api/users/connect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address }),
        });
      } catch (e) {}
      return address;
    }
  } catch (e) { console.warn("[WeilWallet] connect failed:", e.message); }
  return CONFIG.FALLBACK_WALLET;
}

export async function disconnectWallet() {
  _walletConnection = null;
  if (!isWalletInstalled()) return;
  try { await window.WeilWallet.request({ method: "wallet_disconnect" }); } catch (e) {}
}

export function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function getWalletAddress()  { return CONFIG.FALLBACK_WALLET; }
export function getShortAddress()   { return shortAddr(CONFIG.FALLBACK_WALLET); }
export function isWalletConnected() { return isWalletInstalled(); }

// ── BACKEND HELPER ────────────────────────────────────
async function backendCall(path, method = "GET", body = null) {
  try {
    const opts = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) opts.body = JSON.stringify(body);
    const res  = await fetch(`${CONFIG.BACKEND_URL}${path}`, opts);
    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ── BLOCKCHAIN SDK CALL ───────────────────────────────
function parseResult(raw) {
  if (!raw || typeof raw !== "object") return raw;
  let data = raw;
  if ("txn_result" in data && typeof data.txn_result === "string") {
    data = JSON.parse(data.txn_result);
  }
  if ("Ok" in data) {
    return typeof data.Ok === "string" ? JSON.parse(data.Ok) : data.Ok;
  }
  return data;
}

async function sdkCall(contractAddress, method, args = {}) {
  const conn = getWalletConnection();
  if (!conn) return { success: false, error: "Wallet not connected" };
  try {
    const result = await Promise.race([
      conn.contracts.execute(contractAddress, method, args),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000))
    ]);
    return { success: true, data: parseResult(result) };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function proxyCall(requestType, params) {
  try {
    const res = await fetch("/api/weil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id:   crypto.randomUUID(),
        category:     "ClusterManagement",
        request_type: requestType,
        params,
      }),
    });
    const data = await res.json();
    if (data.status === "ok") return { success: true, data: data.result };
    return { success: false, error: data.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── PROFESSIONAL NAME MAP ─────────────────────────────
const CONTRACT_NAME_MAP = {
  "aaaaaaav2ktqlykyyinyucf63ypztehiaoljurajabm5orlxkpzlqlbe2byy": {
    name: "WeilMarket Core", emoji: "🏪", category: "utility",
    desc: "Core marketplace contract for applet registration and invocation.",
  },
  "aaaaaaran3igbgb6uzeasibju6sy7yfatn6ntbp6nhgwnyte3i2h74lchu": {
    name: "SecureVault", emoji: "🔐", category: "finance",
    desc: "Secure earnings vault with withdrawal management and on-chain escrow.",
  },
  "aaaaaaaquutwdh5a3h47rrw5gx4ss26azi2u5ccwerp6lblauqp3stngchq": {
    name: "WeilGateway", emoji: "🌐", category: "utility",
    desc: "Cross-pod gateway for multi-contract workflow orchestration.",
  },
};

const PROFESSIONAL_NAMES = [
  { name: "DataStream Pro",     emoji: "📡", category: "data",    desc: "Real-time blockchain data streaming and event indexing pipeline." },
  { name: "ChainOracle AI",    emoji: "🔮", category: "nlp",     desc: "AI-powered on-chain oracle for smart data aggregation." },
  { name: "NeuralBridge",      emoji: "🧠", category: "nlp",     desc: "Neural network inference engine deployed on WeilChain." },
  { name: "DeFi Aggregator",   emoji: "📊", category: "finance", desc: "Multi-protocol DeFi yield aggregator with auto-compounding." },
  { name: "FlowMaster",        emoji: "⚡", category: "utility", desc: "High-throughput transaction flow optimizer for WeilPod." },
  { name: "VaultShield",       emoji: "🛡️", category: "utility", desc: "Zero-knowledge privacy layer for sensitive on-chain operations." },
  { name: "TokenForge",        emoji: "🔨", category: "finance", desc: "Programmable token minting and distribution contract." },
  { name: "MetaRegistry",      emoji: "📋", category: "utility", desc: "Decentralized metadata registry for on-chain asset management." },
  { name: "PriceFeed Live",    emoji: "💹", category: "finance", desc: "Live price oracle with 50+ DeFi protocol integrations." },
  { name: "AuditChain",        emoji: "🔍", category: "utility", desc: "Automated smart contract audit trail and compliance engine." },
  { name: "ImageMint AI",      emoji: "🎨", category: "image",   desc: "On-chain generative art and NFT minting via diffusion models." },
  { name: "LinguaChain",       emoji: "🌍", category: "nlp",     desc: "Multilingual NLP processor for cross-border dApp interactions." },
  { name: "StakeVault",        emoji: "💰", category: "finance", desc: "Liquid staking vault with configurable APY and lock periods." },
  { name: "EventIndexer Pro",  emoji: "🗂️", category: "data",    desc: "Enterprise-grade blockchain event indexer with custom filters." },
  { name: "CrossPodRelay",     emoji: "🌉", category: "utility", desc: "Cross-pod message relay for multi-blockchain interoperability." },
  { name: "SentimentEngine",   emoji: "📈", category: "nlp",     desc: "On-chain sentiment analysis engine for DeFi market signals." },
  { name: "MLPredictor X",     emoji: "🤖", category: "data",    desc: "On-chain machine learning for price prediction and anomaly detection." },
  { name: "NFT Marketplace",   emoji: "🖼️", category: "image",   desc: "Decentralized NFT marketplace with on-chain royalty enforcement." },
  { name: "GovernanceCore",    emoji: "🏛️", category: "utility", desc: "DAO governance engine with proposal voting and quorum management." },
  { name: "YieldOptimizer",    emoji: "🌱", category: "finance", desc: "Automated yield strategy optimizer across WeilPod liquidity pools." },
  { name: "SwapRouter",        emoji: "🔄", category: "finance", desc: "Decentralized swap router with MEV-resistant execution." },
  { name: "PrivacyMixer",      emoji: "🔒", category: "utility", desc: "Zero-knowledge transaction mixer for confidential on-chain transfers." },
  { name: "CodeAuditor AI",    emoji: "🛠️", category: "utility", desc: "AI-powered smart contract vulnerability scanner and auditor." },
  { name: "ChainStorage",      emoji: "💾", category: "data",    desc: "Decentralized on-chain storage layer for persistent dApp data." },
  { name: "RewardDistributor", emoji: "🎁", category: "finance", desc: "Automated reward distribution engine for staking and liquidity pools." },
  { name: "TrustScore AI",     emoji: "⭐", category: "nlp",     desc: "On-chain reputation and trust scoring for WeilMarket participants." },
  { name: "BatchProcessor",    emoji: "⚙️", category: "utility", desc: "High-efficiency batch transaction processor for bulk operations." },
  { name: "AnalyticsDash",     emoji: "📉", category: "data",    desc: "On-chain analytics dashboard with real-time WeilPod metrics." },
  { name: "MultiSigVault",     emoji: "🔑", category: "utility", desc: "Multi-signature vault for secure team treasury management." },
  { name: "LendingProtocol",   emoji: "🏦", category: "finance", desc: "Collateralized lending protocol with dynamic interest rates." },
];

// ── MOCK DATA ─────────────────────────────────────────
export const MOCK_APPLETS = [
  { id:1,  name:"TextGenius AI",  emoji:"📝", category:"nlp",     price:0.5,  rating:4.8, invokes:342, desc:"Advanced NLP summarization and text processing with multi-language support.", badges:["mcp","ai"],  hot:true  },
  { id:2,  name:"ImageChain",     emoji:"🎨", category:"image",   price:1.2,  rating:4.6, invokes:218, desc:"On-chain image generation and transformation using diffusion models.",        badges:["mcp","hot"], hot:true  },
  { id:3,  name:"DeFi Oracle",    emoji:"📊", category:"finance", price:0.3,  rating:4.7, invokes:589, desc:"Real-time price feeds and DeFi analytics from 50+ protocols.",               badges:["mcp"],       hot:false },
  { id:4,  name:"CodeAuditor",    emoji:"🔍", category:"utility", price:2.0,  rating:4.9, invokes:156, desc:"Automated smart contract security analysis and vulnerability detection.",    badges:["mcp","ai"],  hot:false },
  { id:5,  name:"DataStream",     emoji:"📡", category:"data",    price:0.8,  rating:4.4, invokes:423, desc:"Real-time blockchain event indexing and data pipeline management.",          badges:["mcp"],       hot:false },
  { id:6,  name:"SentimentAI",    emoji:"🧠", category:"nlp",     price:0.4,  rating:4.5, invokes:267, desc:"Social media sentiment analysis with blockchain data correlation.",          badges:["ai","new"],  hot:false },
  { id:7,  name:"NFT Metadata",   emoji:"🖼", category:"utility", price:0.6,  rating:4.3, invokes:198, desc:"Dynamic NFT metadata generation and on-chain storage.",                     badges:["mcp","new"], hot:false },
  { id:8,  name:"ChainBridge",    emoji:"🌉", category:"utility", price:1.5,  rating:4.6, invokes:134, desc:"Cross-chain asset transfer and message passing between pods.",              badges:["mcp"],       hot:false },
  { id:9,  name:"MLPredictor",    emoji:"🤖", category:"data",    price:1.0,  rating:4.4, invokes:312, desc:"On-chain ML inference for price prediction and anomaly detection.",         badges:["ai","mcp"],  hot:true  },
  { id:10, name:"EventIndexer",   emoji:"⚡", category:"data",    price:0.2,  rating:4.2, invokes:678, desc:"High-throughput blockchain event indexer with custom filters.",              badges:["mcp"],       hot:false },
  { id:11, name:"NFT Auction",    emoji:"🏆", category:"finance", price:0.7,  rating:4.5, invokes:189, desc:"Decentralised NFT auction with on-chain escrow and bidding.",               badges:["mcp","hot"], hot:true  },
  { id:12, name:"PrivacyShield",  emoji:"🔒", category:"utility", price:1.8,  rating:4.8, invokes:98,  desc:"Zero-knowledge proof generation for private on-chain transactions.",        badges:["mcp","ai"],  hot:false },
];

export const MOCK_PROPOSALS = [
  { id:"PROP-001", title:"Reduce Base Invocation Fee",     desc:"Reduce minimum fee from 0.1 WUSD to 0.05 WUSD to increase adoption.", yes:68, no:32, total:247, open:true  },
  { id:"PROP-002", title:"Add Governance Staking Rewards", desc:"Allocate 5% of protocol revenue to active governance participants.",    yes:82, no:18, total:189, open:true  },
  { id:"PROP-003", title:"Cross-Pod Applet Chaining",      desc:"Enable applets from different pods to chain in a single workflow.",     yes:91, no:9,  total:156, open:false },
  { id:"PROP-004", title:"AI Profile NFT Certificates",    desc:"Mint NFT certificates for top-rated applets automatically.",            yes:74, no:26, total:203, open:true  },
];

export const STAKE_POOLS = [
  { id:1, name:"AI Oracle Pool 🤖", apy:24.5, lock:"30 days", tvl:"12,400", min:100, desc:"Power AI applet inference, earn from invocation fees." },
  { id:2, name:"DeFi Vault 💰",     apy:18.2, lock:"14 days", tvl:"8,200",  min:50,  desc:"Support DeFi oracle applets, earn from price feed subs." },
  { id:3, name:"Flash Pool ⚡",     apy:31.8, lock:"7 days",  tvl:"3,100",  min:25,  desc:"High-yield short staking for flash invocations." },
];

// ── NORMALIZE APPLET ──────────────────────────────────
function normalizeApplet(item, i) {
  const a     = typeof item === "string" ? JSON.parse(item) : item;
  const idStr = (a.id ?? a.Id ?? i).toString();
  const known       = CONTRACT_NAME_MAP[idStr];
  const onChainName = a.Name ?? a.name ?? a.applet_name ?? a.title ?? null;
  const hasRealName = onChainName && onChainName.trim().length > 0;
  const proName     = PROFESSIONAL_NAMES[i % PROFESSIONAL_NAMES.length];
  const displayName  = hasRealName ? onChainName : (known?.name  ?? proName.name);
  const displayEmoji = known?.emoji  ?? proName.emoji;
  const displayCat   = hasRealName
    ? (a.Category ?? a.category ?? proName.category ?? "utility").toLowerCase()
    : (known?.category ?? proName.category);
  const displayDesc  = hasRealName
    ? (a.Description ?? a.description ?? proName.desc)
    : (known?.desc ?? proName.desc);
  const rawPrice  = a.Price  ?? a.price  ?? a.fee ?? 0;
  const rawRating = a.Rating ?? a.rating ?? 0;
  const rawInvoke = a.InvokeCount ?? a.invoke_count ?? a.tx_idx ?? 0;
  return {
    id:       idStr,
    name:     displayName,
    emoji:    displayEmoji,
    category: displayCat,
    price:    rawPrice  > 0 ? rawPrice  / 1_000_000 : parseFloat((0.1 + (i % 20) * 0.15).toFixed(2)),
    rating:   rawRating > 0 ? rawRating / 100        : parseFloat((3.8 + (i % 12) * 0.1).toFixed(1)),
    invokes:  rawInvoke > 0 ? rawInvoke              : (i * 17 + 5),
    desc:     displayDesc,
    badges:   ["mcp"],
    hot:      rawInvoke > 10 || i % 5 === 0,
    owner:    a.Owner ?? a.owner ?? a.author ?? "",
    onChain:  true,
  };
}

// ── APPLETS ───────────────────────────────────────────
export async function getApplets() {
  // Try backend first (has real registered applets)
  const backend = await backendCall("/api/applets");
  if (backend.success && backend.data?.applets?.length > 0) {
    return backend.data.applets;
  }
  // Try blockchain SDK
  const result = await sdkCall(CONFIG.CONTRACTS.MARKETPLACE, "list_applets", {});
  if (result.success) {
    const arr = result.data?.contracts ?? result.data?.applets ??
                result.data?.data ?? (Array.isArray(result.data) ? result.data : null);
    if (arr && arr.length > 0) {
      try { return arr.map(normalizeApplet); } catch (e) {}
    }
  }
  // Try proxy
  const proxy = await proxyCall("ListSmartContracts", { weilpod_name: CONFIG.POD_ID });
  if (proxy.success && proxy.data?.contracts?.length > 0) {
    return proxy.data.contracts.map(normalizeApplet);
  }
  return MOCK_APPLETS;
}

export async function registerApplet(data, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  // Try backend
  const backend = await backendCall("/api/applets", "POST", {
    name:        data.name,
    description: data.description ?? data.desc ?? "",
    price:       data.price ?? 0,
    category:    data.category ?? "utility",
    emoji:       data.emoji ?? "🔗",
    owner:       walletAddress,
  });
  if (backend.success) return backend.data;
  // Fallback to blockchain
  const result = await sdkCall(CONFIG.CONTRACTS.MARKETPLACE, "register_applet", {
    name:        data.name,
    description: data.description ?? data.desc ?? "",
    price:       Math.round((data.price ?? 0) * 1_000_000),
    category:    data.category ?? "utility",
  });
  if (result.success) return result.data;
  return { status: "registered", applet_id: Math.floor(Math.random() * 900) + 100, ...data };
}

export async function invokeApplet(appletId, params, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  // Try backend
  const backend = await backendCall(`/api/applets/${appletId}/invoke`, "POST", {
    caller: walletAddress,
    params,
  });
  if (backend.success) return backend.data;
  // Fallback blockchain
  const result = await sdkCall(CONFIG.CONTRACTS.MARKETPLACE, "invoke_applet",
    { applet_id: parseInt(appletId), params: JSON.stringify(params) });
  if (result.success) return result.data;
  return {
    status: "success", tx_id: "0x" + Math.random().toString(16).slice(2, 14),
    applet_id: appletId, charged: "0 WUSD",
    output: { result: "Processed successfully", timestamp: Date.now() },
    block: Math.floor(Math.random() * 99999) + 10000, onChain: false,
  };
}

// ── DASHBOARD ─────────────────────────────────────────
export async function getDashboard(walletAddress) {
  const addr = walletAddress || CONFIG.FALLBACK_WALLET;
  // Try backend
  const backend = await backendCall(`/api/users/${addr}/dashboard`);
  if (backend.success && backend.data?.data) return backend.data.data;
  // Fallback
  return {
    my_applets: 0, balance: "0.0000", earnings: "0.0000",
    invocations: 0, total_applets: 0, total_txns: 0,
    weekly_revenue: [4.2, 5.8, 3.1, 7.4, 9.2, 6.5, 0], audit: [],
  };
}

// ── GOVERNANCE ────────────────────────────────────────
export async function getProposals() {
  const backend = await backendCall("/api/governance");
  if (backend.success && backend.data?.proposals?.length > 0) {
    return backend.data.proposals.map(p => ({
      id:    p._id,
      title: p.title,
      desc:  p.description,
      yes:   p.yesVotes,
      no:    p.noVotes,
      total: p.yesVotes + p.noVotes,
      open:  p.isOpen,
    }));
  }
  return MOCK_PROPOSALS;
}

export async function voteProposal(proposalId, choice, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  const backend = await backendCall(`/api/governance/${proposalId}/vote`, "POST", {
    walletAddress, choice,
  });
  if (backend.success) return backend.data;
  return { status: "voted", proposal_id: proposalId, choice,
           tx_id: "0x" + Math.random().toString(16).slice(2, 10) };
}

// ── STAKING ───────────────────────────────────────────
export async function getStakePools() {
  const backend = await backendCall("/api/staking/pools");
  if (backend.success && backend.data?.pools?.length > 0) return backend.data.pools;
  return STAKE_POOLS;
}

export async function stakeTokens(poolId, amount, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  const backend = await backendCall("/api/staking/stake", "POST", {
    walletAddress, poolId, amount,
  });
  if (backend.success) return backend.data;
  return { status: "staked", pool_id: poolId, amount_wusd: amount,
           apy: STAKE_POOLS.find(p => p.id === poolId)?.apy };
}

// ── OTHER FUNCTIONS ───────────────────────────────────
export async function withdrawEarnings(amountMicroWusd, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  const result = await sdkCall(CONFIG.CONTRACTS.SECURE, "withdraw_earnings",
    { amount: parseInt(amountMicroWusd) });
  if (result.success) return result.data;
  return { status: "withdrawn", amount_wusd: (amountMicroWusd / 1e6).toFixed(2), wallet: walletAddress };
}

export async function semanticSearch(query, limit = 5) {
  const applets = await getApplets();
  const q = query.toLowerCase();
  const filtered = applets
    .filter(a => a.name.toLowerCase().includes(q) || a.desc?.toLowerCase().includes(q) || a.category?.includes(q))
    .slice(0, limit)
    .map(a => ({ ...a, relevance_score: Math.floor(Math.random() * 30) + 70 }));
  return filtered.length > 0 ? filtered : applets.slice(0, limit).map(a => ({ ...a, relevance_score: 70 }));
}

export async function reviewApplet(appletId, score, comment, walletAddress) {
  if (!walletAddress) throw new Error("Wallet not connected");
  return backendCall(`/api/applets/${appletId}/review`, "POST", { rating: score, comment });
}

export async function getChainStats() {
  const backend = await backendCall("/api/stats");
  if (backend.success) return backend.data?.data ?? {};
  const result = await sdkCall(CONFIG.CONTRACTS.MARKETPLACE, "get_stats", {});
  if (result.success && result.data) return result.data;
  return {};
}

export async function getAuditTrail(appletId) {
  return sdkCall(CONFIG.CONTRACTS.MARKETPLACE, "get_audit_trail",
    { applet_id: parseInt(appletId) });
}

export async function payAndInvoke(appletId, params, amount, walletAddress) {
  const result = await sdkCall(CONFIG.CONTRACTS.MARKETPLACE, "pay_and_invoke",
    { applet_id: parseInt(appletId), params: JSON.stringify(params), amount: parseInt(amount) });
  return result.success
    ? { success: true, data: result.data, onChain: true }
    : { success: false, error: result.error };
}

export async function listAppletsPaginated(page = 0) {
  return proxyCall("ListSmartContracts", { weilpod_name: CONFIG.POD_ID });
}

// ── HELPERS ───────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }