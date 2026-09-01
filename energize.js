/**
 * CIRCUIT BREAKERS - Real Web3 Energize & Yield Substation DApp Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // Audio Engine (Web Audio API)
  let audioEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playSound(freq = 800, type = 'square', duration = 0.04) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  }

  // Audio Toggle
  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      const icon = document.getElementById('audioIcon');
      if (icon) icon.textContent = audioEnabled ? '🔊' : '🔇';
      audioToggle.style.opacity = audioEnabled ? '1' : '0.5';
      playSound(1000);
    });
  }

  // Mobile Hamburger Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      if (hamburgerIcon) {
        hamburgerIcon.textContent = isOpen ? '✕' : '☰';
      }
      playSound(isOpen ? 950 : 650);
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (hamburgerIcon) hamburgerIcon.textContent = '☰';
      });
    });
  }

  // ---------------------------------------------------------------------------
  // WEB3 & DAPP REAL STATE
  // ---------------------------------------------------------------------------
  let currentAccount = null;
  let userFuseBalance = 0.0;
  let totalYieldAccrued = 0.0;
  let globalBurnedCount = 0;
  let userBreakers = []; // Real detected user NFTs

  // DOM Elements
  const navConnectBtn = document.getElementById('navConnectBtn');
  const deskWalletEl = document.getElementById('deskWallet');
  const fuseBalanceEl = document.getElementById('fuseBalance');
  const totalAccruedYieldEl = document.getElementById('totalAccruedYield');
  const claimAllYieldBtn = document.getElementById('claimAllYieldBtn');
  const inventoryCountEl = document.getElementById('inventoryCount');
  const breakerDeskGrid = document.getElementById('breakerDeskGrid');
  const globalBurnedEl = document.getElementById('globalBurned');
  const globalRateEl = document.getElementById('globalRate');

  // Format EVM Address for UI (e.g. 0x1234...5678)
  function formatAddress(addr) {
    if (!addr) return 'NOT CONNECTED';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }

  // Update UI Stats Bar
  function updateStatsUI() {
    if (deskWalletEl) {
      deskWalletEl.textContent = currentAccount ? formatAddress(currentAccount) : 'NOT CONNECTED';
    }
    if (fuseBalanceEl) {
      fuseBalanceEl.textContent = `${userFuseBalance.toFixed(2)} $FUSE`;
    }
    if (totalAccruedYieldEl) {
      totalAccruedYieldEl.textContent = `$${totalYieldAccrued.toFixed(2)} USD`;
    }
    if (claimAllYieldBtn) {
      claimAllYieldBtn.textContent = `Claim All Yield ($${totalYieldAccrued.toFixed(2)})`;
      claimAllYieldBtn.disabled = totalYieldAccrued <= 0;
      claimAllYieldBtn.style.opacity = totalYieldAccrued > 0 ? '1' : '0.5';
    }
    if (globalBurnedEl) {
      globalBurnedEl.textContent = `${globalBurnedCount.toLocaleString()} / 3,333`;
    }
    if (globalRateEl) {
      const rate = ((globalBurnedCount / 3333) * 100).toFixed(1);
      globalRateEl.textContent = `${rate}% OF FLOAT`;
    }
  }

  // ---------------------------------------------------------------------------
  // WALLET SELECTION MODAL LOGIC
  // ---------------------------------------------------------------------------
  const walletModalOverlay = document.getElementById('walletModalOverlay');
  const closeWalletModalBtn = document.getElementById('closeWalletModal');
  const moreWalletsToggle = document.getElementById('moreWalletsToggle');
  const moreWalletsList = document.getElementById('moreWalletsList');
  const moreWalletsArrow = document.getElementById('moreWalletsArrow');

  function openWalletModal() {
    if (!walletModalOverlay) return;
    initAudio();
    playSound(900);
    
    // Check installed providers
    const badgeOkx = document.getElementById('badgeOkx');
    const badgeMm = document.getElementById('badgeMm');
    if (badgeOkx) {
      badgeOkx.style.display = (window.okxwallet) ? 'inline-block' : 'none';
    }
    if (badgeMm) {
      badgeMm.style.display = (window.ethereum && window.ethereum.isMetaMask) ? 'inline-block' : 'none';
    }

    walletModalOverlay.classList.add('open');
  }

  function closeWalletModal() {
    if (!walletModalOverlay) return;
    walletModalOverlay.classList.remove('open');
    playSound(600);
  }

  if (closeWalletModalBtn) {
    closeWalletModalBtn.addEventListener('click', closeWalletModal);
  }

  if (walletModalOverlay) {
    walletModalOverlay.addEventListener('click', (e) => {
      if (e.target === walletModalOverlay) closeWalletModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && walletModalOverlay && walletModalOverlay.classList.contains('open')) {
      closeWalletModal();
    }
  });

  if (moreWalletsToggle && moreWalletsList) {
    moreWalletsToggle.addEventListener('click', () => {
      const isHidden = moreWalletsList.style.display === 'none';
      moreWalletsList.style.display = isHidden ? 'flex' : 'none';
      if (moreWalletsArrow) moreWalletsArrow.innerHTML = isHidden ? '&uarr;' : '&darr;';
      playSound(700);
    });
  }

  // Handle wallet option click
  if (walletModalOverlay) {
    walletModalOverlay.querySelectorAll('.wallet-opt-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const walletType = e.currentTarget.getAttribute('data-wallet');
        closeWalletModal();
        await connectSpecificWallet(walletType);
      });
    });
  }

  // Render NFT Inventory Grid
  function renderInventory() {
    if (!breakerDeskGrid) return;

    // 1. If Disconnected: Prompt to Connect Wallet
    if (!currentAccount) {
      if (inventoryCountEl) inventoryCountEl.textContent = '0 DEVICES DETECTED';
      breakerDeskGrid.innerHTML = `
        <div class="empty-inventory-state" id="emptyStateNotConnected">
          <img src="assets/wallet_card_icon_themed.png" alt="Wallet Icon" class="empty-wallet-icon-img">
          <h3 class="empty-title">WALLET NOT CONNECTED</h3>
          <p class="empty-desc">Connect your Web3 EVM wallet to scan Robinhood Chain for your minted Circuit Breakers and stream real-world stock yields.</p>
          <button type="button" class="btn btn-primary" id="promptConnectBtn">CONNECT WALLET</button>
        </div>
      `;
      const promptBtn = document.getElementById('promptConnectBtn');
      if (promptBtn) promptBtn.addEventListener('click', openWalletModal);
      return;
    }

    // 2. If Connected & 0 NFTs Detected (Pre-mint / Not yet minted)
    if (userBreakers.length === 0) {
      if (inventoryCountEl) inventoryCountEl.textContent = '0 DEVICES DETECTED';
      breakerDeskGrid.innerHTML = `
        <div class="empty-inventory-state" id="emptyStateNoNFTs">
          <img src="assets/wallet_card_icon_themed.png" alt="Wallet Icon" class="empty-wallet-icon-img">
          <h3 class="empty-title">0 CIRCUIT BREAKERS DETECTED</h3>
          <p class="empty-desc">No Circuit Breakers found in connected wallet (<span class="user-addr-mono">${currentAccount}</span>). Mint your device on OpenSea to energize and start streaming tokenized stock dividends.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 14px;">
            <button type="button" class="btn btn-ghost" id="refreshScanBtn" style="padding: 10px 22px; font-size: 13px;">↻ SCAN WALLET</button>
          </div>
        </div>
      `;
      const refreshBtn = document.getElementById('refreshScanBtn');
      if (refreshBtn) refreshBtn.addEventListener('click', () => scanUserHoldings(currentAccount));
      return;
    }

    // 3. Render Detected NFT Cards
    if (inventoryCountEl) inventoryCountEl.textContent = `${userBreakers.length} ${userBreakers.length === 1 ? 'DEVICE' : 'DEVICES'} DETECTED`;
    
    let html = '';
    userBreakers.forEach(breaker => {
      const isEnergized = breaker.energized;
      html += `
        <div class="breaker-desk-card ${isEnergized ? 'energized' : ''}" id="breakerCard${breaker.tokenId}">
          <div class="bd-head">
            <span class="bd-id">BREAKER #${String(breaker.tokenId).padStart(4, '0')}</span>
            <span class="bd-badge ${isEnergized ? 'badge-energized' : 'badge-tripped'}" id="badge${breaker.tokenId}">
              ${isEnergized ? 'ENERGIZED 🟢' : 'TRIPPED / UNLIT 🔴'}
            </span>
          </div>
          <div class="bd-art-wrap ${isEnergized ? 'bd-art-energized' : ''}" id="artWrap${breaker.tokenId}">
            <img src="${breaker.image || 'assets/type1.jpg'}" alt="Breaker ${breaker.tokenId}" class="bd-img" id="img${breaker.tokenId}">
            <div class="switch-status ${isEnergized ? 'switch-active' : ''}" id="switch${breaker.tokenId}">
              ${isEnergized ? '[ CIRCUIT CLOSED // 125V ACTIVE ]' : '[ CIRCUIT OPEN // 0V ]'}
            </div>
          </div>
          <div class="bd-specs">
            <div class="spec-row">
              <span>Model Tier:</span>
              <strong>${breaker.tierName || 'Type-1 Single-Phase'}</strong>
            </div>
            <div class="spec-row">
              <span>Yield Multiplier:</span>
              <strong class="val-cyan">${breaker.multiplier || '1.0x'} Base Weight</strong>
            </div>
            <div class="spec-row">
              <span>Current Status:</span>
              <span id="yieldStatus${breaker.tokenId}" class="${isEnergized ? 'val-amber' : 'text-dim'}">
                ${isEnergized ? `<strong>+$${breaker.unclaimedYield.toFixed(2)} ($NVDA • $HOOD • T-Bills)</strong>` : 'No Yield (Unlit)'}
              </span>
            </div>
          </div>
          <div class="bd-action">
            <button type="button" class="btn ${isEnergized ? 'btn-accent' : 'btn-primary'} btn-full energize-card-btn" data-token-id="${breaker.tokenId}">
              ${isEnergized ? `CLAIM $${breaker.unclaimedYield.toFixed(2)} DIVIDENDS ✓` : '⚡ BURN 1.0 $FUSE & ENERGIZE'}
            </button>
          </div>
        </div>
      `;
    });

    breakerDeskGrid.innerHTML = html;

    // Attach card event listeners
    breakerDeskGrid.querySelectorAll('.energize-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tokenId = parseInt(e.currentTarget.getAttribute('data-token-id'), 10);
        handleBreakerAction(tokenId);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // LIVE DEPLOYED CONTRACT CONFIGURATION
  // ---------------------------------------------------------------------------
  const CONTRACTS = {
    NFT: '0x363f0fa594bb0d9293ec1d1ba300854f2e185e8d',
    FUSE: '0x4f4cDD87D266781A71386367F2c01343f97D23E8',
    VAULT: '0xAaeb90114faBBB6dF25ca1840E8B3e57640e26cE',
    CHAIN_ID: 4663
  };

  // Helper to get Archetype information by Token ID
  function getBreakerTier(tokenId) {
    // 3 Canonical Rarity Tiers (3,333 collection):
    // Type-1: ~60% (Single-Phase), Type-2: ~25% (Dual Relay), Type-3: ~15% (HV Transformer)
    const mod = tokenId % 20;
    if (mod === 0 || mod === 7 || mod === 13) {
      return {
        tierName: 'Type-3 HV Transformer',
        multiplier: '2.5x',
        image: 'assets/type3.jpg'
      };
    } else if (mod === 2 || mod === 5 || mod === 9 || mod === 14 || mod === 18) {
      return {
        tierName: 'Type-2 Dual Relay',
        multiplier: '1.5x',
        image: 'assets/type2.jpg'
      };
    } else {
      return {
        tierName: 'Type-1 Single-Phase',
        multiplier: '1.0x',
        image: 'assets/type1.jpg'
      };
    }
  }

  // ABI Helpers for standard EVM RPC encoding/decoding
  function pad32(val) {
    let clean = String(val);
    if (clean.startsWith('0x')) clean = clean.slice(2);
    return clean.padStart(64, '0');
  }

  async function ethCall(to, data) {
    if (!window.ethereum) return null;
    try {
      return await window.ethereum.request({
        method: 'eth_call',
        params: [{ to, data }, 'latest']
      });
    } catch (err) {
      console.warn(`eth_call error to ${to}:`, err);
      return null;
    }
  }

  // Handle Card Action (Burn to Energize or Claim Yield)
  async function handleBreakerAction(tokenId) {
    const breaker = userBreakers.find(b => b.tokenId === tokenId);
    if (!breaker || !currentAccount || !window.ethereum) return;

    if (breaker.energized) {
      // Claim Dividends from Vault Contract
      try {
        playSound(1300);
        // claimYield(uint256 tokenId): selector 0x40bd2e23
        const claimData = '0x40bd2e23' + pad32(tokenId.toString(16));
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: currentAccount,
            to: CONTRACTS.VAULT,
            data: claimData
          }]
        });
        alert(`⚡ Claim submitted! TX Hash: ${txHash}\nDividends will be credited to your wallet.`);
        await scanUserHoldings(currentAccount);
      } catch (err) {
        console.error('Claim failed:', err);
        alert(err.message || 'Dividend claim transaction was cancelled or rejected.');
      }
    } else {
      // Check $FUSE Balance
      if (userFuseBalance < 1.0) {
        alert('Insufficient $FUSE token balance. You need at least 1.0 $FUSE in your wallet to energize a breaker.');
        return;
      }

      try {
        playSound(1800, 'sawtooth', 0.2);

        // 1. Check Allowance for Vault on $FUSE Token
        // allowance(owner, spender): selector 0xdd62ed3e
        const allowData = '0xdd62ed3e' + pad32(currentAccount) + pad32(CONTRACTS.VAULT);
        const allowRes = await ethCall(CONTRACTS.FUSE, allowData);
        const currentAllowance = (allowRes && allowRes !== '0x') ? BigInt(allowRes) : 0n;

        const requiredCost = 1000000000000000000n; // 1.0 ether (1e18)

        if (currentAllowance < requiredCost) {
          // Trigger approve(spender, amount): selector 0x095ea7b3
          const approveAmount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
          const approveData = '0x095ea7b3' + pad32(CONTRACTS.VAULT) + approveAmount;
          
          alert('⚡ Step 1/2: Please approve $FUSE spending for the Yield Vault in your wallet.');
          const approveTx = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: currentAccount,
              to: CONTRACTS.FUSE,
              data: approveData
            }]
          });
          console.log('Approval TX:', approveTx);
        }

        // 2. Call burnAndEnergize(tokenId): selector 0xdb7a0478
        alert(`⚡ Step 2/2: Confirm burning 1.0 $FUSE to Energize Breaker #${String(tokenId).padStart(4, '0')}...`);
        const energizeData = '0xdb7a0478' + pad32(tokenId.toString(16));
        const energizeTx = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: currentAccount,
            to: CONTRACTS.VAULT,
            data: energizeData
          }]
        });

        playSound(300, 'square', 0.1);
        alert(`⚡ BREAKER #${String(tokenId).padStart(4, '0')} ENERGIZED!\nTX Hash: ${energizeTx}\nDevice is now live on the dividend grid.`);
        await scanUserHoldings(currentAccount);
      } catch (err) {
        console.error('Energize transaction failed:', err);
        alert(err.message || 'Energize transaction was cancelled or rejected.');
      }
    }
  }

  // Scan User NFT & $FUSE Holdings via EVM Provider
  async function scanUserHoldings(account) {
    playSound(750);
    if (inventoryCountEl) inventoryCountEl.textContent = 'SCANNING CHAIN...';

    if (!window.ethereum || !account) {
      userBreakers = [];
      renderInventory();
      updateStatsUI();
      return;
    }

    try {
      // 1. Query $FUSE Balance (ERC-20: balanceOf)
      const fuseData = '0x70a08231' + pad32(account);
      const fuseRes = await ethCall(CONTRACTS.FUSE, fuseData);
      if (fuseRes && fuseRes !== '0x') {
        const rawFuse = BigInt(fuseRes);
        userFuseBalance = Number(rawFuse) / 1e18;
      } else {
        userFuseBalance = 0.0;
      }

      // 2. Query Global Vault Energized Count (totalEnergizedCount)
      const totalEnergizedRes = await ethCall(CONTRACTS.VAULT, '0x9232dc63');
      if (totalEnergizedRes && totalEnergizedRes !== '0x') {
        globalBurnedCount = Number(BigInt(totalEnergizedRes));
      }

      // 3. Query NFT Balance (ERC-721: balanceOf)
      const nftBalData = '0x70a08231' + pad32(account);
      const nftBalRes = await ethCall(CONTRACTS.NFT, nftBalData);
      const nftCount = (nftBalRes && nftBalRes !== '0x') ? Number(BigInt(nftBalRes)) : 0;

      const detectedBreakers = [];

      if (nftCount > 0) {
        // Query Transfer event logs where recipient is current account
        try {
          const paddedAccount = '0x' + pad32(account);
          const logs = await window.ethereum.request({
            method: 'eth_getLogs',
            params: [{
              address: CONTRACTS.NFT,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                null,
                paddedAccount
              ],
              fromBlock: '0x0',
              toBlock: 'latest'
            }]
          });

          const candidateTokenIds = new Set();
          if (logs && logs.length > 0) {
            logs.forEach(log => {
              if (log.topics && log.topics[3]) {
                candidateTokenIds.add(Number(BigInt(log.topics[3])));
              } else if (log.data && log.data !== '0x') {
                candidateTokenIds.add(Number(BigInt(log.data)));
              }
            });
          }

          // Verify ownership & get energized status for each candidate token
          for (const tokenId of candidateTokenIds) {
            const ownerData = '0x6352211e' + pad32(tokenId.toString(16));
            const ownerRes = await ethCall(CONTRACTS.NFT, ownerData);
            if (ownerRes && ownerRes.toLowerCase().includes(account.slice(2).toLowerCase())) {
              // Query isEnergized(tokenId) on Vault
              const energizedData = '0x7c1f1891' + pad32(tokenId.toString(16));
              const energizedRes = await ethCall(CONTRACTS.VAULT, energizedData);
              const isEnergized = energizedRes ? (BigInt(energizedRes) > 0n) : false;

              const tierInfo = getBreakerTier(tokenId);

              detectedBreakers.push({
                tokenId: tokenId,
                energized: isEnergized,
                tierName: tierInfo.tierName,
                multiplier: tierInfo.multiplier,
                image: tierInfo.image,
                unclaimedYield: 0.0
              });
            }
          }
        } catch (logErr) {
          console.warn('Transfer log scan warning:', logErr);
        }
      }

      userBreakers = detectedBreakers;
    } catch (err) {
      console.warn('Holdings scan completed with default state:', err);
    }

    renderInventory();
    updateStatsUI();
  }

  // Connect Specific Web3 Provider
  async function connectSpecificWallet(walletType) {
    initAudio();

    let provider = window.ethereum;
    if (walletType === 'okx' && window.okxwallet) {
      provider = window.okxwallet;
    } else if (walletType === 'phantom' && window.phantom && window.phantom.ethereum) {
      provider = window.phantom.ethereum;
    }

    if (!provider) {
      if (walletType === 'walletconnect') {
        alert('WalletConnect bridge initializing... Please scan QR code with your mobile wallet app.');
        return;
      }
      alert(`No active extension detected for ${walletType.toUpperCase()}. Please make sure your wallet extension is installed and unlocked.`);
      return;
    }

    try {
      playSound(900);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        currentAccount = accounts[0];
        localStorage.removeItem('cb_disconnected');
        localStorage.setItem('cb_connected_wallet', currentAccount);
        localStorage.setItem('cb_wallet_type', walletType || 'injected');
        playSound(1200);

        if (navConnectBtn) {
          navConnectBtn.textContent = formatAddress(currentAccount);
          navConnectBtn.classList.add('connected');
        }

        await scanUserHoldings(currentAccount);
      }
    } catch (err) {
      console.error('Wallet connection rejected:', err);
    }
  }

  // Auto-Detect / Restore Wallet on Load (RESPECTS cb_disconnected)
  async function autoDetectWallet() {
    if (localStorage.getItem('cb_disconnected') === 'true') {
      return;
    }

    const savedAccount = localStorage.getItem('cb_connected_wallet');
    const savedWalletType = localStorage.getItem('cb_wallet_type') || 'injected';

    let provider = window.ethereum;
    if (savedWalletType === 'okx' && window.okxwallet) {
      provider = window.okxwallet;
    } else if (savedWalletType === 'phantom' && window.phantom && window.phantom.ethereum) {
      provider = window.phantom.ethereum;
    }

    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          currentAccount = accounts[0];
          localStorage.setItem('cb_connected_wallet', currentAccount);
          if (navConnectBtn) {
            navConnectBtn.textContent = formatAddress(currentAccount);
            navConnectBtn.classList.add('connected');
          }
          await scanUserHoldings(currentAccount);
          return;
        }
      } catch (err) {
        console.warn('Auto silent account check:', err);
      }
    }

    if (savedAccount) {
      currentAccount = savedAccount;
      if (navConnectBtn) {
        navConnectBtn.textContent = formatAddress(currentAccount);
        navConnectBtn.classList.add('connected');
      }
      await scanUserHoldings(currentAccount);
    }
  }

  // Account / Disconnect Modal Elements
  const accountModalOverlay = document.getElementById('accountModalOverlay');
  const closeAccountModalBtn = document.getElementById('closeAccountModal');
  const disconnectWalletBtn = document.getElementById('disconnectWalletBtn');
  const modalAccountAddress = document.getElementById('modalAccountAddress');
  const copyAddressBtn = document.getElementById('copyAddressBtn');

  function openAccountModal() {
    if (!accountModalOverlay || !currentAccount) return;
    initAudio();
    playSound(800);
    if (modalAccountAddress) {
      modalAccountAddress.textContent = currentAccount;
    }
    accountModalOverlay.classList.add('open');
  }

  function closeAccountModal() {
    if (!accountModalOverlay) return;
    accountModalOverlay.classList.remove('open');
    playSound(600);
  }

  if (closeAccountModalBtn) {
    closeAccountModalBtn.addEventListener('click', closeAccountModal);
  }

  if (accountModalOverlay) {
    accountModalOverlay.addEventListener('click', (e) => {
      if (e.target === accountModalOverlay) closeAccountModal();
    });
  }

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      if (!currentAccount) return;
      navigator.clipboard.writeText(currentAccount).then(() => {
        copyAddressBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyAddressBtn.textContent = '📋 Copy'; }, 2000);
      });
      playSound(1100);
    });
  }

  // Disconnect Wallet / Switch
  function disconnectWallet() {
    currentAccount = null;
    localStorage.removeItem('cb_connected_wallet');
    localStorage.removeItem('cb_wallet_type');
    localStorage.setItem('cb_disconnected', 'true');
    userFuseBalance = 0.0;
    totalYieldAccrued = 0.0;
    userBreakers = [];

    if (navConnectBtn) {
      navConnectBtn.textContent = 'CONNECT WALLET';
      navConnectBtn.classList.remove('connected');
    }

    closeAccountModal();
    updateStatsUI();
    renderInventory();
    playSound(600);
  }

  if (disconnectWalletBtn) {
    disconnectWalletBtn.addEventListener('click', disconnectWallet);
  }

  // Attach Connect Button Listener to Open Modal
  if (navConnectBtn) {
    navConnectBtn.addEventListener('click', () => {
      if (currentAccount) {
        openAccountModal();
      } else {
        openWalletModal();
      }
    });
  }

  // Claim All Desk Yield
  if (claimAllYieldBtn) {
    claimAllYieldBtn.addEventListener('click', () => {
      if (totalYieldAccrued <= 0) {
        alert('No pending dividends to claim across substations.');
        return;
      }
      playSound(1500);
      alert(`⚡ All Yield Claimed! Successfully streamed +$${totalYieldAccrued.toFixed(2)} USD in tokenized stock dividends to ${formatAddress(currentAccount)}.`);
      totalYieldAccrued = 0.0;
      userBreakers.forEach(b => { if (b.energized) b.unclaimedYield = 0.0; });
      updateStatsUI();
      renderInventory();
    });
  }

  // Cross-Tab & Cross-Page State Sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'cb_connected_wallet') {
      if (e.newValue) {
        currentAccount = e.newValue;
        if (navConnectBtn) {
          navConnectBtn.textContent = formatAddress(currentAccount);
          navConnectBtn.classList.add('connected');
        }
        scanUserHoldings(currentAccount);
      } else {
        disconnectWallet();
      }
    }
  });

  // Ethereum Provider Event Listeners
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        currentAccount = accounts[0];
        localStorage.removeItem('cb_disconnected');
        localStorage.setItem('cb_connected_wallet', currentAccount);
        if (navConnectBtn) {
          navConnectBtn.textContent = formatAddress(currentAccount);
          navConnectBtn.classList.add('connected');
        }
        scanUserHoldings(currentAccount);
      }
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }

  // Initial Render (Real Zero-State)
  updateStatsUI();
  renderInventory();
  autoDetectWallet();

});
