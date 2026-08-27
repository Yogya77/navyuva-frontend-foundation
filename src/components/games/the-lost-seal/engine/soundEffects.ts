/**
 * Native Web Audio API Sound Engine for NAVYUVA Heritage Platform.
 * 100% browser-native, zero external audio assets or dependencies required.
 * Generates procedural atmospheric soundscapes, footsteps, chimes, and stone mechanisms.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.isMuted ? 0 : 0.05;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Ambient ancient atmospheric rumble / cave resonance
   */
  public startAmbience() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || this.ambientOsc) return;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = this.isMuted ? 0 : 0.04;
      this.ambientGain.connect(this.ctx.destination);

      // Low atmospheric wind drone
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientOsc.type = "sine";
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
      this.ambientOsc.connect(this.ambientGain);
      this.ambientOsc.start();
    } catch {
      // Audio autoplay policy fallback
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

  /**
   * Footstep sound when walking on ancient stone / silt
   */
  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(80 + Math.random() * 20, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Safe catch
    }
  }

  /**
   * Archaeological Clue Discovery Chime (Ascending Pentatonic)
   */
  public playClueDiscovery() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.07 + 0.02);
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

  /**
   * Stone Mechanism Opening / Door Slide Sound
   */
  public playStoneDoorOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(45, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(35, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.95);
    } catch {
      // Safe catch
    }
  }

  /**
   * Final Victory Fanfare (Artifact Recovered)
   */
  public playVictoryFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const chords = [
        { freqs: [330, 440, 550], time: 0 },
        { freqs: [370, 493.88, 554.37], time: 0.2 },
        { freqs: [440, 554.37, 659.25, 880], time: 0.45 },
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + chord.time);

          gain.gain.setValueAtTime(0.1, this.ctx.currentTime + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + chord.time + 0.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + chord.time);
          osc.stop(this.ctx.currentTime + chord.time + 0.85);
        });
      });
    } catch {
      // Safe catch
    }
  }
}

export const soundEngine = new SoundEngine();
