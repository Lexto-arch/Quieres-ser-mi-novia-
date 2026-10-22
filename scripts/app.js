/**
 * Lógica principal de la aplicación:
 * - Explorador del Gran Libro de los 1000 Motivos (búsqueda, filtros y paginación rápida)
 * - Carta Secreta interactiva con animación 3D de sobre y lacre
 * - Personalización (Nombre de la novia y contador de días juntos)
 * - Rastro celestial de partículas en el cursor
 * - Navegación suave y modales de ayuda
 */

document.addEventListener('DOMContentLoaded', () => {
  initPersonalization();
  initReasonsBook();
  initLoveLetter();
  initProposalSection();
  initCosmicCursor();
  initQuickNavigation();
  initMusicHelperModal();
});

// 1. Personalización de Nombre y Días Juntos
function initPersonalization() {
  const nameEl = document.getElementById('girlfriendName');
  const editNameBtn = document.getElementById('editNameBtn');
  const daysCounterEl = document.getElementById('relationshipDaysCount');
  const setDateBtn = document.getElementById('setDateBtn');

  // Fixed name: Elizabeth
  if (nameEl) nameEl.textContent = 'Elizabeth';
  // Hide edit button (no personalization)
  if (editNameBtn) editNameBtn.style.display = 'none';
  // Ensure letter recipient reflects Elizabeth
  updateLetterRecipient('Elizabeth');

  // Contador de días: por defecto exactamente 25 días juntos
  let savedDate = localStorage.getItem('novia_fecha_inicio');
  if (!savedDate || savedDate === '2023-01-01') {
    const d = new Date();
    d.setDate(d.getDate() - 25);
    savedDate = d.toISOString().split('T')[0];
    localStorage.setItem('novia_fecha_inicio', savedDate);
  }
  calculateDays(savedDate);

  if (setDateBtn) {
    setDateBtn.addEventListener('click', () => {
      const newDate = prompt('Ingresa la fecha en que comenzó su historia de amor (Formato: AAAA-MM-DD):', savedDate);
      if (newDate && !isNaN(new Date(newDate).getTime())) {
        localStorage.setItem('novia_fecha_inicio', newDate);
        calculateDays(newDate);
      }
    });
  }

  function calculateDays(dateStr) {
    const start = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (daysCounterEl) {
      daysCounterEl.textContent = (diffDays || 25).toLocaleString();
    }
  }

  updateLetterRecipient('Elizabeth');
}

function updateLetterRecipient(name) {
  const letterTo = document.getElementById('letterRecipientName');
  if (letterTo) letterTo.textContent = name;
}

// 2. Gran Libro de los 1000 Motivos (Explorador en cuadrícula)
let currentReasonsPage = 1;
const REASONS_PER_PAGE = 30;
let currentFilteredReasons = [];
let activeBookFilter = 'all';
let searchQuery = '';

function initReasonsBook() {
  const gridContainer = document.getElementById('reasonsGrid');
  const searchInput = document.getElementById('reasonsSearchInput');
  const loadMoreBtn = document.getElementById('loadMoreReasonsBtn');
  const filterButtons = document.querySelectorAll('.book-filter-btn');
  const totalCountBadge = document.getElementById('totalMotivosCount');

  if (totalCountBadge) {
    totalCountBadge.textContent = '1,000';
  }

  currentFilteredReasons = window.ALL_REASONS || [];
  renderReasonsPage(true);

  // Búsqueda en vivo
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFiltersAndSearch();
    });
  }

  // Filtros de categoría
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBookFilter = btn.dataset.filter || 'all';
      applyFiltersAndSearch();
    });
  });

  // Botón cargar más
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentReasonsPage++;
      renderReasonsPage(false);
    });
  }
}

function applyFiltersAndSearch() {
  const all = window.ALL_REASONS || [];
  const favs = window.loveUniverse ? window.loveUniverse.favorites : [];

  currentFilteredReasons = all.filter(r => {
    // Filtro por categoría o favoritos
    let matchesCategory = true;
    if (activeBookFilter === 'favorites') {
      matchesCategory = favs.includes(r.num);
    } else if (activeBookFilter !== 'all') {
      matchesCategory = r.constellation === activeBookFilter;
    }

    // Filtro por texto de búsqueda
    let matchesSearch = true;
    if (searchQuery) {
      const matchNum = r.num.toString() === searchQuery;
      const matchText = r.text.toLowerCase().includes(searchQuery);
      const matchTitle = (r.title || '').toLowerCase().includes(searchQuery);
      const matchWord = (r.word || '').toLowerCase().includes(searchQuery);
      matchesSearch = matchNum || matchText || matchTitle || matchWord;
    }

    return matchesCategory && matchesSearch;
  });

  currentReasonsPage = 1;
  renderReasonsPage(true);
}

function renderReasonsPage(reset = false) {
  const gridContainer = document.getElementById('reasonsGrid');
  const loadMoreBtn = document.getElementById('loadMoreReasonsBtn');
  const emptyState = document.getElementById('reasonsEmptyState');
  if (!gridContainer) return;

  if (reset) {
    gridContainer.innerHTML = '';
  }

  const start = (currentReasonsPage - 1) * REASONS_PER_PAGE;
  const end = currentReasonsPage * REASONS_PER_PAGE;
  const pageItems = currentFilteredReasons.slice(start, end);

  if (currentFilteredReasons.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  const favs = window.loveUniverse ? window.loveUniverse.favorites : [];

  pageItems.forEach(item => {
    const isFav = favs.includes(item.num);
    const card = document.createElement('div');
    card.className = `reason-card constellation-${item.constellation}`;
    card.innerHTML = `
      <div class="reason-card-header">
        <span class="reason-num">#${item.num}</span>
        <button class="reason-fav-btn ${isFav ? 'active' : ''}" title="Marcar como favorita" data-num="${item.num}">
          <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      <div class="reason-word-badge">✦ ${item.word || 'Amor'}</div>
      <p class="reason-text">"${item.text}"</p>
      <div class="reason-card-footer">
        <span class="reason-category-tag">${getConstellationLabel(item.constellation)}</span>
        <button class="view-in-sky-btn" title="Viajar a esta estrella en el universo" data-num="${item.num}">
          Ver en el cosmos ↗
        </button>
      </div>
    `;

    // Evento de favorito
    const favBtn = card.querySelector('.reason-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.loveUniverse) {
        const newState = window.loveUniverse.toggleFavorite(item.num);
        favBtn.classList.toggle('active', newState);
        const svg = favBtn.querySelector('svg');
        svg.setAttribute('fill', newState ? 'currentColor' : 'none');
        createHeartBurst(e.clientX, e.clientY);
      }
    });

    // Evento ver en el cielo
    const viewSkyBtn = card.querySelector('.view-in-sky-btn');
    viewSkyBtn.addEventListener('click', () => {
      scrollToSection('universoSection');
      if (window.loveUniverse) {
        const star = window.loveUniverse.stars.find(s => s.id === item.num);
        if (star) {
          setTimeout(() => {
            window.loveUniverse.flyToStar(star);
            window.loveUniverse.openStarModal(star);
          }, 600);
        }
      }
    });

    gridContainer.appendChild(card);
  });

  // Mostrar u ocultar botón de cargar más
  if (loadMoreBtn) {
    if (end >= currentFilteredReasons.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
    }
  }
}

function getConstellationLabel(constId) {
  const c = (window.CONSTELLATIONS || []).find(x => x.id === constId);
  return c ? `${c.icon} ${c.name}` : '✨ Constelación';
}

function createHeartBurst(x, y) {
  for (let i = 0; i < 7; i++) {
    const heart = document.createElement('div');
    heart.className = 'burst-heart';
    heart.textContent = ['💖', '✨', '💜', '🌸', '💫'][Math.floor(Math.random() * 5)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    const angle = (Math.PI * 2 / 7) * i;
    const distance = Math.random() * 50 + 30;
    heart.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    heart.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }
}

// 3. Carta Secreta Interactiva (Sobre 3D y lacre)
function initLoveLetter() {
  const envelope = document.getElementById('romanticEnvelope');
  const seal = document.getElementById('envelopeSeal');
  const letterModal = document.getElementById('letterModal');
  const closeLetterBtn = document.getElementById('closeLetterBtn');

  if (seal && envelope) {
    seal.addEventListener('click', () => {
      envelope.classList.add('open');
      createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
      setTimeout(() => {
        if (letterModal) {
          letterModal.classList.add('active');
        }
      }, 700);
    });
  }

  if (closeLetterBtn && letterModal) {
    closeLetterBtn.addEventListener('click', () => {
      letterModal.classList.remove('active');
    });
  }

  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        letterModal.classList.remove('active');
      }
    });
  }
}

// 4. Cursor Celestial con destellos suaves
function initCosmicCursor() {
  // Solo en dispositivos con puntero fino (no táctiles)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const colors = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#8b5cf6', '#7c3aed', '#a855f7', '#c084fc'];
  let lastX = 0;
  let lastY = 0;
  let throttle = false;

  window.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;
    setTimeout(() => { throttle = false; }, 40);

    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist > 15) {
      lastX = e.clientX;
      lastY = e.clientY;

      const spark = document.createElement('div');
      spark.className = 'cursor-star-spark';
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      spark.style.boxShadow = `0 0 10px ${spark.style.backgroundColor}`;
      document.body.appendChild(spark);

      setTimeout(() => spark.remove(), 700);
    }
  });
}

// 5. Navegación suave
function initQuickNavigation() {
  document.querySelectorAll('[data-scroll-to]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-scroll-to');
      scrollToSection(targetId);
    });
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// 6. Modal de ayuda para la canción del tocadiscos
function initMusicHelperModal() {
  const helpBtn = document.getElementById('musicHelpBtn');
  const modal = document.getElementById('musicHelpModal');
  const closeBtn = document.getElementById('closeMusicHelpBtn');

  if (helpBtn && modal) {
    helpBtn.addEventListener('click', () => modal.classList.add('active'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

// 7. Lógica interactiva de la Gran Pregunta: "¿Quieres ser mi novia?"
function initProposalSection() {
  const proposalCard = document.getElementById('proposalCard');
  const buttonsZone = document.getElementById('proposalButtonsZone');
  const yesBtn = document.getElementById('proposalYesBtn');
  const noBtn = document.getElementById('proposalNoBtn');
  const hintEl = document.getElementById('proposalDodgeMessage');
  const attemptsCounterEl = document.getElementById('proposalAttemptsCounter');
  const dodgeCountNum = document.getElementById('dodgeCountNum');
  const celebrationModal = document.getElementById('proposalCelebrationModal');
  const closeCelebrationBtn = document.getElementById('closeCelebrationModalBtn');
  const celebrationCoupleNames = document.getElementById('celebrationCoupleNames');
  const playMusicBtn = document.getElementById('celebrationPlayMusicBtn');
  const exploreStarsBtn = document.getElementById('celebrationExploreStarsBtn');

  if (!noBtn || !yesBtn) return;

  let dodgeCount = 0;
  const dodgeMessages = [
    '¡Epa! Ese botón no funciona con tus deditos 🤭',
    '¡Casi! Pero Dios ya tiene otros planes para nosotros ✝️✨',
    '¡Error 404: La opción "No" está desactivada por el destino! 💍',
    '¡Esa opción está prohibida por decreto del amor eterno! 💖',
    '¡No te me escapes tú a mí, di que sí! 🥰',
    '¡Intento fallido! Solo aceptamos un gran SÍ 💚💜',
    '¡Mira qué bonito brilla el botón verde de SÍ! 👆✨',
    '¡El destino ya lo decidió, hermosa mía! Di que sí 💍',
    '¡Ni las 1,000 estrellas te dejarán decir que no! 🌟',
    '¡Ríndete ante el amor, mi corazón te pertenece! 💚✨'
  ];

  // Función para mover y esconder el botón "No" al intentar hacer clic o tocar con el dedo
  const dodgeNoButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    dodgeCount++;
    if (dodgeCountNum) dodgeCountNum.textContent = dodgeCount;
    if (attemptsCounterEl) attemptsCounterEl.style.display = 'block';

    // Cambiar mensaje dinámico divertido y cariñoso
    if (hintEl) {
      const msgIndex = (dodgeCount - 1) % dodgeMessages.length;
      hintEl.innerHTML = `<span>${dodgeMessages[msgIndex]}</span>`;
      hintEl.classList.remove('pop');
      void hintEl.offsetWidth; // Reflow para reiniciar animación
      hintEl.classList.add('pop');
    }

    // Pequeño estallido de destellos
    const rect = noBtn.getBoundingClientRect();
    createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // Calcular desplazamiento inteligente
    const zoneRect = buttonsZone.getBoundingClientRect();

    // Rango seguro de escape
    let newX = (Math.random() - 0.5) * (zoneRect.width > 360 ? 260 : 180);
    let newY = (Math.random() - 0.5) * 110;

    // Asegurar que haya suficiente salto
    if (Math.abs(newX) < 55) newX = newX < 0 ? -90 : 90;
    if (Math.abs(newY) < 30) newY = newY < 0 ? -50 : 50;

    noBtn.style.transform = `translate(${newX}px, ${newY}px)`;

    // El botón SÍ se vuelve ligeramente más grande e irresistible con cada intento
    const scale = Math.min(1 + dodgeCount * 0.04, 1.35);
    yesBtn.style.transform = `scale(${scale})`;
    yesBtn.style.boxShadow = `0 10px 45px var(--emerald-glow-strong), 0 0 ${25 + dodgeCount * 6}px var(--purple-glow)`;
  };

  // Capturar TODO tipo de interacción táctil y de cursor para que NUNCA pueda presionarse
  const dodgeEvents = [
    'pointerdown',
    'touchstart',
    'touchend',
    'mousedown',
    'mouseover',
    'mouseenter',
    'focus',
    'click'
  ];

  dodgeEvents.forEach(evt => {
    noBtn.addEventListener(evt, dodgeNoButton, { passive: false });
  });

  // Cuando presiona ¡SÍ, ACEPTO!
  yesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    triggerCelebration();
  });

  function triggerCelebration() {
    // Guardar en almacenamiento local
    localStorage.setItem('novia_dijo_que_si', 'true');
    localStorage.setItem('fecha_noviazgo_oficial', new Date().toISOString());

    // Nombres en el modal
    const currentName = localStorage.getItem('novia_nombre') || 'Mi Niña Hermosa';
    if (celebrationCoupleNames) {
      celebrationCoupleNames.textContent = `${currentName} & Yo`;
    }

    // Iniciar lluvia masiva de confeti y corazones
    startMassiveConfetti();

    // Reproducir la canción "Si Pudiera" de Manuel Medrano en el tocadiscos si no está sonando
    if (window.romanticTurntable) {
      if (!window.romanticTurntable.isPlaying) {
        window.romanticTurntable.setTrack('si_pudiera', true);
      }
    }

    // Abrir modal de celebración
    if (celebrationModal) {
      celebrationModal.classList.add('active');
    }
  }

  // Cerrar modal
  if (closeCelebrationBtn && celebrationModal) {
    closeCelebrationBtn.addEventListener('click', () => {
      celebrationModal.classList.remove('active');
    });
  }

  if (celebrationModal) {
    celebrationModal.addEventListener('click', (e) => {
      if (e.target === celebrationModal) {
        celebrationModal.classList.remove('active');
      }
    });
  }

  // Botón para ir al tocadiscos desde la celebración
  if (playMusicBtn) {
    playMusicBtn.addEventListener('click', () => {
      if (celebrationModal) celebrationModal.classList.remove('active');
      scrollToSection('tocadiscosSection');
      if (window.romanticTurntable && !window.romanticTurntable.isPlaying) {
        window.romanticTurntable.play();
      }
    });
  }

  // Botón para ir al universo desde la celebración
  if (exploreStarsBtn) {
    exploreStarsBtn.addEventListener('click', () => {
      if (celebrationModal) celebrationModal.classList.remove('active');
      scrollToSection('universoSection');
    });
  }

  // Si ya dijo que sí previamente, mostrar mensaje cariñoso
  if (localStorage.getItem('novia_dijo_que_si') === 'true') {
    if (hintEl) {
      hintEl.innerHTML = `<span>💍 ¡Ya me diste el SÍ más hermoso de mi vida! (Pero puedes volver a aceptarlo siempre) 💚💜</span>`;
    }
  }
}

// Lluvia masiva de confeti, estrellas esmeralda y corazones morados
function startMassiveConfetti() {
  const symbols = ['💚', '💜', '💍', '✨', '💖', '🌿', '🌸', '💫'];
  const count = 75;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const conf = document.createElement('div');
      conf.className = 'burst-heart';
      conf.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      conf.style.left = `${Math.random() * 95 + 2.5}vw`;
      conf.style.top = `${Math.random() * 30 + 10}vh`;
      conf.style.fontSize = `${Math.random() * 20 + 20}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200 + 80;
      conf.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      conf.style.setProperty('--ty', `${Math.sin(angle) * distance + 120}px`);

      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 1200);
    }, i * 40);
  }
}
