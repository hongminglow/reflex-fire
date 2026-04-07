// Web Audio API sound engine — no external files needed

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function resume() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
  return c;
}

export function playGunshot() {
  const c = resume();
  const t = c.currentTime;

  // Noise burst for the bang
  const bufferSize = c.sampleRate * 0.15;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);

  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, t);
  filter.frequency.exponentialRampToValueAtTime(100, t + 0.1);
  filter.Q.value = 0.5;

  const gain = c.createGain();
  gain.gain.setValueAtTime(1.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  noise.start(t);
  noise.stop(t + 0.15);

  // Low thump
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
  const g2 = c.createGain();
  g2.gain.setValueAtTime(0.8, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(g2);
  g2.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

export function playHit() {
  const c = resume();
  const t = c.currentTime;

  // Splat / impact
  const bufferSize = c.sampleRate * 0.12;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);

  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.7, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  noise.start(t);
  noise.stop(t + 0.12);

  // High ping
  const osc = c.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);
  const g2 = c.createGain();
  g2.gain.setValueAtTime(0.3, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(g2);
  g2.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

export function playMiss() {
  const c = resume();
  const t = c.currentTime;

  // Low ominous thud
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.5, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.3);
}

// Background ambient loop — dark drone with melody
let bgGain = null;
let bgNodes = [];

export function startBackground() {
  const c = resume();
  stopBackground();

  console.log('Creating background music nodes...');

  const masterGain = c.createGain();
  masterGain.gain.setValueAtTime(0, c.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.35, c.currentTime + 1); // Faster fade-in, louder
  masterGain.connect(c.destination);
  bgGain = masterGain;

  // Bass drone
  const bass = c.createOscillator();
  bass.type = 'sawtooth';
  bass.frequency.value = 55; // A1
  const bassGain = c.createGain();
  bassGain.gain.value = 0.3;
  bass.connect(bassGain);
  bassGain.connect(masterGain);
  bass.start();
  bgNodes.push(bass);

  // Mid drone with LFO
  const mid = c.createOscillator();
  mid.type = 'sine';
  mid.frequency.value = 110; // A2
  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.2;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 5;
  lfo.connect(lfoGain);
  lfoGain.connect(mid.frequency);
  const midGain = c.createGain();
  midGain.gain.value = 0.2;
  mid.connect(midGain);
  midGain.connect(masterGain);
  mid.start();
  lfo.start();
  bgNodes.push(mid, lfo);

  // Pulsing pad
  const pad = c.createOscillator();
  pad.type = 'triangle';
  pad.frequency.value = 220; // A3
  const padLfo = c.createOscillator();
  padLfo.type = 'sine';
  padLfo.frequency.value = 0.5;
  const padLfoGain = c.createGain();
  padLfoGain.gain.value = 0.15;
  padLfo.connect(padLfoGain);
  const padGain = c.createGain();
  padGain.gain.value = 0.15;
  padLfoGain.connect(padGain.gain);
  pad.connect(padGain);
  padGain.connect(masterGain);
  pad.start();
  padLfo.start();
  bgNodes.push(pad, padLfo);

  // High shimmer
  const shimmer = c.createOscillator();
  shimmer.type = 'sine';
  shimmer.frequency.value = 880; // A5
  const shimmerLfo = c.createOscillator();
  shimmerLfo.type = 'sine';
  shimmerLfo.frequency.value = 0.3;
  const shimmerLfoGain = c.createGain();
  shimmerLfoGain.gain.value = 10;
  shimmerLfo.connect(shimmerLfoGain);
  shimmerLfoGain.connect(shimmer.frequency);
  const shimmerGain = c.createGain();
  shimmerGain.gain.value = 0.1;
  shimmer.connect(shimmerGain);
  shimmerGain.connect(masterGain);
  shimmer.start();
  shimmerLfo.start();
  bgNodes.push(shimmer, shimmerLfo);

  console.log('Background music nodes created and started - should be audible now');
}

export function stopBackground() {
  bgNodes.forEach(n => { try { n.stop(); } catch {} });
  bgNodes = [];
  if (bgGain) {
    try { bgGain.disconnect(); } catch {}
    bgGain = null;
  }
}