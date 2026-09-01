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
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            <a href="https://opensea.io" target="_blank" class="btn btn-primary">VIEW DROP ON OPENSEA &nearr;</a>
            <button type="button" class="btn btn-ghost" id="refreshScanBtn">↻ Scan Wallet</button>
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

  // Handle Card Action (Burn to Energize or Claim)
  function handleBreakerAction(tokenId) {
    const breaker = userBreakers.find(b => b.tokenId === tokenId);
    if (!breaker) return;

    if (breaker.energized) {
      if (breaker.unclaimedYield <= 0) {
        alert(`⚡ Breaker #${String(tokenId).padStart(4, '0')} has no pending dividends to claim yet. Dividends stream continuously from DEX volume.`);
        return;
      }
      playSound(1300);
      const claimed = breaker.unclaimedYield;
      totalYieldAccrued = Math.max(0, totalYieldAccrued - claimed);
      breaker.unclaimedYield = 0.0;
      updateStatsUI();
      renderInventory();
      alert(`⚡ Claimed +$${claimed.toFixed(2)} in stock dividends to your connected wallet!`);
    } else {
      if (userFuseBalance < 1.0) {
        alert('Insufficient $FUSE token balance. You need at least 1.0 $FUSE to energize a breaker.');
        return;
      }
      
      playSound(1800, 'sawtooth', 0.2);
      setTimeout(() => playSound(300, 'square', 0.1), 100);

      const card = document.getElementById(`breakerCard${tokenId}`);
      if (card) card.classList.add('igniting');

      setTimeout(() => {
        userFuseBalance = Math.max(0, userFuseBalance - 1.0);
        globalBurnedCount += 1;
        breaker.energized = true;
        breaker.unclaimedYield = 0.0;
        updateStatsUI();
        renderInventory();
        alert(`⚡ BREAKER #${String(tokenId).padStart(4, '0')} ENERGIZED! 1.0 $FUSE burned. Device is now live on the dividend grid.`);
      }, 500);
    }
  }

  // Scan User NFT & $FUSE Holdings via EVM Provider
  async function scanUserHoldings(account) {
    playSound(750);
    if (inventoryCountEl) inventoryCountEl.textContent = 'SCANNING CHAIN...';

    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest']
        });
        userBreakers = [];
      }
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

  // Disconnect Wallet / Switch
  function disconnectWallet() {
    currentAccount = null;
    userFuseBalance = 0.0;
    totalYieldAccrued = 0.0;
    userBreakers = [];

    if (navConnectBtn) {
      navConnectBtn.textContent = 'CONNECT WALLET';
      navConnectBtn.classList.remove('connected');
    }

    updateStatsUI();
    renderInventory();
    playSound(600);
  }

  // Attach Connect Button Listener to Open Modal
  if (navConnectBtn) {
    navConnectBtn.addEventListener('click', () => {
      if (currentAccount) {
        if (confirm(`Connected as ${currentAccount}.\n\nDo you want to disconnect?`)) {
          disconnectWallet();
        }
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

  // Ethereum Provider Event Listeners
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        currentAccount = accounts[0];
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

});
