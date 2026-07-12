const openButton = document.getElementById('openInvite');
const gate = document.getElementById('gate');
const melody = document.getElementById('wedding-melody');
const musicToggle = document.getElementById('musicToggle');
const invitation = document.getElementById('invitation');

let synthContext;
let synthTimer;
let usingSynth = false;
let musicStarted = false;
let musicPaused = false;

openButton.addEventListener('click', async () => {
  openButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('invite-open');
  invitation.setAttribute('aria-hidden', 'false');
  gate.classList.add('open');
  window.setTimeout(() => {
    gate.hidden = true;
  }, 1700);
  await startMusic();
});

musicToggle.addEventListener('click', async () => {
  if (!musicStarted) {
    await startMusic();
    return;
  }

  if (musicPaused) {
    await resumeMusic();
  } else {
    pauseMusic();
  }
});

async function startMusic() {
  musicToggle.hidden = false;
  musicToggle.classList.remove('is-paused');
  musicToggle.setAttribute('aria-label', 'Pause music');
  musicPaused = false;

  try {
    melody.volume = 0.42;
    await melody.play();
    usingSynth = false;
    musicStarted = true;
  } catch (error) {
    startSynthMelody();
  }
}

async function resumeMusic() {
  musicPaused = false;
  musicToggle.classList.remove('is-paused');
  musicToggle.setAttribute('aria-label', 'Pause music');

  if (usingSynth && synthContext) {
    await synthContext.resume();
    return;
  }

  try {
    await melody.play();
  } catch (error) {
    startSynthMelody();
  }
}

function pauseMusic() {
  musicPaused = true;
  musicToggle.classList.add('is-paused');
  musicToggle.setAttribute('aria-label', 'Play music');

  if (usingSynth && synthContext) {
    synthContext.suspend();
    return;
  }

  melody.pause();
}

function startSynthMelody() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  if (!synthContext) {
    synthContext = new AudioContext();
  }

  usingSynth = true;
  musicStarted = true;
  scheduleSynthLoop();
}

function scheduleSynthLoop() {
  if (!synthContext || musicPaused) return;

  const now = synthContext.currentTime + 0.05;
  const notes = [392, 493.88, 587.33, 659.25, 587.33, 493.88, 440, 392, 440, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 440];
  const step = 0.38;

  notes.forEach((frequency, index) => {
    playBellTone(frequency, now + index * step, 0.34, 0.13);
    if (index % 2 === 0) {
      playBellTone(frequency / 2, now + index * step, 0.58, 0.06);
    }
  });

  clearTimeout(synthTimer);
  synthTimer = window.setTimeout(scheduleSynthLoop, notes.length * step * 1000);
}

function playBellTone(frequency, start, duration, volume) {
  const oscillator = synthContext.createOscillator();
  const gain = synthContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.006, start + duration);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(synthContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);
}
// Wedding Date
const weddingDate = new Date("August 23, 2026 11:25:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerHTML =
      "<h3>🎉 The Wedding Has Begun!</h3>";
    clearInterval(countdownTimer);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
const countdownTimer = setInterval(updateCountdown, 1000);