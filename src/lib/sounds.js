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

// Background ambient loop — dark drone
let bgGain = null;
let bgNodes = [];

export function startBackground() {
  const c = resume();
  stopBackground();

  console.log('Creating background music nodes...');

  const masterGain = c.createGain();
  masterGain.gain.setValueAtTime(0, c.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.25, c.currentTime + 2); // Increased volume from 0.12 to 0.25
  masterGain.connect(c.destination);
  bgGain = masterGain;

  // Create layered drones
  const freqs = [55, 110, 82.4, 164.8];
  freqs.forEach((freq, i) => {
    const osc = c.createOscillator();
    osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
    osc.frequency.value = freq;

    // Slow LFO modulation
    const lfo = c.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1 + i * 0.05;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400 + i * 100;

    const g = c.createGain();
    g.gain.value = 0.4 / freqs.length; // Increased from 0.3

    osc.connect(filter);
    filter.connect(g);
    g.connect(masterGain);

    osc.start();
    lfo.start();
    bgNodes.push(osc, lfo);
  });

  console.log('Background music nodes created and started');
}

export function stopBackground() {
  bgNodes.forEach(n => { try { n.stop(); } catch {} });
  bgNodes = [];
  if (bgGain) {
    try { bgGain.disconnect(); } catch {}
    bgGain = null;
  }
}