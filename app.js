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
  checkTask1.addEventListener('click', () => {
    state.task1 = true;
    checkTask1.classList.add('done');
    checkTask1.innerHTML = 'Confirmed ✓';
    document.getElementById('taskCard1').classList.add('completed');
    validateFormState();
    playClickSound(1100);
  });

  checkTask2.addEventListener('click', () => {
    state.task2 = true;
    checkTask2.classList.add('done');
    checkTask2.innerHTML = 'Confirmed ✓';
    document.getElementById('taskCard2').classList.add('completed');
    validateFormState();
    playClickSound(1100);
  });

  checkTask3.addEventListener('click', () => {
    const url = replyUrlInput.value.trim();
    if (!url || (!url.includes('x.com') && !url.includes('twitter.com'))) {
      alert('Please enter a valid X reply link (e.g. https://x.com/your_handle/status/...)');
      replyUrlInput.focus();
      return;
    }
    state.replyUrl = url;
    state.task3 = true;
    checkTask3.classList.add('done');
    checkTask3.innerHTML = 'Verified ✓';
    document.getElementById('taskCard3').classList.add('completed');
    validateFormState();
    playClickSound(1100);
  });

  // Real-time Form & Progress Validation
  xInput.addEventListener('input', validateFormState);
  walletInput.addEventListener('input', validateFormState);

  function validateFormState() {
    const handle = xInput.value.trim();
    const wallet = walletInput.value.trim();

    let count = (state.task1 ? 1 : 0) + (state.task2 ? 1 : 0) + (state.task3 ? 1 : 0);
    let pct = Math.round((count / 3) * 100);

    progressFill.style.width = pct + '%';
    progressPercent.textContent = `${count} / 3 TASKS COMPLETED`;

    const isValidIdentity = handle.length > 0 && wallet.startsWith('0x') && wallet.length >= 15;

    if (count === 3 && isValidIdentity) {
      submitRegBtn.disabled = false;
      submitRegBtn.classList.add('btn-primary');
    } else {
      submitRegBtn.disabled = true;
    }
  }

  // Registration Submission
  submitRegBtn.addEventListener('click', () => {
    let handle = xInput.value.trim().replace(/^@/, '');
    let wallet = walletInput.value.trim();

    if (!handle) {
      alert('Please enter your X username.');
      xInput.focus();
      return;
    }
    if (!wallet || !wallet.startsWith('0x')) {
      alert('Please enter a valid Robinhood Chain EVM wallet address.');
      walletInput.focus();
      return;
    }

    state.xUsername = '@' + handle;
    state.walletAddress = wallet;

    // Populate Success Receipt Modal
    document.getElementById('recSerial').textContent = `#${state.serialNumber.toString().padStart(4, '0')}`;
    document.getElementById('recHandle').textContent = state.xUsername;
    document.getElementById('recWallet').textContent = state.walletAddress;
    document.getElementById('recReply').textContent = state.replyUrl.length > 35 ? state.replyUrl.substring(0, 35) + '...' : state.replyUrl;
    document.getElementById('recTime').textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // Store in LocalStorage
    const regRecord = {
      handle: state.xUsername,
      wallet: state.walletAddress,
      replyUrl: state.replyUrl,
      serial: state.serialNumber,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cb_registration', JSON.stringify(regRecord));

    // Show Modal
    successModal.removeAttribute('hidden');
    playClickSound(1400);
  });

  // Modal Close & Reset
  function hideModal() {
    successModal.setAttribute('hidden', 'true');
    playClickSound(600);
  }

  closeModalBtn.addEventListener('click', hideModal);
  doneBtn.addEventListener('click', () => {
    hideModal();
    alert('🎉 Whitelist Ticket Saved! Thank you for energizing your registration for Circuit Breakers.');
  });

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
      setTimeout(() => playClickSound(300, 'square', 0.1), 100);

      // 2. Trigger Flash Ignition Animation
      const card407 = document.getElementById('breakerCard407');
      card407.classList.add('igniting');
      
      // 3. Update Balance
      userFuseBalance -= 1.0;
      fuseBalanceEl.textContent = `${userFuseBalance.toFixed(2)} $FUSE`;

      // 4. Update Card Visual State
      setTimeout(() => {
        card407.classList.remove('igniting');
        card407.classList.add('energized');
        
        document.getElementById('badge407').className = 'bd-badge badge-energized';
        document.getElementById('badge407').textContent = 'ENERGIZED 🟢';

        document.getElementById('artWrap407').classList.add('bd-art-energized');
        const sw = document.getElementById('switch407');
        sw.className = 'switch-status switch-active';
        sw.textContent = '[ CIRCUIT CLOSED // 125V ACTIVE ]';

        document.getElementById('yieldStatus407').className = 'val-amber';
        document.getElementById('yieldStatus407').innerHTML = '<strong>Streaming RWA Yield ($NVDA • $HOOD • T-Bills)</strong>';

        energizeBtn407.className = 'btn btn-accent btn-full claim-btn';
        energizeBtn407.textContent = 'CLAIM $0.00 DIVIDENDS ✓';
        is407Energized = true;

        alert('⚡ BREAKER #0407 ENERGIZED! 1.0 $FUSE burned. Device is now permanently streaming real-world stock yields.');
      }, 500);
    });
  }

  // Claim Breaker #1892 Dividends
  if (claimBtn1892) {
    claimBtn1892.addEventListener('click', () => {
      if (yield1892 <= 0) {
        alert('No pending dividends to claim right now. Yield streams continuously from DEX trades.');
        return;
      }
      playClickSound(1300);
      totalYieldAccrued -= yield1892;
      alert(`⚡ Claimed +$${yield1892.toFixed(2)} in stock dividends to your wallet!`);
      yield1892 = 0.0;
      document.getElementById('unclaimed1892').textContent = '+$0.00 (Streaming)';
      claimBtn1892.textContent = 'CLAIM $0.00 DIVIDENDS ✓';
      totalAccruedYieldEl.textContent = `$${totalYieldAccrued.toFixed(2)} USD`;
      claimAllYieldBtn.textContent = `Claim All Yield ($${totalYieldAccrued.toFixed(2)})`;
    });
  }

  // Claim All Desk Yield
  if (claimAllYieldBtn) {
    claimAllYieldBtn.addEventListener('click', () => {
      if (totalYieldAccrued <= 0) {
        alert('No pending dividends to claim across substations.');
        return;
      }
      playClickSound(1500);
      alert(`⚡ All Yield Claimed! Successfully streamed +$${totalYieldAccrued.toFixed(2)} USD in tokenized stocks to ${document.getElementById('deskWallet').textContent}.`);
      totalYieldAccrued = 0.0;
      yield1892 = 0.0;
      yield407 = 0.0;
      totalAccruedYieldEl.textContent = `$0.00 USD`;
      claimAllYieldBtn.textContent = `Claim All Yield ($0.00)`;
      document.getElementById('unclaimed1892').textContent = '+$0.00 (Streaming)';
      if (is407Energized) {
        energizeBtn407.textContent = 'CLAIM $0.00 DIVIDENDS ✓';
      }
    });
  }

  // Continuous Real-Time Yield Ticker Simulation (Every 4 seconds)
  setInterval(() => {
    let delta = 0.02;
    if (is407Energized) delta += 0.02;
    totalYieldAccrued += delta;
    totalAccruedYieldEl.textContent = `$${totalYieldAccrued.toFixed(2)} USD`;
    claimAllYieldBtn.textContent = `Claim All Yield ($${totalYieldAccrued.toFixed(2)})`;

    if (yield1892 > 0) {
      yield1892 += 0.02;
      document.getElementById('unclaimed1892').textContent = `+$${yield1892.toFixed(2)} ($NVDA • $HOOD • T-Bills)`;
      claimBtn1892.textContent = `CLAIM $${yield1892.toFixed(2)} DIVIDENDS ✓`;
    }

    if (is407Energized) {
      yield407 += 0.02;
      energizeBtn407.textContent = `CLAIM $${yield407.toFixed(2)} DIVIDENDS ✓`;
    }
  }, 4000);

});
