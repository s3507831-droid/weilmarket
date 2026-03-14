import { useRef, useCallback } from 'react';

export function useSound() {
  const ctxRef = useRef(null);

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }

  const playHaunted = useCallback(() => {
    try {
      const ctx = getCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.5);
      master.connect(ctx.destination);
      [220, 275, 440, 330].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(freq * 0.7, ctx.currentTime + 3);
        g.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.1);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.5);
        osc.connect(g); g.connect(master);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + 3.5);
      });
    } catch {}
  }, []);

  const playWhoosh = useCallback(() => {
    try {
      const ctx = getCtx();
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.08);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
      g.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.45);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 800;
      osc.connect(f); f.connect(g);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }, []);

  const playVote = useCallback(() => {
    try {
      const ctx = getCtx();
      [330, 392, 523, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.05);
        g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + i * 0.05 + 0.08);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + 0.9);
      });
    } catch {}
  }, []);

  const playStake = useCallback(() => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.value = 600 + i * 200;
        osc.type = 'triangle';
        g.gain.setValueAtTime(0, t + i * 0.07);
        g.gain.linearRampToValueAtTime(0.09, t + i * 0.07 + 0.03);
        g.gain.linearRampToValueAtTime(0, t + i * 0.07 + 0.2);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + 0.25);
      }
    } catch {}
  }, []);

  const playDeploy = useCallback(() => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.value = 440 + i * 220;
        osc.type = 'square';
        g.gain.setValueAtTime(0, t + i * 0.3);
        g.gain.linearRampToValueAtTime(0.07, t + i * 0.3 + 0.05);
        g.gain.linearRampToValueAtTime(0, t + i * 0.3 + 0.2);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t + i * 0.3); osc.stop(t + i * 0.3 + 0.25);
      }
      const bufSize = ctx.sampleRate;
      const nb = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = nb.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
      const ns = ctx.createBufferSource();
      ns.buffer = nb;
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass'; filt.frequency.value = 120;
      const rg = ctx.createGain();
      rg.gain.setValueAtTime(0, t + 0.8);
      rg.gain.linearRampToValueAtTime(0.22, t + 1.1);
      rg.gain.linearRampToValueAtTime(0, t + 2.0);
      ns.connect(filt); filt.connect(rg); rg.connect(ctx.destination);
      ns.start(t + 0.8); ns.stop(t + 2.1);
    } catch {}
  }, []);

  return { playHaunted, playWhoosh, playVote, playStake, playDeploy };
}
