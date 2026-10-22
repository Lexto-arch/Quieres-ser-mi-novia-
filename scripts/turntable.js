/**
 * Lógica del Tocadiscos Interactivo
 * - Canción Principal: "Si Pudiera" - Manuel Medrano
 * - Canción Tranquila Alternativa: "Melodía de Paz y Calma" (Sintetizador celestial por defecto)
 * - Control de aguja mecánica (tonearm) y disco de vinilo giratorio
 * - Efecto de sonido cálido analógico de vinilo (crackle)
 * - Visualizador de ecualizador y notas flotantes
 * - Optimizado para móviles y computadoras
 */

class RomanticTurntable {
  constructor() {
    this.isPlaying = false;
    this.currentTrackKey = 'si_pudiera'; // 'si_pudiera' o 'tranquila'
    this.speed = 1.0;
    this.volume = 0.8;
    this.crackleEnabled = true;

    // Catálogo de pistas integradas
    this.tracks = {
      si_pudiera: {
        title: "Si Pudiera",
        artist: "Manuel Medrano • Su Canción Favorita",
        sources: [
          'assets/si_pudiera.mp3',
          'assets/Manuel Medrano - Si Pudiera (Vídeo Oficial) - Manuel Medrano.mp3'
        ],
        synthTheme: 'si_pudiera'
      },
      tranquila: {
        title: "Melodía de Paz y Calma",
        artist: "Sinfonía Celestial Romántica",
        sources: ['assets/melodia_tranquila.mp3'],
        synthTheme: 'tranquila'
      }
    };

    // Elementos del DOM
    this.vinylDisk = document.getElementById('vinylDisk');
    this.tonearm = document.getElementById('turntableTonearm');
    this.playBtn = document.getElementById('turntablePlayBtn');
    this.speed33Btn = document.getElementById('speed33Btn');
    this.speed45Btn = document.getElementById('speed45Btn');
    this.volumeSlider = document.getElementById('turntableVolume');
    this.crackleBtn = document.getElementById('toggleCrackleBtn');
    this.trackTitle = document.getElementById('turntableTrackTitle');
    this.trackArtist = document.getElementById('turntableTrackArtist');
    this.audioProgress = document.getElementById('audioProgress');
    this.timeCurrent = document.getElementById('timeCurrent');
    this.timeTotal = document.getElementById('timeTotal');
    this.equalizerBars = document.querySelectorAll('.eq-bar');
    this.musicNotesContainer = document.getElementById('floatingNotesContainer');

    // Botones de selección de canción
    this.btnTrackMedrano = document.getElementById('trackBtnMedrano');
    this.btnTrackTranquila = document.getElementById('trackBtnTranquila');

    // Elemento Audio nativo
    this.customAudio = new Audio();
    this.customAudio.preload = 'auto';

    // Web Audio API para sintetizador romántico y crackle
    this.audioCtx = null;
    this.synthInterval = null;
    this.crackleNode = null;
    this.synthGain = null;

    this.initEventListeners();
    this.setTrack('si_pudiera', false);
  }

  initEventListeners() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.vinylDisk) {
      this.vinylDisk.addEventListener('click', () => this.togglePlay());
    }

    if (this.tonearm) {
      this.tonearm.addEventListener('click', () => this.togglePlay());
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.volume = parseFloat(e.target.value);
        this.customAudio.volume = this.volume;
        if (this.synthGain && this.audioCtx) {
          this.synthGain.gain.setValueAtTime(this.volume * 0.15, this.audioCtx.currentTime);
        }
      });
    }

    if (this.speed33Btn && this.speed45Btn) {
      this.speed33Btn.addEventListener('click', () => this.setSpeed(1.0, this.speed33Btn));
      this.speed45Btn.addEventListener('click', () => this.setSpeed(1.35, this.speed45Btn));
    }

    if (this.crackleBtn) {
      this.crackleBtn.addEventListener('click', () => {
        this.crackleEnabled = !this.crackleEnabled;
        this.crackleBtn.classList.toggle('active', this.crackleEnabled);
        if (this.isPlaying) {
          if (this.crackleEnabled) this.startCrackleSound();
          else this.stopCrackleSound();
        }
      });
    }

    // Botones para alternar entre "Si Pudiera" y "Melodía Tranquila"
    if (this.btnTrackMedrano) {
      this.btnTrackMedrano.addEventListener('click', () => {
        this.setTrack('si_pudiera', this.isPlaying);
      });
    }

    if (this.btnTrackTranquila) {
      this.btnTrackTranquila.addEventListener('click', () => {
        this.setTrack('tranquila', this.isPlaying);
      });
    }

    // Progreso del audio
    this.customAudio.addEventListener('timeupdate', () => {
      if (this.customAudio.duration) {
        const percent = (this.customAudio.currentTime / this.customAudio.duration) * 100;
        if (this.audioProgress) this.audioProgress.value = percent;
        if (this.timeCurrent) this.timeCurrent.textContent = this.formatTime(this.customAudio.currentTime);
        if (this.timeTotal) this.timeTotal.textContent = this.formatTime(this.customAudio.duration);
      }
    });

    this.customAudio.addEventListener('loadedmetadata', () => {
      if (this.timeTotal && this.customAudio.duration) {
        this.timeTotal.textContent = this.formatTime(this.customAudio.duration);
      }
    });

    this.customAudio.addEventListener('ended', () => {
      this.customAudio.currentTime = 0;
      this.pause();
    });

    if (this.audioProgress) {
      this.audioProgress.addEventListener('input', (e) => {
        if (this.customAudio.duration && this.customAudio.src) {
          const seekTime = (e.target.value / 100) * this.customAudio.duration;
          this.customAudio.currentTime = seekTime;
        }
      });
    }
  }

  setTrack(trackKey, autoPlay = false) {
    this.currentTrackKey = trackKey;
    const track = this.tracks[trackKey];
    if (!track) return;

    if (this.trackTitle) this.trackTitle.textContent = track.title;
    if (this.trackArtist) this.trackArtist.textContent = track.artist;

    // Actualizar estados visuales de los botones
    if (this.btnTrackMedrano) {
      this.btnTrackMedrano.classList.toggle('active', trackKey === 'si_pudiera');
    }
    if (this.btnTrackTranquila) {
      this.btnTrackTranquila.classList.toggle('active', trackKey === 'tranquila');
    }

    // Para "Si Pudiera", enlazar directamente el archivo local
    if (trackKey === 'si_pudiera') {
      this.audioSourceType = 'custom';
      this.customAudio.src = 'assets/si_pudiera.mp3';
      this.customAudio.volume = this.volume;
      this.customAudio.load();
      if (autoPlay) {
        this.play();
      }
      return;
    }

    // Para otras pistas, buscar archivo o usar sintetizador
    this.audioSourceType = 'synth';
    this.checkAudioFileAvailable(track.sources, (foundUrl) => {
      if (foundUrl) {
        this.audioSourceType = 'custom';
        this.customAudio.src = foundUrl;
        this.customAudio.volume = this.volume;
        this.customAudio.load();
      } else {
        this.audioSourceType = 'synth';
        this.customAudio.removeAttribute('src');
      }

      if (autoPlay) {
        this.play();
      }
    });
  }

  checkAudioFileAvailable(sources, callback) {
    if (!sources || sources.length === 0) {
      callback(null);
      return;
    }

    let checked = 0;
    let found = false;

    sources.forEach(src => {
      const probeAudio = new Audio();
      const onFound = () => {
        if (!found) {
          found = true;
          cleanup();
          callback(src);
        }
      };
      const onNotFound = () => {
        checked++;
        cleanup();
        if (checked === sources.length && !found) callback(null);
      };
      const cleanup = () => {
        probeAudio.removeEventListener('loadedmetadata', onFound);
        probeAudio.removeEventListener('canplay', onFound);
        probeAudio.removeEventListener('error', onNotFound);
      };

      probeAudio.addEventListener('loadedmetadata', onFound);
      probeAudio.addEventListener('canplay', onFound);
      probeAudio.addEventListener('error', onNotFound);
      probeAudio.src = src;

      // Timeout de respaldo
      setTimeout(() => {
        if (!found && checked < sources.length) {
          if (probeAudio.readyState >= 1) onFound();
          else onNotFound();
        }
      }, 1000);
    });
  }

  setSpeed(speedVal, activeBtn) {
    this.speed = speedVal;
    if (this.speed33Btn) this.speed33Btn.classList.remove('active');
    if (this.speed45Btn) this.speed45Btn.classList.remove('active');
    if (activeBtn) activeBtn.classList.add('active');

    if (this.vinylDisk) {
      this.vinylDisk.style.animationDuration = `${1.8 / this.speed}s`;
    }
    if (this.customAudio) {
      this.customAudio.playbackRate = this.speed;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;

    // Actualizar estados visuales del tocadiscos
    if (this.vinylDisk) this.vinylDisk.classList.add('spinning');
    if (this.tonearm) this.tonearm.classList.add('playing');
    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        <span>Pausar</span>
      `;
      this.playBtn.classList.add('playing');
    }

    // Inicializar Audio Context
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Efecto de sonido de vinilo suave
    if (this.crackleEnabled) {
      this.startCrackleSound();
    }

    // Reproducir pista
    if (this.audioSourceType === 'custom' && this.customAudio.src) {
      this.customAudio.play().catch(e => {
        console.warn("Audio nativo pendiente, activando sintetizador romántico:", e);
        this.startSynthMelody();
      });
    } else {
      this.startSynthMelody();
    }

    this.startVisualizer();
    this.startFloatingNotes();
  }

  pause() {
    this.isPlaying = false;

    if (this.vinylDisk) this.vinylDisk.classList.remove('spinning');
    if (this.tonearm) this.tonearm.classList.remove('playing');
    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Reproducir</span>
      `;
      this.playBtn.classList.remove('playing');
    }

    if (this.customAudio) {
      this.customAudio.pause();
    }

    this.stopSynthMelody();
    this.stopCrackleSound();
    this.stopVisualizer();
    this.stopFloatingNotes();
  }

  // Sintetizador según la pista elegida
  startSynthMelody() {
    if (this.synthInterval) return;

    if (!this.synthGain) {
      this.synthGain = this.audioCtx.createGain();
      this.synthGain.gain.setValueAtTime(this.volume * 0.16, this.audioCtx.currentTime);
      this.synthGain.connect(this.audioCtx.destination);
    }

    if (this.currentTrackKey === 'si_pudiera') {
      // Progresión acústica íntima inspirada en "Si Pudiera" de Manuel Medrano
      // Notas cálidas de guitarra romántica / Rhodes: Bm (B3, D4, F#4), G (G3, B3, D4), D (D4, F#4, A4), A (A3, C#4, E4)
      const medranoMelody = [
        // Bm
        { freq: 246.94, dur: 0.6, type: 'triangle' }, // B3
        { freq: 293.66, dur: 0.4, type: 'sine' },     // D4
        { freq: 369.99, dur: 0.5, type: 'sine' },     // F#4
        { freq: 493.88, dur: 0.8, type: 'triangle' }, // B4
        // G
        { freq: 196.00, dur: 0.6, type: 'triangle' }, // G3
        { freq: 246.94, dur: 0.4, type: 'sine' },     // B3
        { freq: 293.66, dur: 0.5, type: 'sine' },     // D4
        { freq: 392.00, dur: 0.8, type: 'triangle' }, // G4
        // D
        { freq: 293.66, dur: 0.6, type: 'triangle' }, // D4
        { freq: 369.99, dur: 0.4, type: 'sine' },     // F#4
        { freq: 440.00, dur: 0.5, type: 'sine' },     // A4
        { freq: 587.33, dur: 0.8, type: 'triangle' }, // D5
        // A
        { freq: 220.00, dur: 0.6, type: 'triangle' }, // A3
        { freq: 277.18, dur: 0.4, type: 'sine' },     // C#4
        { freq: 329.63, dur: 0.5, type: 'sine' },     // E4
        { freq: 440.00, dur: 0.8, type: 'triangle' }  // A4
      ];

      let idx = 0;
      this.playNote(medranoMelody[0].freq, medranoMelody[0].type);

      this.synthInterval = setInterval(() => {
        idx = (idx + 1) % medranoMelody.length;
        const note = medranoMelody[idx];
        this.playNote(note.freq, note.type);
      }, 550 / this.speed);

    } else {
      // Pista tranquila por defecto: Sinfonía de Paz y Calma
      const calmNotes = [
        261.63, 329.63, 392.00, 493.88, 523.25, // Cmaj9
        220.00, 261.63, 329.63, 392.00, 440.00, // Am9
        174.61, 220.00, 261.63, 329.63, 349.23, // Fmaj7
        196.00, 246.94, 293.66, 392.00, 493.88  // G6
      ];

      let idx = 0;
      this.playNote(calmNotes[0], 'sine', 0.12);

      this.synthInterval = setInterval(() => {
        idx = (idx + 1) % calmNotes.length;
        this.playNote(calmNotes[idx], 'sine', 0.12);
        if (idx % 4 === 0) {
          setTimeout(() => {
            this.playNote(calmNotes[(idx + 2) % calmNotes.length] * 1.5, 'sine', 0.04);
          }, 250);
        }
      }, 700 / this.speed);
    }
  }

  playNote(freq, type = 'sine', gainMult = 0.15) {
    if (!this.audioCtx || !this.isPlaying) return;

    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(this.volume * gainMult, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(noteGain);
    noteGain.connect(this.synthGain);

    osc.start(now);
    osc.stop(now + 1.9);
  }

  stopSynthMelody() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // Sonido vintage analógico de vinilo
  startCrackleSound() {
    if (this.crackleNode || !this.audioCtx) return;

    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const isPop = Math.random() < 0.0012;
      data[i] = isPop ? (Math.random() * 2 - 1) * 0.14 : (Math.random() * 2 - 1) * 0.006;
    }

    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;

    const gain = this.audioCtx.createGain();
    gain.gain.value = this.volume * 0.05;

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    noiseSource.start();
    this.crackleNode = { source: noiseSource, gain: gain };
  }

  stopCrackleSound() {
    if (this.crackleNode) {
      try {
        this.crackleNode.source.stop();
      } catch (e) {}
      this.crackleNode = null;
    }
  }

  startVisualizer() {
    if (this.visInterval) return;
    this.visInterval = setInterval(() => {
      this.equalizerBars.forEach((bar) => {
        if (!this.isPlaying) {
          bar.style.height = '4px';
          return;
        }
        const randomHeight = Math.floor(Math.random() * 30) + 8;
        bar.style.height = `${randomHeight}px`;
      });
    }, 110);
  }

  stopVisualizer() {
    if (this.visInterval) {
      clearInterval(this.visInterval);
      this.visInterval = null;
    }
    this.equalizerBars.forEach(bar => {
      bar.style.height = '4px';
    });
  }

  startFloatingNotes() {
    if (this.notesInterval || !this.musicNotesContainer) return;
    const symbols = ['♪', '♫', '𝄢', '✦', '🤍', '💖', '✨', '🌸'];

    this.notesInterval = setInterval(() => {
      if (!this.isPlaying) return;

      const note = document.createElement('div');
      note.className = 'floating-note';
      note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      note.style.left = `${Math.random() * 80 + 10}%`;
      note.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
      note.style.fontSize = `${Math.random() * 10 + 16}px`;

      this.musicNotesContainer.appendChild(note);

      setTimeout(() => {
        note.remove();
      }, 4000);
    }, 550);
  }

  stopFloatingNotes() {
    if (this.notesInterval) {
      clearInterval(this.notesInterval);
      this.notesInterval = null;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

// Inicializar globalmente cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.romanticTurntable = new RomanticTurntable();
});
