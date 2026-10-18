// DUO OS — Web Audio API Ambient Sound Synthesizer
// Generates rain, binaural focus beats, white noise, and lo-fi cafe ambience natively

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentSound: string | null = null;
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying = false;
  private currentVolume = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public getActiveSound(): string | null {
    return this.isPlaying ? this.currentSound : null;
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        if (typeof node === 'number') {
          clearInterval(node);
        } else if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        } else if ('disconnect' in node && typeof (node as any).disconnect === 'function') {
          (node as any).disconnect();
        }
      } catch (e) {
        // ignore node teardown errors
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentSound = null;
  }

  public play(soundType: 'rain' | 'binaural' | 'white_noise' | 'cafe') {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    this.isPlaying = true;
    this.currentSound = soundType;

    switch (soundType) {
      case 'rain':
        this.synthesizeRain();
        break;
      case 'binaural':
        this.synthesizeBinauralBeats();
        break;
      case 'white_noise':
        this.synthesizeWhiteNoise();
        break;
      case 'cafe':
        this.synthesizeCafeAmbience();
        break;
    }
  }

  private synthesizeWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to soften the harsh frequencies
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
  }

  private synthesizeRain() {
    if (!this.ctx || !this.gainNode) return;
    // Pink noise base + soft random raindrop impulses
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const pinkNoise = this.ctx.createBufferSource();
    pinkNoise.buffer = noiseBuffer;
    pinkNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    pinkNoise.connect(filter);
    filter.connect(this.gainNode);
    pinkNoise.start();

    this.activeNodes.push(pinkNoise, filter);
  }

  private synthesizeBinauralBeats() {
    if (!this.ctx || !this.gainNode) return;
    // 210 Hz in left ear, 216 Hz in right ear = 6Hz Theta frequency (deep relaxation & learning focus)
    const baseFreq = 210;
    const beatFreq = 6;

    // Left channel
    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    oscLeft.connect(merger, 0, 0);

    // Right channel
    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);
    oscRight.connect(merger, 0, 1);

    merger.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.push(oscLeft, oscRight, merger);
  }

  private synthesizeCafeAmbience() {
    if (!this.ctx || !this.gainNode) return;
    // Warm low-frequency drone with gentle modulation
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(165, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.gainNode);

    osc1.start();
    osc2.start();

    this.activeNodes.push(osc1, osc2, filter);
  }
}

export const ambientSound = new AmbientSoundEngine();
