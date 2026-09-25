// Web Audio API Synthesizer & Child Voice (Voz de Niño/Infantil) Speech Engine

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private availableVoices: SpeechSynthesisVoice[] = [];

  // Child voice acoustic parameters (High, bright, cheerful & playful)
  public pitch: number = 1.52; // Higher pitch for a genuine child's voice
  public rate: number = 1.02;  // Energetic, friendly pace of a kid

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populate = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        this.availableVoices = voices;
      }
    };

    populate();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populate;
    }
  }

  public getBestChildSpanishVoice(): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }

    if (this.availableVoices.length === 0) return null;

    // Filter Spanish voices
    const spanish = this.availableVoices.filter(v =>
      v.lang.toLowerCase().startsWith('es') ||
      v.lang.toLowerCase().includes('spanish')
    );

    // List of adult male/deep names to avoid
    const deepMalePatterns = /jorge|diego|carlos|enrique|manuel|pablo|raul|raúl|rodrigo|gonzalo|mario|david|juan|luis|andres|andrés|pedro|tomas|tomás|alonso|jose|josé|arnau|dario|darío|emilio|alberto|hector|héctor|sergio|paco|adult|deep/i;

    // Child-friendly / young / bright Spanish voice names
    const childPreferredNames = [
      'kid',
      'child',
      'junior',
      'niño',
      'niña',
      'infantil',
      'mateo',
      'lucas',
      'mia',
      'mía',
      'lucia',
      'lucía',
      'paulina',
      'monica',
      'mónica',
      'sabina',
      'sofia',
      'sofía',
      'francisca',
      'alba',
      'laura',
      'elena',
      'google español',
      'google spanish'
    ];

    // 1. Try to find an explicit kid or natural young voice
    for (const name of childPreferredNames) {
      const match = spanish.find(v => v.name.toLowerCase().includes(name) && !deepMalePatterns.test(v.name));
      if (match) return match;
    }

    // 2. Try to find any Spanish voice that is not a deep adult male
    const nonDeepSpanish = spanish.filter(v => !deepMalePatterns.test(v.name));
    if (nonDeepSpanish.length > 0) {
      return nonDeepSpanish[0];
    }

    // 3. Fallback to any available Spanish voice
    if (spanish.length > 0) {
      return spanish[0];
    }

    return null;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playPop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore audio errors
    }
  }

  public playStarDing() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {
      // Ignore audio errors
    }
  }

  public playCorrect() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = this.ctx!.currentTime + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // Ignore audio errors
    }
  }

  public playIncorrect() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(170, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore audio errors
    }
  }

  public playTrophyFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const chords = [
        { freqs: [523.25, 659.25], time: 0, dur: 0.15 },
        { freqs: [523.25, 659.25], time: 0.18, dur: 0.15 },
        { freqs: [523.25, 659.25], time: 0.36, dur: 0.15 },
        { freqs: [659.25, 783.99], time: 0.54, dur: 0.4 },
        { freqs: [587.33, 698.46], time: 0.98, dur: 0.2 },
        { freqs: [659.25, 783.99], time: 1.20, dur: 0.2 },
        { freqs: [783.99, 1046.50], time: 1.45, dur: 0.8 },
      ];

      chords.forEach(chord => {
        chord.freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const start = this.ctx!.currentTime + chord.time;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.22, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + chord.dur);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(start);
          osc.stop(start + chord.dur);
        });
      });
    } catch {
      // Ignore audio errors
    }
  }

  public speak(text: string, customRate?: number, customPitch?: number) {
    if (!this.enabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';

      // Genuine child tone and energy
      utterance.rate = customRate !== undefined ? customRate : this.rate;
      utterance.pitch = customPitch !== undefined ? customPitch : this.pitch;

      const childVoice = this.getBestChildSpanishVoice();
      if (childVoice) {
        utterance.voice = childVoice;
        utterance.lang = childVoice.lang;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // speech fallback
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundEngine();
