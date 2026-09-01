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
  audioToggle.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    document.getElementById('audioIcon').textContent = audioEnabled ? '🔊' : '🔇';
    audioToggle.style.opacity = audioEnabled ? '1' : '0.5';
    playClickSound(1000);
  });

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

  // ==========================================
  // ENERGIZE & YIELD DESK INTERACTIONS
  // ==========================================
  let userFuseBalance = 3.0;
  let totalYieldAccrued = 42.80;
  let yield1892 = 24.85;
  let yield407 = 0.0;
  let is407Energized = false;

  const energizeBtn407 = document.getElementById('energizeBtn407');
  const fuseBalanceEl = document.getElementById('fuseBalance');
  const totalAccruedYieldEl = document.getElementById('totalAccruedYield');
  const claimBtn1892 = document.getElementById('claimBtn1892');
  const claimAllYieldBtn = document.getElementById('claimAllYieldBtn');

  // Energize Breaker #0407 Action
  if (energizeBtn407) {
    energizeBtn407.addEventListener('click', () => {
      if (is407Energized) {
        // Already energized: Action is Claim Dividend
        if (yield407 <= 0.0) {
          alert('No pending dividends to claim right now. Yield streams continuously from DEX trades.');
          return;
        }
        totalYieldAccrued -= yield407;
        alert(`⚡ Claimed +$${yield407.toFixed(2)} in stock dividends to your wallet!`);
        yield407 = 0.0;
        energizeBtn407.textContent = `CLAIM $0.00 DIVIDENDS ✓`;
        totalAccruedYieldEl.textContent = `$${totalYieldAccrued.toFixed(2)} USD`;
        claimAllYieldBtn.textContent = `Claim All Yield ($${totalYieldAccrued.toFixed(2)})`;
        playClickSound(1200);
        return;
      }

      if (userFuseBalance < 1.0) {
        alert('Insufficient $FUSE balance. You need 1.0 $FUSE to energize a breaker.');
        return;
      }

      // 1. Play High-Voltage Ignition Sound Effect
      playClickSound(1800, 'sawtooth', 0.2);
  // ---------------------------------------------------------------------------
  // WEB3 NAVBAR WALLET CONNECT (MetaMask, Rabby, Coinbase Wallet)
  // ---------------------------------------------------------------------------
  const navConnectBtn = document.getElementById('navConnectBtn');
  let currentNavAccount = null;

  function formatNavAddress(addr) {
    if (!addr) return 'CONNECT WALLET';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }

  async function connectNavWallet() {
    playClickSound(900);
    if (typeof window.ethereum === 'undefined') {
      alert('No Web3 EVM wallet detected. Please install MetaMask, Rabby, or Coinbase Wallet.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        currentNavAccount = accounts[0];
        playClickSound(1200);

        if (navConnectBtn) {
          navConnectBtn.textContent = formatNavAddress(currentNavAccount);
          navConnectBtn.classList.add('connected');
        }

        // Autofill wallet address on registration form if present
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

  if (navConnectBtn) {
    navConnectBtn.addEventListener('click', () => {
      if (currentNavAccount) {
        if (confirm(`Connected as ${currentNavAccount}.\n\nDo you want to disconnect?`)) {
          currentNavAccount = null;
          navConnectBtn.textContent = 'CONNECT WALLET';
          navConnectBtn.classList.remove('connected');
          playClickSound(600);
        }
      } else {
        connectNavWallet();
      }
    });
  }

  // Listen to provider events
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (!accounts || accounts.length === 0) {
        currentNavAccount = null;
        if (navConnectBtn) {
          navConnectBtn.textContent = 'CONNECT WALLET';
          navConnectBtn.classList.remove('connected');
        }
      } else {
        currentNavAccount = accounts[0];
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

});
