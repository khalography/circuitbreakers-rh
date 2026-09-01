/**
 * CIRCUIT BREAKERS - Energize & Yield Substation DApp Engine
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
      document.getElementById('audioIcon').textContent = audioEnabled ? '🔊' : '🔇';
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

  // State
  let userFuseBalance = 3.0;
  let totalYieldAccrued = 42.80;
  let yield1892 = 24.85;
  let yield407 = 0.0;
  let is407Energized = false;
  let globalBurnedCount = 1420;

  const energizeBtn407 = document.getElementById('energizeBtn407');
  const fuseBalanceEl = document.getElementById('fuseBalance');
  const totalAccruedYieldEl = document.getElementById('totalAccruedYield');
  const claimBtn1892 = document.getElementById('claimBtn1892');
  const claimAllYieldBtn = document.getElementById('claimAllYieldBtn');
  const globalBurnedEl = document.getElementById('globalBurned');

  // Energize Breaker #0407 Action
  if (energizeBtn407) {
    energizeBtn407.addEventListener('click', () => {
      if (is407Energized) {
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
        playSound(1200);
        return;
      }

      if (userFuseBalance < 1.0) {
        alert('Insufficient $FUSE balance. You need 1.0 $FUSE to energize a breaker.');
        return;
      }

      // 1. Play High-Voltage Ignition Buzz & Snap
      playSound(1800, 'sawtooth', 0.2);
      setTimeout(() => playSound(300, 'square', 0.1), 100);

      // 2. Trigger Flash Ignition Animation
      const card407 = document.getElementById('breakerCard407');
      card407.classList.add('igniting');
      
      // 3. Update Balance & Global Stats
      userFuseBalance -= 1.0;
      globalBurnedCount += 1;
      fuseBalanceEl.textContent = `${userFuseBalance.toFixed(2)} $FUSE`;
      if (globalBurnedEl) {
        globalBurnedEl.textContent = `${globalBurnedCount.toLocaleString()} / 3,333`;
      }

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

        alert('⚡ BREAKER #0407 ENERGIZED! 1.0 $FUSE permanently burned. Device is now streaming real-world stock yields.');
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
      playSound(1300);
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
      playSound(1500);
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
