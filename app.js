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

  // Audio Toggle Button
  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      const icon = document.getElementById('audioIcon');
      if (icon) icon.textContent = audioEnabled ? '🔊' : '🔇';
      audioToggle.style.opacity = audioEnabled ? '1' : '0.5';
      playClickSound(1000);
    });
  }

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

  // State Management
  const state = {
    xUsername: '',
    walletAddress: '',
    replyUrl: '',
    task1: false,
    task2: false,
    task3: false,
    serialNumber: Math.floor(100 + Math.random() * 900)
  };

  // Form Elements
  const xInput = document.getElementById('xUsername');
  const walletInput = document.getElementById('walletAddress');
  const submitRegBtn = document.getElementById('submitRegBtn');

  // Task Buttons & Elements
  const checkTask1 = document.getElementById('checkTask1');
  const checkTask2 = document.getElementById('checkTask2');
  const checkTask3 = document.getElementById('checkTask3');
  const replyUrlInput = document.getElementById('replyUrl');

  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');

  // Modal Elements
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const doneBtn = document.getElementById('doneBtn');

  // Task Verification Handlers
  if (checkTask1) {
    checkTask1.addEventListener('click', () => {
      state.task1 = true;
      checkTask1.classList.add('done');
      checkTask1.innerHTML = 'Confirmed ✓';
      const tc1 = document.getElementById('taskCard1');
      if (tc1) tc1.classList.add('completed');
      validateFormState();
      playClickSound(1100);
    });
  }

  if (checkTask2) {
    checkTask2.addEventListener('click', () => {
      state.task2 = true;
      checkTask2.classList.add('done');
      checkTask2.innerHTML = 'Confirmed ✓';
      const tc2 = document.getElementById('taskCard2');
      if (tc2) tc2.classList.add('completed');
      validateFormState();
      playClickSound(1100);
    });
  }

  if (checkTask3) {
    checkTask3.addEventListener('click', () => {
      const url = replyUrlInput ? replyUrlInput.value.trim() : '';
      if (!url || (!url.includes('x.com') && !url.includes('twitter.com'))) {
        alert('Please enter a valid X reply link (e.g. https://x.com/your_handle/status/...)');
        if (replyUrlInput) replyUrlInput.focus();
        return;
      }
      state.replyUrl = url;
      state.task3 = true;
      checkTask3.classList.add('done');
      checkTask3.innerHTML = 'Verified ✓';
      const tc3 = document.getElementById('taskCard3');
      if (tc3) tc3.classList.add('completed');
      validateFormState();
      playClickSound(1100);
    });
  }

  // Real-time Form & Progress Validation
  if (xInput) xInput.addEventListener('input', validateFormState);
  if (walletInput) walletInput.addEventListener('input', validateFormState);

  function validateFormState() {
    if (!xInput || !walletInput) return false;
    const handle = xInput.value.trim();
    const wallet = walletInput.value.trim();
    state.xUsername = handle;
    state.walletAddress = wallet;

    // Count completed social tasks
    let completedTasks = 0;
    if (state.task1) completedTasks++;
    if (state.task2) completedTasks++;
    if (state.task3) completedTasks++;

    const percent = Math.round((completedTasks / 3) * 100);
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${completedTasks} / 3 TASKS COMPLETED`;

    // Validate EVM Wallet format
    const isValidWallet = /^0x[a-fA-F0-9]{40}$/.test(wallet);
    const isValidHandle = handle.length >= 2;

    const isFormReady = isValidHandle && isValidWallet && completedTasks === 3;
    if (submitRegBtn) submitRegBtn.disabled = !isFormReady;

    return isFormReady;
  }

  // Form Submit Action
  if (submitRegBtn) {
    submitRegBtn.addEventListener('click', () => {
      if (!validateFormState()) return;

      // Populate Receipt Modal
      const recWallet = document.getElementById('recWallet');
      const recHandle = document.getElementById('recHandle');
      const recSerial = document.getElementById('recSerial');
      const recTime = document.getElementById('recTime');

      if (recWallet) recWallet.textContent = state.walletAddress;
      if (recHandle) recHandle.textContent = `@${state.xUsername.replace(/^@/, '')}`;
      if (recSerial) recSerial.textContent = `#CB-${state.serialNumber}`;
      if (recTime) recTime.textContent = new Date().toUTCString();

      // Save to localStorage
      const regRecord = {
        xHandle: state.xUsername,
        wallet: state.walletAddress,
        serial: state.serialNumber,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('cb_registration', JSON.stringify(regRecord));

      // Show Modal
      if (successModal) successModal.removeAttribute('hidden');
      playClickSound(1400);
    });
  }

  // Modal Close & Reset
  function hideModal() {
    if (successModal) successModal.setAttribute('hidden', 'true');
    playClickSound(600);
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      hideModal();
      alert('🎉 Whitelist Ticket Saved! Thank you for energizing your registration for Circuit Breakers.');
    });
  }

  // ---------------------------------------------------------------------------
  // WEB3 WALLET SELECTION MODAL LOGIC (OKX, MetaMask, WalletConnect, Phantom, etc.)
  // ---------------------------------------------------------------------------
  const navConnectBtn = document.getElementById('navConnectBtn');
  const walletModalOverlay = document.getElementById('walletModalOverlay');
  const closeWalletModalBtn = document.getElementById('closeWalletModal');
  const moreWalletsToggle = document.getElementById('moreWalletsToggle');
  const moreWalletsList = document.getElementById('moreWalletsList');
  const moreWalletsArrow = document.getElementById('moreWalletsArrow');
  let currentNavAccount = null;

  function formatNavAddress(addr) {
    if (!addr) return 'CONNECT WALLET';
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
      if (accounts && accounts.length > 0) {
        currentNavAccount = accounts[0];
        localStorage.setItem('cb_connected_wallet', currentNavAccount);
        localStorage.setItem('cb_wallet_type', walletType || 'injected');
        playClickSound(1200);

        if (navConnectBtn) {
          navConnectBtn.textContent = formatNavAddress(currentNavAccount);
          navConnectBtn.classList.add('connected');
        }

        if (walletInput && !walletInput.value) {
          walletInput.value = currentNavAccount;
          state.walletAddress = currentNavAccount;
          validateFormState();
        }
      }
    } catch (err) {
      console.error('Wallet connection rejected:', err);
    }
  }

  // Auto-Detect / Restore Wallet on Load
  async function autoDetectNavWallet() {
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
          currentNavAccount = accounts[0];
          localStorage.setItem('cb_connected_wallet', currentNavAccount);
          if (navConnectBtn) {
            navConnectBtn.textContent = formatNavAddress(currentNavAccount);
            navConnectBtn.classList.add('connected');
          }
          if (walletInput && !walletInput.value) {
            walletInput.value = currentNavAccount;
            state.walletAddress = currentNavAccount;
            validateFormState();
          }
          return;
        }
      } catch (err) {
        console.warn('Silent account check in app.js:', err);
      }
    }

    if (savedAccount) {
      currentNavAccount = savedAccount;
      if (navConnectBtn) {
        navConnectBtn.textContent = formatNavAddress(currentNavAccount);
        navConnectBtn.classList.add('connected');
      }
      if (walletInput && !walletInput.value) {
        walletInput.value = currentNavAccount;
        state.walletAddress = currentNavAccount;
        validateFormState();
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
        if (confirm(`Connected as ${currentNavAccount}.\n\nDo you want to disconnect?`)) {
          currentNavAccount = null;
          localStorage.removeItem('cb_connected_wallet');
          localStorage.removeItem('cb_wallet_type');
          navConnectBtn.textContent = 'CONNECT WALLET';
          navConnectBtn.classList.remove('connected');
          playClickSound(600);
        }
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
        if (walletInput && !walletInput.value) {
          walletInput.value = currentNavAccount;
          state.walletAddress = currentNavAccount;
          validateFormState();
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
        currentNavAccount = null;
        localStorage.removeItem('cb_connected_wallet');
        localStorage.removeItem('cb_wallet_type');
        if (navConnectBtn) {
          navConnectBtn.textContent = 'CONNECT WALLET';
          navConnectBtn.classList.remove('connected');
        }
      } else {
        currentNavAccount = accounts[0];
        localStorage.setItem('cb_connected_wallet', currentNavAccount);
        if (navConnectBtn) {
          navConnectBtn.textContent = formatNavAddress(currentNavAccount);
          navConnectBtn.classList.add('connected');
        }
        if (walletInput && !walletInput.value) {
          walletInput.value = currentNavAccount;
          state.walletAddress = currentNavAccount;
          validateFormState();
        }
      }
    });
  }

  // Initial Auto-Detect
  autoDetectNavWallet();

});
