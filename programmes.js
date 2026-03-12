/**
 * Powerline Radio – programmes.js
 * Audio programme / podcast episode browser + inline player
 *
 * Depends on data.js being loaded first (EPISODES, EPISODE_CATEGORIES).
 */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

/** Format seconds → M:SS or H:MM:SS */
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Locale-formatted date string */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/* ============================================================
   SHARED NAV INIT (hamburger)
   ============================================================ */
(function initNav() {
  const header  = $('#site-header');
  const toggle  = $('#nav-toggle');
  const menu    = $('#nav-menu');
  const links   = $$('.nav-link');

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.forEach(l => l.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('click', e => {
      if (header && !header.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Footer year
  $$('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });
})();

/* ============================================================
   PROGRAMMES PAGE INIT
   ============================================================ */
(function initProgrammes() {
  // ---- DOM refs ----
  const filterContainer = $('#episode-filters');
  const searchInput     = $('#episode-search');
  const grid            = $('#episode-grid');
  const countEl         = $('#results-count');
  const emptyState      = $('#empty-state');

  let activeCategory = 'all';
  let searchQuery    = '';

  // ---- Build filter buttons ----
  EPISODE_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className  = 'filter-btn' + (cat.slug === 'all' ? ' active' : '');
    btn.dataset.cat = cat.slug;
    btn.textContent = cat.label;
    btn.setAttribute('aria-pressed', String(cat.slug === 'all'));
    btn.addEventListener('click', () => {
      activeCategory = cat.slug;
      filterContainer.querySelectorAll('.filter-btn').forEach(b => {
        const isActive = b.dataset.cat === cat.slug;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      renderEpisodes();
    });
    filterContainer.appendChild(btn);
  });

  // ---- Search ----
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    renderEpisodes();
  });

  // ---- Render episodes ----
  function renderEpisodes() {
    const filtered = EPISODES.filter(ep => {
      const matchCat = activeCategory === 'all' || ep.category === activeCategory;
      const q        = searchQuery;
      const matchQ   = !q ||
        ep.title.toLowerCase().includes(q) ||
        ep.show.toLowerCase().includes(q)  ||
        ep.host.toLowerCase().includes(q)  ||
        ep.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    // Sort: featured first, then newest first
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
      countEl.textContent = '';
    } else {
      emptyState.classList.add('hidden');
      countEl.textContent = `${filtered.length} episode${filtered.length !== 1 ? 's' : ''} found`;
      filtered.forEach(ep => grid.appendChild(buildEpisodeCard(ep)));
      // Reveal animation
      $$('.episode-card', grid).forEach((card, i) => {
        card.style.animationDelay = `${i * 0.05}s`;
        card.classList.add('card-animate');
      });
    }
  }

  // ---- Build a single episode card ----
  function buildEpisodeCard(ep) {
    const article = document.createElement('article');
    article.className = 'episode-card';
    article.setAttribute('data-id', ep.id);

    article.innerHTML = `
      <div class="episode-card-header">
        <div class="episode-meta-top">
          <span class="episode-category-badge">${categoryLabel(ep.category)}</span>
          ${ep.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
        </div>
        <span class="episode-duration">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
            <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
          ${ep.duration}
        </span>
      </div>

      <div class="episode-card-body">
        <p class="episode-show-name">${escHtml(ep.show)}</p>
        <h2 class="episode-title">${escHtml(ep.title)}</h2>
        <p class="episode-description">${escHtml(ep.description)}</p>
      </div>

      <div class="episode-card-footer">
        <div class="episode-host-date">
          <span class="episode-host">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            ${escHtml(ep.host)}
          </span>
          <span class="episode-date">${formatDate(ep.date)}</span>
        </div>
        <button class="episode-play-btn" data-id="${ep.id}" aria-label="Play ${escAttr(ep.title)}">
          <svg class="ep-play-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" fill="currentColor"/>
          </svg>
          <svg class="ep-pause-icon hidden" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
          </svg>
          <span class="ep-btn-label">Play</span>
        </button>
      </div>
    `;

    article.querySelector('.episode-play-btn').addEventListener('click', () => {
      loadAndPlay(ep);
    });

    return article;
  }

  function categoryLabel(slug) {
    const cat = EPISODE_CATEGORIES.find(c => c.slug === slug);
    return cat ? cat.label : slug;
  }

  // Initial render
  renderEpisodes();
})();

/* ============================================================
   STICKY MINI PLAYER
   ============================================================ */
(function initMiniPlayer() {
  const miniPlayer    = $('#mini-player');
  const audioEl       = $('#episode-audio');
  const miniTitle     = $('#mini-player-title');
  const miniShow      = $('#mini-player-show');
  const miniPlayBtn   = $('#mini-play-btn');
  const miniPlayIcon  = miniPlayBtn ? miniPlayBtn.querySelector('.mini-play-icon')  : null;
  const miniPauseIcon = miniPlayBtn ? miniPlayBtn.querySelector('.mini-pause-icon') : null;
  const miniRewind    = $('#mini-rewind-btn');
  const miniForward   = $('#mini-forward-btn');
  const miniClose     = $('#mini-close-btn');
  const progressBar   = $('#mini-progress-bar');
  const timeCurrent   = $('#mini-time-current');
  const timeDuration  = $('#mini-time-duration');

  if (!miniPlayer || !audioEl) return;

  let currentEpisodeId = null;

  /** Expose loadAndPlay globally so episode cards can call it */
  window.loadAndPlay = function loadAndPlay(ep) {
    if (currentEpisodeId === ep.id) {
      // Toggle play/pause for the same episode
      if (audioEl.paused) {
        audioEl.play().catch(() => {});
      } else {
        audioEl.pause();
      }
      return;
    }

    // New episode
    currentEpisodeId = ep.id;
    audioEl.src      = ep.audioUrl;
    audioEl.load();

    miniTitle.textContent    = ep.title;
    miniShow.textContent     = ep.show;
    timeDuration.textContent = ep.duration;

    if (progressBar) {
      progressBar.max   = ep.durationSec || 100;
      progressBar.value = 0;
    }

    miniPlayer.classList.remove('hidden');
    audioEl.play().catch(() => {});

    // Update all play buttons — reset others, highlight active
    updatePlayButtons(ep.id, false); // will flip to "playing" on the 'play' event
  };

  // Audio events
  audioEl.addEventListener('play', () => {
    updatePlayButtons(currentEpisodeId, true);
    miniPlayBtn.setAttribute('aria-label', 'Pause');
    if (miniPlayIcon)  miniPlayIcon.classList.add('hidden');
    if (miniPauseIcon) miniPauseIcon.classList.remove('hidden');
  });

  audioEl.addEventListener('pause', () => {
    updatePlayButtons(currentEpisodeId, false);
    miniPlayBtn.setAttribute('aria-label', 'Play');
    if (miniPlayIcon)  miniPlayIcon.classList.remove('hidden');
    if (miniPauseIcon) miniPauseIcon.classList.add('hidden');
  });

  audioEl.addEventListener('ended', () => {
    updatePlayButtons(currentEpisodeId, false);
    if (miniPlayIcon)  miniPlayIcon.classList.remove('hidden');
    if (miniPauseIcon) miniPauseIcon.classList.add('hidden');
    if (progressBar)   progressBar.value = 0;
    if (timeCurrent)   timeCurrent.textContent = '0:00';
  });

  audioEl.addEventListener('timeupdate', () => {
    if (!isFinite(audioEl.duration)) return;
    if (progressBar) progressBar.value = audioEl.currentTime;
    if (timeCurrent) timeCurrent.textContent = formatTime(audioEl.currentTime);
  });

  audioEl.addEventListener('loadedmetadata', () => {
    if (!isFinite(audioEl.duration)) return;
    if (progressBar) progressBar.max = audioEl.duration;
    if (timeDuration) timeDuration.textContent = formatTime(audioEl.duration);
  });

  // Controls
  if (miniPlayBtn) {
    miniPlayBtn.addEventListener('click', () => {
      if (audioEl.paused) audioEl.play().catch(() => {});
      else audioEl.pause();
    });
  }

  if (miniRewind) {
    miniRewind.addEventListener('click', () => {
      audioEl.currentTime = Math.max(0, audioEl.currentTime - 15);
    });
  }

  if (miniForward) {
    miniForward.addEventListener('click', () => {
      audioEl.currentTime = Math.min(audioEl.duration || 0, audioEl.currentTime + 15);
    });
  }

  if (progressBar) {
    progressBar.addEventListener('input', () => {
      audioEl.currentTime = parseFloat(progressBar.value);
    });
  }

  if (miniClose) {
    miniClose.addEventListener('click', () => {
      audioEl.pause();
      audioEl.src = '';
      currentEpisodeId = null;
      miniPlayer.classList.add('hidden');
      updatePlayButtons(null, false);
    });
  }

  /** Sync all episode play buttons to the current play state */
  function updatePlayButtons(activeId, playing) {
    document.querySelectorAll('.episode-play-btn').forEach(btn => {
      const id      = Number(btn.dataset.id);
      const isActive = id === activeId && playing;
      const playI   = btn.querySelector('.ep-play-icon');
      const pauseI  = btn.querySelector('.ep-pause-icon');
      const label   = btn.querySelector('.ep-btn-label');
      btn.classList.toggle('playing', isActive);
      if (playI)  playI.classList.toggle('hidden', isActive);
      if (pauseI) pauseI.classList.toggle('hidden', !isActive);
      if (label)  label.textContent = isActive ? 'Pause' : 'Play';
      btn.setAttribute('aria-label',
        isActive
          ? `Pause ${btn.getAttribute('aria-label').replace(/^Play\s+|^Pause\s+/, '')}`
          : `Play ${btn.getAttribute('aria-label').replace(/^Play\s+|^Pause\s+/, '')}`
      );
    });
  }
})();

/* ============================================================
   HELPERS – HTML escaping
   ============================================================ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Make sure formatTime is available (defined here too for this module) */
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
