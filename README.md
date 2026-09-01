# ⚡ CIRCUIT BREAKERS // ROBINHOOD CHAIN

> **Halt the Market. Claim the Spread.**  
> 3,333 mechanical 16-bit electrical circuit breaker devices on Robinhood Chain streaming real-world tokenized stock yields ($NVDA, $HOOD, $TSLA, $GME, US T-Bills).

---

## ⚡ Overview

**Circuit Breakers** is a high-voltage cyber-finance NFT collection and yield protocol deployed on **Robinhood Chain (Arbitrum L2)**. Built around authentic 1930s–1980s electrical hardware machinery (Bakelite knife switches, dual relays, oil circuit breakers, and CRT consoles), each unit acts as an on-chain mechanical terminal capable of streaming real-world asset (RWA) dividends directly from DEX trading volume.

* **Total Supply:** 3,333 Unique Hardware Devices
* **Token Standard:** ERC-721 + ERC-20 (`$FUSE`)
* **Network:** Robinhood Chain (Arbitrum L2)
* **Team Allocation:** 0% (100% Fair Community Distribution)
* **Protocol Tax:** 3.00% Permanent DEX Swap Hook

---

## 🖥️ Multi-Page Frontend Architecture

The web application is structured across three dedicated, purpose-built interfaces:

| Page | Path | Purpose |
| :--- | :--- | :--- |
| 🏠 **Launch Terminal** | [`index.html`](index.html) | High-converting landing page with 16-bit device showcase, social tasks verification, and whitelist ticket receipt generator. |
| ⚡ **Energize & Yield DApp** | [`energize.html`](energize.html) | Full-screen Web3 DeFi dashboard where NFT holders connect wallets, view breaker inventories, burn `$FUSE` to energize, and claim live stock dividends. |
| 📖 **Protocol Specs** | [`docs.html`](docs.html) | Technical documentation & whitepaper portal featuring sticky sidebar navigation, fee breakdown tables, rarity matrices, and FAQs. |

---

## ⚙️ How It Works (The 2 States)

```
                       ┌──────────────────────────────────────────────┐
                       │   1.0 $FUSE Token Bought on Uniswap / DEX    │
                       └──────────────────────┬───────────────────────┘
                                              │
                                              ▼
                       ┌──────────────────────────────────────────────┐
                       │          STATE 1: TRIPPED (Liquid)           │
                       │ • Unlit device in wallet                     │
                       │ • Knife switch open [0V], trades freely      │
                       │ • Earns NO yield                             │
                       └──────────────────────┬───────────────────────┘
                                              │
                                  [ ⚡ BURN & ENERGIZE ]
                                (1.0 $FUSE burned forever)
                                              │
                                              ▼
                       ┌──────────────────────────────────────────────┐
                       │         STATE 2: ENERGIZED (Permanent)       │
                       │ • Knife switch snaps shut [125V ACTIVE]      │
                       │ • Phosphor filaments ignite neon green       │
                       │ • Permanently leaves liquid float            │
                       │ • Streams 24/7 real-world stock dividends    │
                       └──────────────────────────────────────────────┘
```

---

## 📊 The 3.0% Fee Engine

Every swap executed across `$FUSE` liquidity pairs on Robinhood Chain pays an immutable **3.00% protocol fee**:

| Stream Destination | Share of 3% Tax | Total Volume Cut | Mechanism |
| :--- | :--- | :--- | :--- |
| ⚡ **Energized Breakers (RWA Yield)** | **66.6%** | **2.00%** | Continuously streamed to energized devices weighted by model tier. |
| 🔒 **Permanently Locked Liquidity** | **20.0%** | **0.60%** | Auto-compounded into an immutable, ownerless LP locker. |
| 🔥 **$FUSE Buyback & Burn** | **13.4%** | **0.40%** | Market-bought from the pool and permanently incinerated. |

---

## 🏛️ RWA Yield Substations

Dividends stream automatically into two core yield desks:

1. **Tokenized Equities & Stock Basket:**  
   High-growth tech leaders (`$NVDA`, `$AAPL`, `$TSLA`, `$MSFT`), native Robinhood assets (`$HOOD`, `$ARBK`, `$WETH`), and high-beta squeeze equities (`$GME`, `$PLTR`).
2. **US Treasury & Fixed Income Reserve:**  
   Capital-preserving yield backed by tokenized short-term US Treasury Bills and `$USDG`.

---

## 🛠️ Hardware Typology & Rarity Weights

Every Circuit Breaker belongs to an authentic historical engineering tier with unique mechanical perks:

* **Type-1: Single-Phase Bakelite (60.0% / 2,000 Supply)** — $1.0\times$ Standard Substation Yield Stream
* **Type-2: Dual-Circuit Relay (25.0% / 833 Supply)** — $1.5\times$ Dual Desk Affinity (Splits across 2 Baskets)
* **Type-3: HV Transformer Breaker (10.0% / 333 Supply)** — $2.5\times$ Surge Shield (+50% Market Halt Bonus)
* **Type-4: Tri-Phase Master Console (4.8% / 160 Supply)** — $5.0\times$ Grid Interconnect (Earns Across ALL Desks)
* **Type-5: Edison Patent Prototype (0.2% / 7 Supply)** — $10.0\times$ Master Grid Skim (Direct Overall DEX Tax Cut)

---

## 🚀 Local Development & Deployment

### Run Locally
```bash
# Clone the repository
git clone https://github.com/khalography/circuitbreakers-rh.git
cd circuitbreakers-rh

# Serve with any static web server (e.g. Python)
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

### Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select the `circuitbreakers-rh` repository.
3. Click **Deploy** (zero build configuration required).

---

## 📜 License
MIT License. Circuit Breakers is a community-owned, fair-launch protocol.
