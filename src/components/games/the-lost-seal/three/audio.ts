/**
 * Web Audio Procedural Sound Engine for Stylized 3D Adventure.
 */
class AdventureSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private footstepTimer = 0;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.isMuted ? 0 : 0.04;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbience(levelType: "daylight" | "underground" = "daylight") {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || this.ambientOsc) return;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = this.isMuted ? 0 : 0.035;
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc = this.ctx.createOscillator();
      this.ambientOsc.type = "sine";
      this.ambientOsc.frequency.setValueAtTime(
        levelType === "daylight" ? 65 : 45,
        this.ctx.currentTime,
      );
      this.ambientOsc.connect(this.ambientGain);
      this.ambientOsc.start();
    } catch {
      // Audio autoplay policy
    }
  }

  public stopAmbience() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {
        // Safe catch
      }
      this.ambientOsc = null;
    }
  }

  public updateFootsteps(dt: number, isMoving: boolean, isRunning: boolean, isGrounded: boolean) {
    if (!isMoving || !isGrounded || this.isMuted) return;

    this.footstepTimer += dt;
    const interval = isRunning ? 0.26 : 0.38;

    if (this.footstepTimer >= interval) {
      this.footstepTimer = 0;
      this.playFootstep(isRunning);
    }
  }

  private playFootstep(isRunning: boolean) {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      const startFreq = isRunning ? 95 + Math.random() * 20 : 75 + Math.random() * 15;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.07);

      const vol = isRunning ? 0.08 : 0.05;
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Safe catch
    }
  }

  public playJump() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Safe catch
    }
  }

  public playDiscovery() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.45);
      });
    } catch {
      // Safe catch
    }
  }

  public playGateOpen() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(50, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(32, this.ctx.currentTime + 1.0);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.15);
    } catch {
      // Safe catch
    }
  }

  public playVictory() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const chords = [
        { freqs: [392, 493.88, 587.33], time: 0 },
        { freqs: [440, 554.37, 659.25], time: 0.22 },
        { freqs: [523.25, 659.25, 783.99, 1046.5], time: 0.48 },
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + chord.time);

          gain.gain.setValueAtTime(0.1, this.ctx.currentTime + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + chord.time + 0.9);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + chord.time);
          osc.stop(this.ctx.currentTime + chord.time + 0.95);
        });
      });
    } catch {
      // Safe catch
    }
  }

  public playCinematicTone() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const freqs = [110, 164.81, 220, 329.63]; // A2, E3, A3, E4 warm ambient fifth chord
      freqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const targetVol = i === 0 ? 0.05 : 0.035;
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 4.0);
      });
    } catch {
      // Safe catch
    }
  }

  public playStoryReveal() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.65);
      });
    } catch {
      // Safe catch
    }
  }
}

export const adventureAudio = new AdventureSoundEngine();

