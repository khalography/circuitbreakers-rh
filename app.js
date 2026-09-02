/**
 * CIRCUIT BREAKERS - Unified Terminal & Whitelist Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // Audio Engine (Web Audio API for Tactile Mechanical Clicks)
  let audioEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playClickSound(freq = 800, type = 'square', duration = 0.04) {
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
    playClickSound(1000);
  }

  if (audioToggle) audioToggle.addEventListener('click', toggleAudio);
  if (mobileAudioToggle) mobileAudioToggle.addEventListener('click', toggleAudio);

  // Attach click sounds to all buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => playClickSound(700));
  });

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
      playClickSound(isOpen ? 950 : 650);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (hamburgerIcon) hamburgerIcon.textContent = '☰';
      });
    });
  }

  // ---------------------------------------------------------------------------
  // HERO DEVICE PREVIEW INTERACTION & VOLTAGE SIMULATION
  // ---------------------------------------------------------------------------
  const heroDeviceImg = document.getElementById('heroDeviceImg');
  const voltageVal = document.getElementById('voltageVal');
  const heroBadge = document.querySelector('.device-badge');
  
  const deviceShowcases = [
    { name: 'TYPE-1 SINGLE BAKELITE', src: 'assets/type1.jpg', voltage: '110V / 20A' },
    { name: 'TYPE-2 DUAL RELAY', src: 'assets/type2.jpg', voltage: '125V / 50A' },
    { name: 'TYPE-3 TRANSFORMER', src: 'assets/type3.jpg', voltage: '220V / 100A' }
  ];
  let currentDeviceIndex = 1;

  if (heroDeviceImg) {
    heroDeviceImg.style.cursor = 'pointer';
    heroDeviceImg.addEventListener('click', () => {
      currentDeviceIndex = (currentDeviceIndex + 1) % deviceShowcases.length;
      const d = deviceShowcases[currentDeviceIndex];
      heroDeviceImg.src = d.src;
      if (heroBadge) heroBadge.textContent = d.name;
      if (voltageVal) voltageVal.textContent = d.voltage;
      playClickSound(1100);
    });
  }

  // Micro-fluctuation of voltage meter
  if (voltageVal) {
    setInterval(() => {
      const baseV = currentDeviceIndex === 2 ? 220 : (currentDeviceIndex === 1 ? 125 : 110);
      const randOffset = (Math.random() * 4 - 2).toFixed(1);
      const v = (baseV + parseFloat(randOffset)).toFixed(1);
      voltageVal.textContent = `${v}V / ${currentDeviceIndex === 2 ? 100 : (currentDeviceIndex === 1 ? 50 : 20)}A`;
    }, 3500);
  }

  // ---------------------------------------------------------------------------
  // WEB3 WALLET SELECTION & DISCONNECT MODAL LOGIC
  // ---------------------------------------------------------------------------
  const navConnectBtn = document.getElementById('navConnectBtn');
  const walletModalOverlay = document.getElementById('walletModalOverlay');
  const closeWalletModalBtn = document.getElementById('closeWalletModal');
  const accountModalOverlay = document.getElementById('accountModalOverlay');
  const closeAccountModalBtn = document.getElementById('closeAccountModal');
  const disconnectWalletBtn = document.getElementById('disconnectWalletBtn');
  const modalAccountAddress = document.getElementById('modalAccountAddress');
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const moreWalletsToggle = document.getElementById('moreWalletsToggle');
  const moreWalletsList = document.getElementById('moreWalletsList');
  const moreWalletsArrow = document.getElementById('moreWalletsArrow');
  let currentNavAccount = null;

  // Security: Validate Ethereum Address
  function isValidAddress(addr) {
    return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr);
  }

  function formatNavAddress(addr) {
    if (!isValidAddress(addr)) return 'CONNECT WALLET';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }

  function openWalletModal() {
    if (!walletModalOverlay) return;
    initAudio();
    playClickSound(900);
    
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
    playClickSound(600);
  }

  function openAccountModal() {
    if (!accountModalOverlay || !currentNavAccount) return;
    initAudio();
    playClickSound(800);
    if (modalAccountAddress) {
      modalAccountAddress.textContent = currentNavAccount;
    }
    accountModalOverlay.classList.add('open');
  }

  function closeAccountModal() {
    if (!accountModalOverlay) return;
    accountModalOverlay.classList.remove('open');
    playClickSound(600);
  }

  if (closeWalletModalBtn) {
    closeWalletModalBtn.addEventListener('click', closeWalletModal);
  }

  if (closeAccountModalBtn) {
    closeAccountModalBtn.addEventListener('click', closeAccountModal);
  }

  if (walletModalOverlay) {
    walletModalOverlay.addEventListener('click', (e) => {
      if (e.target === walletModalOverlay) closeWalletModal();
    });
  }

  if (accountModalOverlay) {
    accountModalOverlay.addEventListener('click', (e) => {
      if (e.target === accountModalOverlay) closeAccountModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (walletModalOverlay && walletModalOverlay.classList.contains('open')) closeWalletModal();
      if (accountModalOverlay && accountModalOverlay.classList.contains('open')) closeAccountModal();
    }
  });

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      if (!currentNavAccount) return;
      navigator.clipboard.writeText(currentNavAccount).then(() => {
        copyAddressBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyAddressBtn.textContent = '📋 Copy'; }, 2000);
      });
      playClickSound(1100);
    });
  }

  // Explicit Disconnect Action
  function disconnectNavWallet() {
    currentNavAccount = null;
    localStorage.removeItem('cb_connected_wallet');
    localStorage.removeItem('cb_wallet_type');
    localStorage.setItem('cb_disconnected', 'true');

    if (navConnectBtn) {
      navConnectBtn.textContent = 'CONNECT WALLET';
      navConnectBtn.classList.remove('connected');
    }

    closeAccountModal();
    playClickSound(600);
  }

  if (disconnectWalletBtn) {
    disconnectWalletBtn.addEventListener('click', disconnectNavWallet);
  }

  if (moreWalletsToggle && moreWalletsList) {
    moreWalletsToggle.addEventListener('click', () => {
      const isHidden = moreWalletsList.style.display === 'none';
      moreWalletsList.style.display = isHidden ? 'flex' : 'none';
      if (moreWalletsArrow) moreWalletsArrow.innerHTML = isHidden ? '&uarr;' : '&darr;';
      playClickSound(700);
    });
  }

  async function connectSpecificWallet(walletType) {
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
      playClickSound(900);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0 && isValidAddress(accounts[0])) {
        currentNavAccount = accounts[0];
        localStorage.removeItem('cb_disconnected');
        localStorage.setItem('cb_connected_wallet', currentNavAccount);
        localStorage.setItem('cb_wallet_type', walletType || 'injected');
        playClickSound(1200);

        if (navConnectBtn) {
          navConnectBtn.textContent = formatNavAddress(currentNavAccount);
          navConnectBtn.classList.add('connected');
        }
      }
    } catch (err) {
      console.error('Wallet connection rejected:', err);
    }
  }

  // Auto-Detect / Restore Wallet on Load (RESPECTS cb_disconnected)
  async function autoDetectNavWallet() {
    // If the user explicitly disconnected, never auto-connect on reload!
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
        if (accounts && accounts.length > 0 && isValidAddress(accounts[0])) {
          currentNavAccount = accounts[0];
          localStorage.setItem('cb_connected_wallet', currentNavAccount);
          if (navConnectBtn) {
            navConnectBtn.textContent = formatNavAddress(currentNavAccount);
            navConnectBtn.classList.add('connected');
          }
          return;
        }
      } catch (err) {
        console.warn('Silent account check in app.js:', err);
      }
    }

    if (savedAccount && isValidAddress(savedAccount)) {
      currentNavAccount = savedAccount;
      if (navConnectBtn) {
        navConnectBtn.textContent = formatNavAddress(currentNavAccount);
        navConnectBtn.classList.add('connected');
      }
    }
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

  if (navConnectBtn) {
    navConnectBtn.addEventListener('click', () => {
      if (currentNavAccount) {
        openAccountModal();
      } else {
        openWalletModal();
      }
    });
  }

  // Cross-Tab & Cross-Page State Sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'cb_connected_wallet') {
      if (e.newValue) {
        currentNavAccount = e.newValue;
        if (navConnectBtn) {
          navConnectBtn.textContent = formatNavAddress(currentNavAccount);
          navConnectBtn.classList.add('connected');
        }
      } else {
        currentNavAccount = null;
        if (navConnectBtn) {
          navConnectBtn.textContent = 'CONNECT WALLET';
          navConnectBtn.classList.remove('connected');
        }
      }
    }
  });

  // Listen to provider events
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectNavWallet();
      } else {
        currentNavAccount = accounts[0];
        localStorage.removeItem('cb_disconnected');
        localStorage.setItem('cb_connected_wallet', currentNavAccount);
        if (navConnectBtn) {
          navConnectBtn.textContent = formatNavAddress(currentNavAccount);
          navConnectBtn.classList.add('connected');
        }
      }
    });
  }

  // Initial Auto-Detect
  autoDetectNavWallet();

});
