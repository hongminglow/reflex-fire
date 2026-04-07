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

// Background music — upbeat and energetic
let bgGain = null;
let bgNodes = [];

export function startBackground() {
  const c = resume();
  stopBackground();

  console.log('Creating upbeat background music...');

  const masterGain = c.createGain();
  masterGain.gain.setValueAtTime(0, c.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.3, c.currentTime + 0.5);
  masterGain.connect(c.destination);
  bgGain = masterGain;

  // Upbeat melody notes (C major scale - happy sound)
  const melodyNotes = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5, D5, E5, F5, G5
  const melodyPattern = [0, 2, 4, 2, 1, 3, 4, 3]; // Pattern using scale degrees
  
  let noteIndex = 0;
  const playNote = () => {
    if (!bgGain) return;
    
    const osc = c.createOscillator();
    osc.type = 'square';
    osc.frequency.value = melodyNotes[melodyPattern[noteIndex % melodyPattern.length]];
    
    const noteGain = c.createGain();
    noteGain.gain.setValueAtTime(0.15, c.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    
    osc.connect(noteGain);
    noteGain.connect(masterGain);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.3);
    
    noteIndex++;
    if (bgGain) setTimeout(playNote, 250); // Play next note
  };
  playNote();

  // Bass line - bouncy rhythm
  const bassNotes = [130.81, 164.81, 196.00]; // C3, E3, G3
  let bassIndex = 0;
  const playBass = () => {
    if (!bgGain) return;
    
    const bass = c.createOscillator();
    bass.type = 'sine';
    bass.frequency.value = bassNotes[bassIndex % bassNotes.length];
    
    const bassGain = c.createGain();
    bassGain.gain.setValueAtTime(0.2, c.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
    
    bass.connect(bassGain);
    bassGain.connect(masterGain);
    bass.start(c.currentTime);
    bass.stop(c.currentTime + 0.4);
    
    bassIndex++;
    if (bgGain) setTimeout(playBass, 500); // Bass rhythm
  };
  playBass();

  // Bright pad for atmosphere
  const pad = c.createOscillator();
  pad.type = 'triangle';
  pad.frequency.value = 523.25; // C5
  const padLfo = c.createOscillator();
  padLfo.type = 'sine';
  padLfo.frequency.value = 0.5;
  const padLfoGain = c.createGain();
  padLfoGain.gain.value = 0.1;
  padLfo.connect(padLfoGain);
  const padGain = c.createGain();
  padGain.gain.value = 0.08;
  padLfoGain.connect(padGain.gain);
  pad.connect(padGain);
  padGain.connect(masterGain);
  pad.start();
  padLfo.start();
  bgNodes.push(pad, padLfo);

  console.log('Upbeat background music started!');
}

export function stopBackground() {
  bgNodes.forEach(n => { try { n.stop(); } catch {} });
  bgNodes = [];
  if (bgGain) {
    try { bgGain.disconnect(); } catch {}
    bgGain = null;
  }
}