/**
 * El Universo Interactivo de las 1000 Estrellas del Amor
 * Renderizado en Canvas 2D/3D con soporte para miles de estrellas,
 * nebulosas en tonos esmeralda, violeta y rosa, constelaciones conectadas,
 * navegación orbital (arrastrar y zoom), y exploración de palabras de amor.
 */

class InteractiveLoveUniverse {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.bgStars = [];
    this.shootingStars = [];
    this.activeConstellation = 'all';

    // Estado de la cámara y vista
    this.cam = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      zoom: 1,
      targetZoom: 1,
      rotation: 0,
      targetRotation: 0
    };

    this.mouse = {
      x: 0,
      y: 0,
      rawX: 0,
      rawY: 0,
      isDown: false,
      lastX: 0,
      lastY: 0
    };

    this.hoveredStar = null;
    this.selectedStar = null;
    this.favorites = this.loadFavorites();

    this.initCanvasSize();
    this.generateCosmos();
    this.initEventListeners();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvasSize() {
    this.width = this.canvas.parentElement.clientWidth || window.innerWidth;
    this.height = this.canvas.parentElement.clientHeight || window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem('novia_estrellas_favs') || '[]');
    } catch (e) {
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem('novia_estrellas_favs', JSON.stringify(this.favorites));
    } catch (e) {}
  }

  toggleFavorite(starNum) {
    const idx = this.favorites.indexOf(starNum);
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(starNum);
    }
    this.saveFavorites();
    this.updateFavoritesUI();
    return this.favorites.includes(starNum);
  }

  generateCosmos() {
    // 1. Estrellas de fondo lejanas y polvo cósmico (1,500 partículas)
    this.bgStars = [];
    for (let i = 0; i < 1500; i++) {
      this.bgStars.push({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: ['#10b981', '#a855f7', '#f472b6', '#ffffff', '#6ee7b7', '#c084fc'][Math.floor(Math.random() * 6)]
      });
    }

    // 2. Las 1,000 Estrellas del Amor (cada una mapeada a un motivo)
    const reasons = window.ALL_REASONS || [];
    this.stars = [];

    // Distribuir en espiral galáctica romántica con corazón central
    const count = Math.min(1000, reasons.length);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const reason = reasons[i];
      // Distribución armónica en brazos de galaxia
      const distance = Math.pow(i / count, 0.6) * 1600 + 70;
      const angle = i * goldenAngle;
      
      // Añadir ligera turbulencia orgánica
      const jitterX = (Math.random() - 0.5) * 70;
      const jitterY = (Math.random() - 0.5) * 70;

      // Color según constelación (Verde Esmeralda y Morado)
      let baseColor = '#10b981'; // esmeralda principal
      if (reason.constellation === 'sonrisa') baseColor = '#34d399'; // menta brillante
      else if (reason.constellation === 'fe') baseColor = '#d1fae5'; // luz celestial esmeralda
      else if (reason.constellation === 'alma') baseColor = '#a855f7'; // morado real
      else if (reason.constellation === 'memorias') baseColor = '#059669'; // verde bosque profundo
      else if (reason.constellation === 'detalles') baseColor = '#8b5cf6'; // violeta
      else if (reason.constellation === 'futuro') baseColor = '#c084fc'; // lavanda morado
      else if (reason.constellation === 'destino') baseColor = '#6ee7b7'; // esmeralda luminoso

      this.stars.push({
        id: i + 1,
        x: Math.cos(angle) * distance + jitterX,
        y: Math.sin(angle) * distance + jitterY,
        baseSize: Math.random() * 2.5 + 2.2,
        color: baseColor,
        reason: reason,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02
      });
    }
  }

  initEventListeners() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
    });

    // Eventos de ratón
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.rawX = e.clientX;
      this.mouse.rawY = e.clientY;

      if (this.mouse.isDown) {
        const dx = e.clientX - this.mouse.lastX;
        const dy = e.clientY - this.mouse.lastY;
        this.cam.targetX -= dx / this.cam.zoom;
        this.cam.targetY -= dy / this.cam.zoom;
        this.mouse.lastX = e.clientX;
        this.mouse.lastY = e.clientY;
      }

      // Convertir a coordenadas del mundo del canvas
      const cx = this.width / 2;
      const cy = this.height / 2;
      this.mouse.x = (e.clientX - rect.left - cx) / this.cam.zoom + this.cam.x;
      this.mouse.y = (e.clientY - rect.top - cy) / this.cam.zoom + this.cam.y;

      this.checkStarHover();
    });

    // Zoom con rueda de ratón
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.cam.targetZoom = Math.min(Math.max(this.cam.targetZoom * zoomFactor, 0.35), 4.5);
    }, { passive: false });

    // Clic en estrella
    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredStar) {
        this.openStarModal(this.hoveredStar);
      }
    });

    // Soporte táctil optimizado para móviles (Android / iPhone)
    let touchDist = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.mouse.isDown = true;
        this.mouse.lastX = e.touches[0].clientX;
        this.mouse.lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault(); // Evita que la pantalla del celular se mueva al explorar las estrellas

      if (e.touches.length === 1 && this.mouse.isDown) {
        const dx = e.touches[0].clientX - this.mouse.lastX;
        const dy = e.touches[0].clientY - this.mouse.lastY;
        this.cam.targetX -= dx / this.cam.zoom;
        this.cam.targetY -= dy / this.cam.zoom;
        this.mouse.lastX = e.touches[0].clientX;
        this.mouse.lastY = e.touches[0].clientY;

        const rect = this.canvas.getBoundingClientRect();
        const cx = this.width / 2;
        const cy = this.height / 2;
        this.mouse.x = (e.touches[0].clientX - rect.left - cx) / this.cam.zoom + this.cam.x;
        this.mouse.y = (e.touches[0].clientY - rect.top - cy) / this.cam.zoom + this.cam.y;
        this.checkStarHover();
      } else if (e.touches.length === 2) {
        const newDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = newDist / (touchDist || newDist);
        this.cam.targetZoom = Math.min(Math.max(this.cam.targetZoom * (factor > 1 ? 1.04 : 0.96), 0.35), 4.5);
        touchDist = newDist;
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      this.mouse.isDown = false;
      if (this.hoveredStar) {
        this.openStarModal(this.hoveredStar);
      }
    });

    // Controles de interfaz (botones del universo)
    const randomStarBtn = document.getElementById('randomStarBtn');
    if (randomStarBtn) {
      randomStarBtn.addEventListener('click', () => this.flyToRandomStar());
    }

    const resetViewBtn = document.getElementById('resetUniverseBtn');
    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        this.cam.targetX = 0;
        this.cam.targetY = 0;
        this.cam.targetZoom = 1;
      });
    }

    // Filtros de constelación
    const filterPills = document.querySelectorAll('.constellation-filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeConstellation = pill.dataset.constellation || 'all';
      });
    });

    // Modal de estrella
    const modalCloseBtn = document.getElementById('closeStarModalBtn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => this.closeStarModal());
    }

    const starModalOverlay = document.getElementById('starDetailModal');
    if (starModalOverlay) {
      starModalOverlay.addEventListener('click', (e) => {
        if (e.target === starModalOverlay) this.closeStarModal();
      });
    }

    const favToggleBtn = document.getElementById('modalFavBtn');
    if (favToggleBtn) {
      favToggleBtn.addEventListener('click', () => {
        if (this.selectedStar) {
          const isFav = this.toggleFavorite(this.selectedStar.id);
          favToggleBtn.classList.toggle('active', isFav);
          favToggleBtn.querySelector('span').textContent = isFav ? 'En tus favoritas' : 'Guardar en favoritas';
        }
      });
    }

    const nextStarBtn = document.getElementById('modalNextStarBtn');
    if (nextStarBtn) {
      nextStarBtn.addEventListener('click', () => {
        if (this.selectedStar) {
          const nextId = (this.selectedStar.id % this.stars.length) + 1;
          const nextStar = this.stars.find(s => s.id === nextId);
          if (nextStar) {
            this.flyToStar(nextStar);
            this.openStarModal(nextStar);
          }
        }
      });
    }

    const prevStarBtn = document.getElementById('modalPrevStarBtn');
    if (prevStarBtn) {
      prevStarBtn.addEventListener('click', () => {
        if (this.selectedStar) {
          const prevId = this.selectedStar.id === 1 ? this.stars.length : this.selectedStar.id - 1;
          const prevStar = this.stars.find(s => s.id === prevId);
          if (prevStar) {
            this.flyToStar(prevStar);
            this.openStarModal(prevStar);
          }
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeStarModal();
    });
  }

  checkStarHover() {
    let closest = null;
    let minDist = 18 / this.cam.zoom; // radio de detección adaptativo

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      if (this.activeConstellation !== 'all' && star.reason.constellation !== this.activeConstellation) {
        continue;
      }
      const dx = this.mouse.x - star.x;
      const dy = this.mouse.y - star.y;
      const dist = Math.hypot(dx, dy);

      if (dist < minDist) {
        minDist = dist;
        closest = star;
      }
    }

    this.hoveredStar = closest;
    this.canvas.style.cursor = closest ? 'pointer' : (this.mouse.isDown ? 'grabbing' : 'grab');

    // Tooltip flotante
    this.updateHoverTooltip();
  }

  updateHoverTooltip() {
    let tooltip = document.getElementById('universeStarTooltip');
    if (!tooltip) return;

    if (this.hoveredStar) {
      const r = this.hoveredStar.reason;
      tooltip.innerHTML = `
        <div class="tooltip-badge">★ Motivo #${this.hoveredStar.id}</div>
        <div class="tooltip-word">${r.word || 'Amor Eterno'}</div>
        <div class="tooltip-constellation">${r.constellation ? r.constellation.toUpperCase() : 'UNIVERSO'}</div>
      `;
      tooltip.style.left = `${this.mouse.rawX + 16}px`;
      tooltip.style.top = `${this.mouse.rawY - 20}px`;
      tooltip.classList.add('visible');
    } else {
      tooltip.classList.remove('visible');
    }
  }

  flyToStar(star) {
    this.cam.targetX = star.x;
    this.cam.targetY = star.y;
    this.cam.targetZoom = 2.2;
  }

  flyToRandomStar() {
    const randomIndex = Math.floor(Math.random() * this.stars.length);
    const star = this.stars[randomIndex];
    this.flyToStar(star);
    setTimeout(() => {
      this.openStarModal(star);
    }, 450);
  }

  openStarModal(star) {
    this.selectedStar = star;
    const modal = document.getElementById('starDetailModal');
    if (!modal) return;

    const r = star.reason;
    document.getElementById('modalStarNumber').textContent = `Estrella #${star.id}`;
    document.getElementById('modalStarTitle').textContent = r.title || `Motivo #${star.id}`;
    document.getElementById('modalStarText').textContent = r.text;
    document.getElementById('modalStarWord').textContent = `Palabra de Amor: "${r.word || 'Te Amo'}"`;
    
    // Constelación
    const constObj = window.CONSTELLATIONS.find(c => c.id === r.constellation);
    document.getElementById('modalConstellationName').textContent = constObj ? `${constObj.icon} ${constObj.name}` : 'Constelación del Amor';

    // Favorito
    const isFav = this.favorites.includes(star.id);
    const favBtn = document.getElementById('modalFavBtn');
    if (favBtn) {
      favBtn.classList.toggle('active', isFav);
      favBtn.querySelector('span').textContent = isFav ? 'En tus favoritas' : 'Guardar en favoritas';
    }

    modal.classList.add('active');

    // Reproducir suave campanilla estelar con Web Audio
    this.playCosmicChime();
  }

  closeStarModal() {
    const modal = document.getElementById('starDetailModal');
    if (modal) modal.classList.remove('active');
    this.selectedStar = null;
  }

  playCosmicChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    } catch (e) {}
  }

  updateFavoritesUI() {
    const favCounter = document.getElementById('discoveredFavoritesCount');
    if (favCounter) {
      favCounter.textContent = this.favorites.length;
    }
  }

  // Bucle de animación 60 FPS
  animate(timestamp) {
    // Interpolación suave de la cámara (damping)
    this.cam.x += (this.cam.targetX - this.cam.x) * 0.08;
    this.cam.y += (this.cam.targetY - this.cam.y) * 0.08;
    this.cam.zoom += (this.cam.targetZoom - this.cam.zoom) * 0.08;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Fondo cósmico base con gradiente aurora
    this.drawNebulaBackground();

    // Guardar contexto para transformaciones de cámara
    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.scale(this.cam.zoom, this.cam.zoom);
    this.ctx.translate(-this.cam.x, -this.cam.y);

    // 1. Dibujar estrellas de fondo lejanas
    this.drawBackgroundStars(timestamp);

    // 2. Dibujar líneas de constelación si hay una seleccionada
    this.drawConstellationLines();

    // 3. Dibujar las 1,000 estrellas del amor interactivas
    this.drawLoveStars(timestamp);

    // 4. Dibujar estrellas fugaces
    this.drawShootingStars();

    this.ctx.restore();

    requestAnimationFrame(this.animate);
  }

  drawNebulaBackground() {
    // Fondo oscuro cósmico esmeralda
    this.ctx.fillStyle = '#02130d';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Resplandor de nebulosa verde esmeralda y morado profundo
    const grad1 = this.ctx.createRadialGradient(
      this.width * 0.3, this.height * 0.35, 50,
      this.width * 0.3, this.height * 0.35, this.width * 0.75
    );
    grad1.addColorStop(0, 'rgba(16, 185, 129, 0.25)'); // verde esmeralda
    grad1.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
    grad1.addColorStop(1, 'transparent');

    this.ctx.fillStyle = grad1;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const grad2 = this.ctx.createRadialGradient(
      this.width * 0.75, this.height * 0.65, 80,
      this.width * 0.75, this.height * 0.65, this.width * 0.8
    );
    grad2.addColorStop(0, 'rgba(139, 92, 246, 0.26)'); // morado púrpura
    grad2.addColorStop(0.5, 'rgba(124, 58, 237, 0.12)');
    grad2.addColorStop(1, 'transparent');

    this.ctx.fillStyle = grad2;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawBackgroundStars(timestamp) {
    const t = timestamp * 0.001;
    for (let i = 0; i < this.bgStars.length; i++) {
      const star = this.bgStars[i];
      const twinkle = Math.sin(t * 3 + star.twinkleSpeed * 100) * 0.3 + 0.7;
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = star.alpha * twinkle;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
  }

  drawConstellationLines() {
    if (this.activeConstellation === 'all') return;

    // Filtrar estrellas de la constelación activa
    const constellationStars = this.stars.filter(s => s.reason.constellation === this.activeConstellation);
    if (constellationStars.length < 2) return;

    this.ctx.save();
    this.ctx.lineWidth = 1.3;
    this.ctx.strokeStyle = 'rgba(52, 211, 153, 0.55)'; // esmeralda luminiscente
    this.ctx.beginPath();

    for (let i = 0; i < constellationStars.length - 1; i++) {
      const s1 = constellationStars[i];
      const s2 = constellationStars[i + 1];
      const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
      if (dist < 380) { // Conectar solo estrellas próximas
        this.ctx.moveTo(s1.x, s1.y);
        this.ctx.lineTo(s2.x, s2.y);
      }
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawLoveStars(timestamp) {
    const t = timestamp * 0.002;

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      const isFilteredOut = this.activeConstellation !== 'all' && star.reason.constellation !== this.activeConstellation;
      const isHovered = this.hoveredStar === star;
      const isFav = this.favorites.includes(star.id);

      // Pulsación estelar
      const pulse = Math.sin(t * star.pulseSpeed * 20 + star.pulseOffset) * 0.4 + 1;
      let size = star.baseSize * pulse;

      if (isHovered) size *= 2.0;
      if (isFav) size *= 1.4;

      this.ctx.save();

      // Opacidad reducida si no pertenece al filtro activo
      if (isFilteredOut) {
        this.ctx.globalAlpha = 0.12;
      } else {
        this.ctx.globalAlpha = isHovered ? 1.0 : 0.85;
      }

      // Halo de resplandor
      if (isHovered || isFav) {
        const glowGrad = this.ctx.createRadialGradient(star.x, star.y, 1, star.x, star.y, size * 4.5);
        glowGrad.addColorStop(0, star.color);
        glowGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.3)');
        glowGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glowGrad;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, size * 4.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Estrella central
      this.ctx.fillStyle = isFav ? '#fb7185' : (isHovered ? '#ffffff' : star.color);
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      this.ctx.fill();

      // Destello cruzado para estrellas favoritas o bajo cursor
      if (isHovered || isFav) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(star.x - size * 3, star.y);
        this.ctx.lineTo(star.x + size * 3, star.y);
        this.ctx.moveTo(star.x, star.y - size * 3);
        this.ctx.lineTo(star.x, star.y + size * 3);
        this.ctx.stroke();
      }

      // Etiqueta de texto de amor si estamos con zoom alto o hovered
      if ((isHovered || (this.cam.zoom > 2.6 && i % 4 === 0)) && !isFilteredOut) {
        this.ctx.font = '11px "Outfit", sans-serif';
        this.ctx.fillStyle = '#fdf4ff';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(star.reason.word || `#${star.id}`, star.x, star.y + size + 14);
      }

      this.ctx.restore();
    }
  }

  drawShootingStars() {
    // Generar ocasionalmente una estrella fugaz
    if (Math.random() < 0.012 && this.shootingStars.length < 3) {
      this.shootingStars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 12 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        life: 1.0,
        color: ['#10b981', '#f472b6', '#ffffff'][Math.floor(Math.random() * 3)]
      });
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.025;

      if (s.life <= 0) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.life;
      this.ctx.strokeStyle = s.color;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
}

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.loveUniverse = new InteractiveLoveUniverse('universeCanvas');
});
