# 👻 WeilMarket — On-Chain Applet Marketplace

IIT Mandi Hackathon · Problem Statement 2 · WeilChain

## 🚀 Deploy to Vercel (Step by Step)

### Step 1 — Install Dependencies (Windows)
Open **PowerShell** or **Command Prompt** in the project folder:
```
npm install
```

### Step 2 — Test Locally
```
npm run dev
```
Open http://localhost:3000 — you should see the Halloween marketplace!

### Step 3 — Push to GitHub
```
git init
git add .
git commit -m "WeilMarket - IIT Mandi Hackathon"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weilmarket.git
git push -u origin main
```

### Step 4 — Deploy on Vercel
1. Go to https://vercel.com
2. Click **"Sign up"** → Sign up with GitHub (free)
3. Click **"Add New Project"**
4. Import your **weilmarket** GitHub repo
5. Keep all settings as default
6. Click **Deploy**
7. Your live URL will be: `https://weilmarket-xxx.vercel.app` 🎉

### Step 5 — Connect to WeilChain (after deploying contracts)
Edit `lib/weil.js` and update:
```js
export const CONFIG = {
  CONTRACT_ADDRESS: "your-deployed-contract-id",
  POD_ID:           "your-asia-south-pod-uuid",
};
```
Then replace the mock functions with real `@weilliptic/weil-sdk` calls.

---

## 📁 Project Structure
```
weilmarket/
├── pages/
│   ├── _app.js          ← Theme, wallet, sounds, page transitions
│   ├── index.js         ← Home page
│   ├── marketplace.js   ← Browse & filter applets
│   ├── dashboard.js     ← Analytics & withdraw
│   ├── ai.js            ← AI search, compare, chat
│   ├── governance.js    ← DAO voting
│   ├── staking.js       ← Stake WUSD & earn
│   └── deploy.js        ← Deploy contracts
├── components/
│   ├── Navbar.js        ← Navigation + theme switcher
│   ├── UI.js            ← Loader, Toast, DoodleLayer, PageTransition
│   ├── AppletCard.js    ← Applet card component
│   └── AppletModal.js   ← Applet detail modal
├── lib/
│   ├── weil.js          ← WeilChain SDK wrapper + mock data
│   └── useSound.js      ← Web Audio API sounds
├── styles/
│   └── globals.css      ← 4 themes, base styles
└── next.config.js
```

## 🎨 Features
- 👻 Halloween theme with hand-drawn ghost/robot/skull/pumpkin SVG doodles
- 🎃 4 themes: Halloween, Dark, Light, Neon — each with full color change
- 🔊 Procedural Web Audio sounds (startup, page transitions, voting, staking, deploy)
- ⚡ Page loading transitions with ghost animation
- 🛒 Marketplace with search & category filters
- 📊 Dashboard with revenue charts & audit trail
- 🤖 AI tools: semantic search, compare, chat, payload generator
- 🗳 DAO governance with animated vote bars
- 💀 Staking pools with APY display
- 🚀 Deploy page with instructions

## 🔗 Links
- WeilChain Docs: https://docs.weilliptic.ai
- Pod Viewer: https://marauder.weilliptic.ai
- Sentinel: https://sentinel.weilliptic.ai
- WADK: https://github.com/weilliptic-public/wadk
