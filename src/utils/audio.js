// Web Audio API Procedural Sound Engine
// Zero external audio files required — 100% reliable and instantaneous.

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Cinematic sub-bass ambient drone
 */
export const playAmbientDrone = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return null;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, ctx.currentTime);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    return {
      stop: () => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          setTimeout(() => osc.stop(), 800);
        } catch (e) {}
      }
    };
  } catch (e) {
    return null;
  }
};

/**
 * Cinematic Fly-Through Warp Whoosh sound
 */
export const playEnterWarpSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Sub-bass sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";

    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.4);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    // Noise buffer for air rush
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.4);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.2);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.02, ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start();
    noise.start();
    osc.stop(ctx.currentTime + 1.3);
    noise.stop(ctx.currentTime + 1.3);
  } catch (e) {
    console.warn("Audio playback error:", e);
  }
};
