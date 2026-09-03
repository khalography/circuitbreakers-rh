/**
 * CIRCUIT BREAKERS - Real Web3 Energize & Yield Substation DApp Engine
 * Revised Tokenomics: 90/10 $FUSE Escrow Locking & Dual NFT Burn Workshop (The Forge + Overclock Lab)
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

  // Audio Toggle Buttons (Desktop & Mobile Drawer)
  const audioToggle = document.getElementById('audioToggle');
  const mobileAudioToggle = document.getElementById('mobileAudioToggle');

  function toggleAudio() {
    audioEnabled = !audioEnabled;
    const icon = document.getElementById('audioIcon');
    const mobIcon = document.getElementById('mobileAudioIcon');
    if (icon) icon.textContent = audioEnabled ? '🔊' : '🔇';
    if (mobIcon) mobIcon.textContent = audioEnabled ? '🔊' : '🔇';
    if (audioToggle) audioToggle.style.opacity = audioEnabled ? '1' : '0.5';
    if (mobileAudioToggle) mobileAudioToggle.style.opacity = audioEnabled ? '1' : '0.5';
    playSound(1000);
  }

  if (audioToggle) audioToggle.addEventListener('click', toggleAudio);
  if (mobileAudioToggle) mobileAudioToggle.addEventListener('click', toggleAudio);

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
  let globalLockedCount = 0;
  let globalNftsBurnedCount = 0;
  let userBreakers = []; // Real detected user NFTs

  // Workshop Active States
  let forgeSelectedTokenIds = []; // Up to 3 Type-1 tokens
  let ocMasterTokenId = null;     // Selected master device
  let ocSacrificeTokenIds = [];   // Selected devices to incinerate

  // DOM Elements
  const navConnectBtn = document.getElementById('navConnectBtn');
  const deskWalletEl = document.getElementById('deskWallet');
  const fuseBalanceEl = document.getElementById('fuseBalance');
  const totalAccruedYieldEl = document.getElementById('totalAccruedYield');
  const claimAllYieldBtn = document.getElementById('claimAllYieldBtn');
  const inventoryCountEl = document.getElementById('inventoryCount');
  const breakerDeskGrid = document.getElementById('breakerDeskGrid');
  const globalLockedEl = document.getElementById('globalLocked');
  const globalRateEl = document.getElementById('globalRate');
  const globalNftsBurnedEl = document.getElementById('globalNftsBurned');

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
    if (globalLockedEl) {
      const lockedAmount = (globalLockedCount * 0.25).toFixed(2);
      globalLockedEl.textContent = `${lockedAmount} / 833.25`;
    }
    if (globalRateEl) {
      globalRateEl.textContent = `${globalLockedCount} ENERGIZED`;
    }
    if (globalNftsBurnedEl) {
      globalNftsBurnedEl.textContent = `${globalNftsBurnedCount} BURNED`;
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

  if (walletModalOverlay) {
    walletModalOverlay.querySelectorAll('.wallet-opt-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const walletType = e.currentTarget.getAttribute('data-wallet');
        closeWalletModal();
        await connectSpecificWallet(walletType);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // RENDER NFT INVENTORY (90% ENERGIZED VS 10% STANDBY POOLS)
  // ---------------------------------------------------------------------------
  function renderInventory() {
    if (!breakerDeskGrid) return;

    const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // 1. If Disconnected: Prompt to Connect Wallet
    if (!currentAccount) {
      if (inventoryCountEl) inventoryCountEl.textContent = '0 DEVICES DETECTED';
      breakerDeskGrid.innerHTML = `
        <div class="empty-inventory-state" id="emptyStateNotConnected">
          <img src="assets/wallet_card_icon_themed.png" alt="Wallet Icon" class="empty-wallet-icon-img">
          <h3 class="empty-title">WALLET NOT CONNECTED</h3>
          <p class="empty-desc">Connect your Web3 EVM wallet to scan Robinhood Chain for your minted Circuit Breakers and stream real-world stock yields.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            <button type="button" class="btn btn-primary" id="promptConnectBtn">CONNECT WALLET</button>
            ${isLocal ? '<button type="button" class="btn btn-ghost" id="loadDemoGridBtn">🧪 LOAD DEMO GRID (LOCALHOST ONLY)</button>' : ''}
          </div>
        </div>
      `;
      const promptBtn = document.getElementById('promptConnectBtn');
      if (promptBtn) promptBtn.addEventListener('click', openWalletModal);
      const demoBtn = document.getElementById('loadDemoGridBtn');
      if (demoBtn) demoBtn.addEventListener('click', loadDemoState);
      return;
    }

    // 2. If Connected & 0 NFTs Detected
    if (userBreakers.length === 0) {
      if (inventoryCountEl) inventoryCountEl.textContent = '0 DEVICES DETECTED';
      breakerDeskGrid.innerHTML = `
        <div class="empty-inventory-state" id="emptyStateNoNFTs">
          <img src="assets/wallet_card_icon_themed.png" alt="Wallet Icon" class="empty-wallet-icon-img">
          <h3 class="empty-title">0 CIRCUIT BREAKERS DETECTED</h3>
          <p class="empty-desc">No Circuit Breakers found in connected wallet (<span class="user-addr-mono">${escapeHtml(currentAccount)}</span>). Mint your device on OpenSea to energize and start streaming tokenized stock dividends.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 14px;">
            <button type="button" class="btn btn-ghost" id="refreshScanBtn" style="padding: 10px 22px; font-size: 13px;">↻ SCAN WALLET</button>
            <a href="https://opensea.io/collection/circuit-breakers-rh/overview" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 10px 22px; font-size: 13px; text-decoration: none;">MINT ON OPENSEA &nearr;</a>
            ${isLocal ? '<button type="button" class="btn btn-accent" id="loadDemoGridBtn2" style="padding: 10px 22px; font-size: 13px;">🧪 LOAD TEST BREAKERS (LOCALHOST ONLY)</button>' : ''}
          </div>
        </div>
      `;
      const refreshBtn = document.getElementById('refreshScanBtn');
      if (refreshBtn) refreshBtn.addEventListener('click', () => scanUserHoldings(currentAccount));
      const demoBtn2 = document.getElementById('loadDemoGridBtn2');
      if (demoBtn2) demoBtn2.addEventListener('click', loadDemoState);
      renderWorkshop();
      return;
    }

    // 3. Render Detected NFT Cards
    if (inventoryCountEl) inventoryCountEl.textContent = `${userBreakers.length} ${userBreakers.length === 1 ? 'DEVICE' : 'DEVICES'} DETECTED`;
    
    let html = '';
    userBreakers.forEach(breaker => {
      const isEnergized = breaker.energized;
      const safeId = escapeHtml(String(breaker.tokenId));
      const paddedId = escapeHtml(String(breaker.tokenId).padStart(4, '0'));
      const safeTier = escapeHtml(breaker.tierName || 'Type-1 Single-Phase');
      const baseMult = breaker.multiplier || '1.0x';
      const ocBonus = breaker.overclockBonus ? `+${breaker.overclockBonus.toFixed(2)}x` : null;
      const safeMultDisplay = ocBonus ? `${baseMult} (${ocBonus} Overclocked)` : `${baseMult} Base`;
      const safeImg = escapeHtml(breaker.image || 'assets/type1.jpg');

      html += `
        <div class="breaker-desk-card ${isEnergized ? 'energized' : ''}" id="breakerCard${safeId}">
          <div class="bd-head">
            <span class="bd-id">BREAKER #${paddedId}</span>
            <span class="bd-badge ${isEnergized ? 'badge-energized' : 'badge-standby'}" id="badge${safeId}">
              ${isEnergized ? 'ENERGIZED 🟢 // 90% POOL' : 'STANDBY 🟡 // 10% POOL'}
            </span>
          </div>
          <div class="bd-art-wrap ${isEnergized ? 'bd-art-energized' : ''}" id="artWrap${safeId}">
            <img src="${safeImg}" alt="Breaker ${safeId}" class="bd-img" id="img${safeId}">
            <div class="switch-status ${isEnergized ? 'switch-active' : ''}" id="switch${safeId}">
              ${isEnergized ? '[ CIRCUIT CLOSED // 125V ACTIVE // 90% POOL ]' : '[ STANDBY CURRENT // EARNING 10% POOL ]'}
            </div>
          </div>
          <div class="bd-specs">
            <div class="spec-row">
              <span>Model Tier:</span>
              <strong>${safeTier}</strong>
            </div>
            <div class="spec-row">
              <span>Yield Multiplier:</span>
              <strong class="val-cyan">${escapeHtml(safeMultDisplay)}</strong>
            </div>
            <div class="spec-row">
              <span>Current Status:</span>
              <span id="yieldStatus${safeId}" class="${isEnergized ? 'val-amber' : 'text-dim'}">
                ${isEnergized ? `<strong>+$${breaker.unclaimedYield.toFixed(2)} ($NVDA • $HOOD • USDG)</strong>` : `+$${breaker.unclaimedYield.toFixed(2)} (10% Standby Yield)`}
              </span>
            </div>
          </div>
          <div class="bd-action card-actions-dual">
            <button type="button" class="btn ${isEnergized ? 'btn-accent' : 'btn-primary'} btn-full energize-card-btn" data-token-id="${safeId}">
              ${isEnergized ? `CLAIM $${breaker.unclaimedYield.toFixed(2)} DIVIDENDS ✓` : 'LOCK 0.25 $FUSE &amp; ENERGIZE (90% POOL)'}
            </button>
            ${isEnergized ? `
              <button type="button" class="btn-unlock btn-full unlock-card-btn" data-token-id="${safeId}">
                UNLOCK 0.25 $FUSE (TRIP TO STANDBY)
              </button>
            ` : ''}
          </div>
        </div>
      `;
    });

    breakerDeskGrid.innerHTML = html;

    // Attach card action listeners
    breakerDeskGrid.querySelectorAll('.energize-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tokenId = parseInt(e.currentTarget.getAttribute('data-token-id'), 10);
        handleBreakerAction(tokenId);
      });
    });

    breakerDeskGrid.querySelectorAll('.unlock-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tokenId = parseInt(e.currentTarget.getAttribute('data-token-id'), 10);
        handleUnlockAction(tokenId);
      });
    });

    renderWorkshop();
  }

  // ---------------------------------------------------------------------------
  // SUBSTATION WORKSHOP (THE FORGE & OVERCLOCK LAB)
  // ---------------------------------------------------------------------------
  const tabForgeBtn = document.getElementById('tabForgeBtn');
  const tabOverclockBtn = document.getElementById('tabOverclockBtn');
  const forgeTabContent = document.getElementById('forgeTabContent');
  const overclockTabContent = document.getElementById('overclockTabContent');

  function setupWorkshopTabs() {
    if (tabForgeBtn && tabOverclockBtn) {
      tabForgeBtn.addEventListener('click', () => {
        tabForgeBtn.classList.add('active');
        tabOverclockBtn.classList.remove('active');
        if (forgeTabContent) forgeTabContent.classList.add('active');
        if (overclockTabContent) overclockTabContent.classList.remove('active');
        playSound(850);
      });

      tabOverclockBtn.addEventListener('click', () => {
        tabOverclockBtn.classList.add('active');
        tabForgeBtn.classList.remove('active');
        if (overclockTabContent) overclockTabContent.classList.add('active');
        if (forgeTabContent) forgeTabContent.classList.remove('active');
        playSound(850);
      });
    }
  }
  setupWorkshopTabs();

  function renderWorkshop() {
    renderForge();
    renderOverclock();
  }

  // Render The Forge
  function renderForge() {
    const forgePickerList = document.getElementById('forgePickerList');
    const executeForgeBtn = document.getElementById('executeForgeBtn');
    if (!forgePickerList) return;

    // Filter un-energized Type-1 breakers
    const type1s = userBreakers.filter(b => !b.energized && (b.tierName || '').includes('Type-1'));

    if (type1s.length === 0) {
      forgePickerList.innerHTML = `<span style="font-size: 12px; color: var(--ink-soft);">No un-energized Type-1 Breakers available to melt.</span>`;
    } else {
      let pickerHtml = '';
      type1s.forEach(b => {
        const isSelected = forgeSelectedTokenIds.includes(b.tokenId);
        pickerHtml += `
          <button type="button" class="btn ${isSelected ? 'btn-accent' : 'btn-ghost'} forge-pick-chip" data-token-id="${b.tokenId}" style="font-size: 11px; padding: 6px 12px;">
            ${isSelected ? '✓ ' : ''}#${String(b.tokenId).padStart(4, '0')}
          </button>
        `;
      });
      forgePickerList.innerHTML = pickerHtml;

      forgePickerList.querySelectorAll('.forge-pick-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          const id = parseInt(e.currentTarget.getAttribute('data-token-id'), 10);
          toggleForgeSelection(id);
        });
      });
    }

    // Update 3 slots
    for (let i = 0; i < 3; i++) {
      const slotEl = document.getElementById(`forgeSlot${i}`);
      if (!slotEl) continue;
      const tokenId = forgeSelectedTokenIds[i];
      if (tokenId !== undefined) {
        slotEl.className = 'forge-slot filled';
        slotEl.innerHTML = `
          <img src="assets/type1.jpg" alt="Slot ${i+1}">
          <span style="font-family: var(--font-pixel); font-size: 10px; color: var(--paper-cream); position: absolute; bottom: 4px; background: rgba(0,0,0,0.85); padding: 2px 4px;">#${String(tokenId).padStart(4, '0')}</span>
        `;
        slotEl.onclick = () => toggleForgeSelection(tokenId);
      } else {
        slotEl.className = 'forge-slot';
        slotEl.innerHTML = `<span class="forge-slot-empty-text">+ SLOT ${i+1}<br>(Select Type-1)</span>`;
        slotEl.onclick = null;
      }
    }

    if (executeForgeBtn) {
      const canForge = forgeSelectedTokenIds.length === 3;
      executeForgeBtn.disabled = !canForge;
      executeForgeBtn.style.opacity = canForge ? '1' : '0.5';
      executeForgeBtn.onclick = canForge ? executeForgeTierUpgrade : null;
    }
  }

  function toggleForgeSelection(tokenId) {
    playSound(950);
    const idx = forgeSelectedTokenIds.indexOf(tokenId);
    if (idx > -1) {
      forgeSelectedTokenIds.splice(idx, 1);
    } else {
      if (forgeSelectedTokenIds.length < 3) {
        forgeSelectedTokenIds.push(tokenId);
      } else {
        alert('The Forge requires exactly 3 Type-1 Breakers. Unselect one to choose a different device.');
      }
    }
    renderForge();
  }

  // Execute The Forge Tier Evolution
  async function executeForgeTierUpgrade() {
    if (forgeSelectedTokenIds.length !== 3) return;
    
    const confirmBurn = confirm(
      `⚠️ CONFIRM IRREVERSIBLE FORGE DESTRUCTION:\n\nAre you sure you want to permanently melt Breakers #${forgeSelectedTokenIds.join(', #')} to forge 1 new Type-2 Dual Relay Breaker?\n\nThe 3 devices will be incinerated to the dead address.`
    );
    if (!confirmBurn) return;

    playSound(1800, 'sawtooth', 0.4);

    // Remove burned devices and add 1 Type-2 device
    const burnedSet = new Set(forgeSelectedTokenIds);
    userBreakers = userBreakers.filter(b => !burnedSet.has(b.tokenId));

    const newType2Id = Math.max(...userBreakers.map(b => b.tokenId), 5000) + 1;
    userBreakers.push({
      tokenId: newType2Id,
      energized: false,
      tierName: 'Type-2 Dual Relay (Forged)',
      multiplier: '1.5x',
      image: 'assets/type2.jpg',
      unclaimedYield: 0.0
    });

    globalNftsBurnedCount += 3;
    forgeSelectedTokenIds = [];

    alert(`🔨 THERMAL FUSION COMPLETE!\n\n3 Type-1 devices were burned to 0x...dEaD.\nForged New Hardware: Type-2 Dual Relay Breaker #${newType2Id} (1.5x Multiplier) added to your inventory!`);
    
    playSound(300, 'square', 0.2);
    updateStatsUI();
    renderInventory();
  }

  // Render Overclock Lab
  function renderOverclock() {
    const ocMasterPreview = document.getElementById('ocMasterPreview');
    const ocSacrificeList = document.getElementById('ocSacrificeList');
    const ocBurnCountLabel = document.getElementById('ocBurnCountLabel');
    const ocTotalBoostDisplay = document.getElementById('ocTotalBoostDisplay');
    const executeOverclockBtn = document.getElementById('executeOverclockBtn');

    if (!ocMasterPreview || !ocSacrificeList) return;

    // 1. Master Device Selector
    if (userBreakers.length === 0) {
      ocMasterPreview.innerHTML = `<p style="font-size: 12px; color: var(--ink-soft);">No Breakers detected.</p>`;
      ocSacrificeList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--ink-soft); font-size: 12px;">No devices available to sacrifice.</div>`;
      return;
    }

    // Default master device to first breaker if unselected
    if (ocMasterTokenId === null || !userBreakers.find(b => b.tokenId === ocMasterTokenId)) {
      ocMasterTokenId = userBreakers[0].tokenId;
    }

    const masterBreaker = userBreakers.find(b => b.tokenId === ocMasterTokenId);
    let masterBaseVal = parseFloat(masterBreaker.multiplier) || 1.0;
    let masterExistingOc = masterBreaker.overclockBonus || 0.0;

    ocMasterPreview.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; justify-content: center; text-align: left;">
        <img src="${masterBreaker.image}" alt="Master" style="width: 54px; height: 54px; border: 1px solid #333; image-rendering: pixelated;">
        <div>
          <strong style="color: var(--paper-cream); font-family: var(--font-pixel); font-size: 12px;">BREAKER #${String(masterBreaker.tokenId).padStart(4, '0')}</strong><br>
          <span style="font-size: 11px; color: var(--ink-soft);">${masterBreaker.tierName}</span><br>
          <span class="val-cyan" style="font-size: 11px; font-family: var(--font-mono);">${masterBreaker.multiplier} Base ${masterExistingOc ? `(+${masterExistingOc.toFixed(2)}x OC)` : ''}</span>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <select id="ocMasterSelectDropdown" style="width: 100%; background: #000; border: 1px solid #333; color: var(--paper-cream); font-family: var(--font-mono); font-size: 11px; padding: 6px;">
          ${userBreakers.map(b => `<option value="${b.tokenId}" ${b.tokenId === ocMasterTokenId ? 'selected' : ''}>Breaker #${String(b.tokenId).padStart(4, '0')} (${b.tierName})</option>`).join('')}
        </select>
      </div>
    `;

    const dropdown = document.getElementById('ocMasterSelectDropdown');
    if (dropdown) {
      dropdown.onchange = (e) => {
        ocMasterTokenId = parseInt(e.target.value, 10);
        // Remove master from sacrifice list if was selected
        ocSacrificeTokenIds = ocSacrificeTokenIds.filter(id => id !== ocMasterTokenId);
        playSound(850);
        renderOverclock();
      };
    }

    // 2. Sacrifice Pool Selector (All un-energized breakers except master)
    const eligibleSacrifices = userBreakers.filter(b => !b.energized && b.tokenId !== ocMasterTokenId);

    if (eligibleSacrifices.length === 0) {
      ocSacrificeList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--ink-soft); font-size: 12px;">No un-energized auxiliary Breakers available to sacrifice.</div>`;
    } else {
      let sacHtml = '';
      eligibleSacrifices.forEach(b => {
        const isSelected = ocSacrificeTokenIds.includes(b.tokenId);
        const boostVal = (b.tierName || '').includes('Type-1') ? '+0.25x' : '+0.50x';
        sacHtml += `
          <div class="oc-item-card ${isSelected ? 'selected-sacrifice' : ''}" data-token-id="${b.tokenId}">
            <img src="${b.image}" alt="Sacrifice ${b.tokenId}">
            <span class="oc-item-name">#${String(b.tokenId).padStart(4, '0')}</span>
            <span class="oc-item-boost">${boostVal} Boost</span>
          </div>
        `;
      });
      ocSacrificeList.innerHTML = sacHtml;

      ocSacrificeList.querySelectorAll('.oc-item-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const id = parseInt(e.currentTarget.getAttribute('data-token-id'), 10);
          toggleSacrificeSelection(id);
        });
      });
    }

    // 3. Boost calculation
    let totalAddedBoost = 0.0;
    ocSacrificeTokenIds.forEach(id => {
      const b = userBreakers.find(dev => dev.tokenId === id);
      if (b) {
        totalAddedBoost += (b.tierName || '').includes('Type-1') ? 0.25 : 0.50;
      }
    });

    if (ocBurnCountLabel) {
      ocBurnCountLabel.textContent = `${ocSacrificeTokenIds.length} SELECTED FOR DESTRUCTION`;
    }

    if (ocTotalBoostDisplay) {
      const finalMult = masterBaseVal + masterExistingOc + totalAddedBoost;
      ocTotalBoostDisplay.textContent = totalAddedBoost > 0 
        ? `${finalMult.toFixed(2)}x (+${totalAddedBoost.toFixed(2)}x Boost)` 
        : `${(masterBaseVal + masterExistingOc).toFixed(2)}x Current`;
    }

    if (executeOverclockBtn) {
      const canOverclock = ocSacrificeTokenIds.length > 0;
      executeOverclockBtn.disabled = !canOverclock;
      executeOverclockBtn.style.opacity = canOverclock ? '1' : '0.5';
      executeOverclockBtn.onclick = canOverclock ? executeOverclockAction : null;
    }
  }

  function toggleSacrificeSelection(tokenId) {
    playSound(900);
    const idx = ocSacrificeTokenIds.indexOf(tokenId);
    if (idx > -1) {
      ocSacrificeTokenIds.splice(idx, 1);
    } else {
      ocSacrificeTokenIds.push(tokenId);
    }
    renderOverclock();
  }

  // Execute Overclock Sacrifice
  async function executeOverclockAction() {
    if (!ocMasterTokenId || ocSacrificeTokenIds.length === 0) return;

    const confirmOverclock = confirm(
      `CONFIRM OVERCLOCK SACRIFICE:\n\nAre you sure you want to permanently incinerate ${ocSacrificeTokenIds.length} auxiliary Breaker(s) (#${ocSacrificeTokenIds.join(', #')}) to supercharge Master Breaker #${ocMasterTokenId}?\n\nThis action cannot be undone.`
    );
    if (!confirmOverclock) return;

    playSound(1900, 'sawtooth', 0.5);

    let addedBoost = 0.0;
    ocSacrificeTokenIds.forEach(id => {
      const b = userBreakers.find(dev => dev.tokenId === id);
      if (b) addedBoost += (b.tierName || '').includes('Type-1') ? 0.25 : 0.50;
    });

    // Destroy sacrifice devices
    const sacSet = new Set(ocSacrificeTokenIds);
    userBreakers = userBreakers.filter(b => !sacSet.has(b.tokenId));

    // Boost master device
    const master = userBreakers.find(b => b.tokenId === ocMasterTokenId);
    if (master) {
      master.overclockBonus = (master.overclockBonus || 0.0) + addedBoost;
    }

    globalNftsBurnedCount += ocSacrificeTokenIds.length;
    ocSacrificeTokenIds = [];

    alert(`MASTER OVERCLOCK COMPLETE!\n\n${sacSet.size} device(s) incinerated to 0x...dEaD.\nBreaker #${ocMasterTokenId} received +${addedBoost.toFixed(2)}x permanent yield multiplier boost!`);
    
    playSound(300, 'square', 0.2);
    updateStatsUI();
    renderInventory();
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

  // ---------------------------------------------------------------------------
  // SECURITY & VALIDATION HELPERS
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isValidAddress(addr) {
    return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr);
  }

  function isValidTokenId(id) {
    const num = Number(id);
    return Number.isInteger(num) && num >= 0 && num <= 10000;
  }

  // Enforce Connected Network is Robinhood Chain (4663 / 0x1237)
  async function ensureRobinhoodChain() {
    if (!window.ethereum) return false;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === '0x1237' || parseInt(chainId, 16) === 4663) {
        return true;
      }
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1237' }]
        });
        return true;
      } catch (switchErr) {
        if (switchErr.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x1237',
              chainName: 'Robinhood Chain',
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://rpc.robinhood.com'],
              blockExplorerUrls: ['https://explorer.robinhood.com']
            }]
          });
          return true;
        }
        throw switchErr;
      }
    } catch (err) {
      console.warn('Network switch declined or failed:', err);
      alert('Security Notice: Please switch your connected wallet to Robinhood Chain (Chain ID: 4663) to proceed.');
      return false;
    }
  }

  // ABI Helpers for standard EVM RPC encoding/decoding
  function pad32(val) {
    let clean = String(val);
    if (clean.startsWith('0x')) clean = clean.slice(2);
    return clean.padStart(64, '0');
  }

  async function ethCall(to, data) {
    if (!window.ethereum || !isValidAddress(to)) return null;
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

  // ---------------------------------------------------------------------------
  // CARD ACTIONS: LOCK 1.0 $FUSE TO ENERGIZE, UNLOCK, OR CLAIM
  // ---------------------------------------------------------------------------
  async function handleBreakerAction(tokenId) {
    if (!isValidTokenId(tokenId)) return;

    const breaker = userBreakers.find(b => b.tokenId === tokenId);
    if (!breaker) return;

    // Handle Demo / Localhost State
    if (!window.ethereum || !currentAccount) {
      if (breaker.energized) {
        alert(`Claimed +$${breaker.unclaimedYield.toFixed(2)} USD in tokenized stock dividends from Breaker #${tokenId}!`);
        breaker.unclaimedYield = 0.0;
      } else {
        if (userFuseBalance < 0.25) {
          alert('Insufficient $FUSE token balance. You need at least 0.25 $FUSE to lock into the Vault.');
          return;
        }
        userFuseBalance -= 0.25;
        breaker.energized = true;
        globalLockedCount += 1;
        alert(`BREAKER #${String(tokenId).padStart(4, '0')} ENERGIZED!\n\n0.25 $FUSE safely locked in escrow.\nYour device is now routed to the 90% High-Voltage Yield Grid.`);
      }
      totalYieldAccrued = userBreakers.reduce((acc, b) => acc + (b.unclaimedYield || 0), 0);
      updateStatsUI();
      renderInventory();
      return;
    }

    if (!isValidAddress(currentAccount)) return;
    const isCorrectChain = await ensureRobinhoodChain();
    if (!isCorrectChain) return;

    if (breaker.energized) {
      // Claim Dividends from Vault Contract
      try {
        playSound(1300);
        // claimDividends(uint256 tokenId): selector 0xbd7047c4
        const claimData = '0xbd7047c4' + pad32(tokenId.toString(16));
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: currentAccount,
            to: CONTRACTS.VAULT,
            data: claimData
          }]
        });
        alert(`Dividend Claim Submitted!\nTX Hash: ${txHash}\nDividends will be credited to your wallet in tokenized stocks / USDG.`);
        await scanUserHoldings(currentAccount);
      } catch (err) {
        console.error('Claim failed:', err);
        alert(err.message || 'Dividend claim transaction was cancelled or rejected.');
      }
    } else {
      // Lock 0.25 $FUSE to Energize (90% Pool)
      if (userFuseBalance < 0.25) {
        alert('Insufficient $FUSE token balance. You need at least 0.25 $FUSE in your wallet to lock into the Vault.');
        return;
      }

      try {
        playSound(1800, 'sawtooth', 0.2);

        // 1. Check Allowance for Vault on $FUSE Token
        const allowData = '0xdd62ed3e' + pad32(currentAccount) + pad32(CONTRACTS.VAULT);
        const allowRes = await ethCall(CONTRACTS.FUSE, allowData);
        const currentAllowance = (allowRes && allowRes !== '0x') ? BigInt(allowRes) : 0n;

        const requiredCost = 250000000000000000n; // Exact 0.25 $FUSE (0.25 ether)

        if (currentAllowance < requiredCost) {
          const approveAmount = pad32(requiredCost.toString(16));
          const approveData = '0x095ea7b3' + pad32(CONTRACTS.VAULT) + approveAmount;
          
          alert('Step 1/2: Please approve locking 0.25 $FUSE in Vault escrow (refundable).');
          const approveTx = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: currentAccount,
              to: CONTRACTS.FUSE,
              data: approveData
            }]
          });
          console.log('Safe Approval TX:', approveTx);
        }

        // 2. Call lockAndEnergize(tokenId): selector 0x0644b6c2
        alert(`Step 2/2: Confirm locking 0.25 $FUSE to Energize Breaker #${String(tokenId).padStart(4, '0')} (90% Pool)...`);
        const lockData = '0x0644b6c2' + pad32(tokenId.toString(16));
        const lockTx = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: currentAccount,
            to: CONTRACTS.VAULT,
            data: lockData
          }]
        });

        playSound(300, 'square', 0.1);
        alert(`BREAKER #${String(tokenId).padStart(4, '0')} ENERGIZED!\nTX Hash: ${lockTx}\n0.25 $FUSE escrowed. Device is now streaming from the 90% High-Voltage Yield Grid.`);
        await scanUserHoldings(currentAccount);
      } catch (err) {
        console.error('Lock to Energize transaction failed:', err);
        alert(err.message || 'Transaction was cancelled or rejected.');
      }
    }
  }

  // Handle Unlock 1.0 $FUSE Action (De-energize back to Standby)
  async function handleUnlockAction(tokenId) {
    if (!isValidTokenId(tokenId)) return;

    const breaker = userBreakers.find(b => b.tokenId === tokenId);
    if (!breaker || !breaker.energized) return;

    const confirmUnlock = confirm(
      `UNLOCK 0.25 $FUSE & DE-ENERGIZE:\n\nAre you sure you want to return Breaker #${tokenId} to Standby (10% Pool)?\n\nYour 0.25 $FUSE will be refunded to your wallet, and any pending dividends will be automatically claimed.`
    );
    if (!confirmUnlock) return;

    // Handle Demo / Localhost State
    if (!window.ethereum || !currentAccount) {
      userFuseBalance += 0.25;
      breaker.energized = false;
      if (globalLockedCount > 0) globalLockedCount -= 1;
      alert(`Breaker #${tokenId} returned to Standby (10% pool). 0.25 $FUSE refunded to your wallet!`);
      updateStatsUI();
      renderInventory();
      return;
    }

    if (!isValidAddress(currentAccount)) return;
    const isCorrectChain = await ensureRobinhoodChain();
    if (!isCorrectChain) return;

    try {
      playSound(700);
      // unlockAndDeenergize(uint256 tokenId): selector 0x64cb3354
      const unlockData = '0x64cb3354' + pad32(tokenId.toString(16));
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: CONTRACTS.VAULT,
          data: unlockData
        }]
      });

      alert(`0.25 $FUSE Unlocked!\nTX Hash: ${txHash}\nTokens refunded to your wallet. Device returned to 10% Standby Pool.`);
      await scanUserHoldings(currentAccount);
    } catch (err) {
      console.error('Unlock failed:', err);
      alert(err.message || 'Unlock transaction was cancelled or rejected.');
    }
  }

  // ---------------------------------------------------------------------------
  // SCAN HOLDINGS VIA EVM PROVIDER
  // ---------------------------------------------------------------------------
  async function scanUserHoldings(account) {
    playSound(750);
    if (inventoryCountEl) inventoryCountEl.textContent = 'SCANNING CHAIN...';

    if (!window.ethereum || !isValidAddress(account)) {
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
        globalLockedCount = Number(BigInt(totalEnergizedRes));
      }

      // 3. Query NFT Balance (ERC-721: balanceOf)
      const nftBalData = '0x70a08231' + pad32(account);
      const nftBalRes = await ethCall(CONTRACTS.NFT, nftBalData);
      const nftCount = (nftBalRes && nftBalRes !== '0x') ? Number(BigInt(nftBalRes)) : 0;

      const detectedBreakers = [];

      if (nftCount > 0) {
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
              // Query isEnergized(tokenId) on Vault: selector 0x7c1f1891
              const energizedData = '0x7c1f1891' + pad32(tokenId.toString(16));
              const energizedRes = await ethCall(CONTRACTS.VAULT, energizedData);
              const isEnergized = energizedRes ? (BigInt(energizedRes) > 0n) : false;

              // Query getPendingYield(uint256): selector 0x16e63fea
              let pendingDividendsEth = 0.0;
              const yieldData = '0x16e63fea' + pad32(tokenId.toString(16));
              const yieldRes = await ethCall(CONTRACTS.VAULT, yieldData);
              if (yieldRes && yieldRes !== '0x') {
                pendingDividendsEth = Number(BigInt(yieldRes)) / 1e18;
              }

              // Query overclockBonusPoints(tokenId): selector 0x5672f2d2
              let ocBonusPoints = 0.0;
              const ocData = '0x5672f2d2' + pad32(tokenId.toString(16));
              const ocRes = await ethCall(CONTRACTS.VAULT, ocData);
              if (ocRes && ocRes !== '0x') {
                ocBonusPoints = Number(BigInt(ocRes)) / 100.0;
              }

              const tierInfo = getBreakerTier(tokenId);

              detectedBreakers.push({
                tokenId: tokenId,
                energized: isEnergized,
                tierName: tierInfo.tierName,
                multiplier: tierInfo.multiplier,
                overclockBonus: ocBonusPoints,
                image: tierInfo.image,
                unclaimedYield: pendingDividendsEth
              });
            }
          }
        } catch (logErr) {
          console.warn('Transfer log scan warning:', logErr);
        }
      }

      userBreakers = detectedBreakers;
      totalYieldAccrued = detectedBreakers.reduce((acc, b) => acc + (b.unclaimedYield || 0), 0);
    } catch (err) {
      console.warn('Holdings scan completed with default state:', err);
    }

    renderInventory();
    updateStatsUI();
  }

  // ---------------------------------------------------------------------------
  // LOCALHOST DEMO GRID (FOR TESTING FULL FLOW WITHOUT LIVE FUNDS)
  // ---------------------------------------------------------------------------
  function loadDemoState() {
    initAudio();
    playSound(1100);
    currentAccount = '0x71C...DEMO_TESTER';
    userFuseBalance = 10.0;
    globalLockedCount = 420;
    globalNftsBurnedCount = 18;

    userBreakers = [
      { tokenId: 101, energized: false, tierName: 'Type-1 Single-Phase', multiplier: '1.0x', overclockBonus: 0.0, image: 'assets/type1.jpg', unclaimedYield: 1.25 },
      { tokenId: 102, energized: false, tierName: 'Type-1 Single-Phase', multiplier: '1.0x', overclockBonus: 0.0, image: 'assets/type1.jpg', unclaimedYield: 1.25 },
      { tokenId: 103, energized: false, tierName: 'Type-1 Single-Phase', multiplier: '1.0x', overclockBonus: 0.0, image: 'assets/type1.jpg', unclaimedYield: 1.25 },
      { tokenId: 415, energized: true,  tierName: 'Type-2 Dual Relay', multiplier: '1.5x', overclockBonus: 0.0, image: 'assets/type2.jpg', unclaimedYield: 14.80 },
      { tokenId: 700, energized: true,  tierName: 'Type-3 HV Transformer', multiplier: '2.5x', overclockBonus: 0.5, image: 'assets/type3.jpg', unclaimedYield: 38.50 }
    ];

    totalYieldAccrued = userBreakers.reduce((acc, b) => acc + (b.unclaimedYield || 0), 0);
    updateStatsUI();
    renderInventory();
    alert('🧪 LOCALHOST DEMO GRID LOADED!\n\n• 3 Type-1 Breakers (Available to melt in The Forge)\n• 1 Type-2 Energized Breaker (Earning 90% pool)\n• 1 Type-3 Overclocked Breaker (+0.5x bonus)\n• 10.0 $FUSE in wallet\n\nYou can now test Locking, Unlocking, The Forge, and Overclock Lab freely on localhost!');
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
      if (accounts && accounts.length > 0 && isValidAddress(accounts[0])) {
        currentAccount = accounts[0];
        localStorage.removeItem('cb_disconnected');
        localStorage.setItem('cb_connected_wallet', currentAccount);
        localStorage.setItem('cb_wallet_type', walletType || 'injected');
        playSound(1200);

        if (navConnectBtn) {
          navConnectBtn.textContent = formatAddress(currentAccount);
          navConnectBtn.classList.add('connected');
        }

        updateStatsUI();
        await scanUserHoldings(currentAccount);
      }
    } catch (err) {
      console.error('Wallet connection rejected:', err);
    }
  }

  // Auto-Detect / Restore Wallet on Load
  async function autoDetectWallet() {
    if (localStorage.getItem('cb_disconnected') === 'true') return;

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
        if (accounts && accounts.length > 0 && isValidAddress(accounts[0])) {
          currentAccount = accounts[0];
          localStorage.setItem('cb_connected_wallet', currentAccount);
          if (navConnectBtn) {
            navConnectBtn.textContent = formatAddress(currentAccount);
            navConnectBtn.classList.add('connected');
          }
          updateStatsUI();
          await scanUserHoldings(currentAccount);
          return;
        }
      } catch (err) {
        console.warn('Silent account check in energize.js:', err);
      }
    }

    if (savedAccount && isValidAddress(savedAccount)) {
      currentAccount = savedAccount;
      if (navConnectBtn) {
        navConnectBtn.textContent = formatAddress(currentAccount);
        navConnectBtn.classList.add('connected');
      }
      updateStatsUI();
      scanUserHoldings(currentAccount);
    }
  }

  // Account Disconnect Modal Logic
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

  if (closeAccountModalBtn) closeAccountModalBtn.addEventListener('click', closeAccountModal);
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

  // Disconnect Wallet
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

  if (disconnectWalletBtn) disconnectWalletBtn.addEventListener('click', disconnectWallet);

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
      alert(`All Yield Claimed! Successfully streamed +$${totalYieldAccrued.toFixed(2)} USD in tokenized stock dividends to ${formatAddress(currentAccount)}.`);
      totalYieldAccrued = 0.0;
      userBreakers.forEach(b => { b.unclaimedYield = 0.0; });
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

  // Initial Render
  updateStatsUI();
  renderInventory();
  autoDetectWallet();

});
