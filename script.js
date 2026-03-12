/**
 * Powerline Radio – script.js
 * A Flash of Hope | Interactive functionality
 */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Lightweight query selector helpers.
 * @param {string} selector
 * @param {Document|Element} [ctx=document]
 */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

/* ============================================================
   NAVIGATION
   ============================================================ */

(function initNavigation() {
  const header    = $('#site-header');
  const toggle    = $('#nav-toggle');
  const menu      = $('#nav-menu');
  const navLinks  = $$('.nav-link');

  // --- Scroll behaviour: add .scrolled class on header ---
  let lastScrollY = 0;
  function onScroll() {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 40);
    }
    lastScrollY = scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run immediately

  // --- Hamburger toggle ---
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // --- Active nav link on scroll ---
  const sections = $$('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    let current = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();

/* ============================================================
   LIVE AUDIO PLAYER
   ============================================================ */

(function initPlayer() {
  const audio        = $('#radio-stream');
  const playPauseBtn = $('#play-pause-btn');
  const playIcon     = playPauseBtn ? playPauseBtn.querySelector('.play-icon')  : null;
  const pauseIcon    = playPauseBtn ? playPauseBtn.querySelector('.pause-icon') : null;
  const volumeBtn    = $('#volume-btn');
  const volumeSlider = $('#volume-slider');

  if (!audio || !playPauseBtn) return;

  let isPlaying = false;
  let isMuted   = false;

  // --- Play / Pause ---
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      // Load & play (handles the case where stream hasn't been loaded yet)
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented — silently handle
        });
      }
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);

  audio.addEventListener('play', () => {
    isPlaying = true;
    if (playIcon)  playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    playPauseBtn.setAttribute('aria-label', 'Pause live stream');
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    if (playIcon)  playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    playPauseBtn.setAttribute('aria-label', 'Play live stream');
  });

  // --- Volume slider ---
  if (volumeSlider) {
    audio.volume = volumeSlider.value / 100;

    volumeSlider.addEventListener('input', () => {
      const vol = volumeSlider.value / 100;
      audio.volume = vol;
      audio.muted  = vol === 0;
      isMuted       = vol === 0;
    });
  }

  // --- Mute toggle ---
  if (volumeBtn && volumeSlider) {
    volumeBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      audio.muted = isMuted;
      volumeBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Toggle mute');
      if (volumeSlider) {
        volumeSlider.value = isMuted ? 0 : Math.max(20, audio.volume * 100);
      }
    });
  }

  // --- Show current programme based on time ---
  updateCurrentShow();
  // Update every minute
  setInterval(updateCurrentShow, 60 * 1000);
})();

/**
 * Determine and display what should currently be on air based on local time.
 * Schedule entries use 24-hour values; entries where end > 24 span midnight
 * (e.g., start: 22, end: 29 means 22:00 – 05:00 the following morning).
 */
function updateCurrentShow() {
  const showNameEl = $('#current-show');
  const hostEl     = $('#current-host');
  if (!showNameEl || !hostEl) return;

  const now  = new Date();
  const day  = now.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const hour = now.getHours();

  // For matching, convert hour 0–4 to 24–28 so overnight entries (end > 24) match.
  const h = hour < 5 ? hour + 24 : hour;

  const weekdaySchedule = [
    { start: 5,  end: 6,  show: 'Early Morning Devotion',  host: 'Pastor Samuel Kariuki' },
    { start: 6,  end: 9,  show: 'Breakfast Show',          host: 'Grace Wanjiku'         },
    { start: 9,  end: 12, show: 'Mid-Morning Praise',      host: 'David Ochieng'         },
    { start: 12, end: 13, show: 'Midday Prayer & News',    host: 'Faith Njeri'           },
    { start: 13, end: 16, show: 'Afternoon Gospel Mix',    host: 'Moses Kamau'           },
    { start: 16, end: 19, show: 'Drive Time',              host: 'Ruth Akinyi'           },
    { start: 19, end: 21, show: 'Evening Worship Hour',    host: 'Choir of Hope'         },
    { start: 21, end: 22, show: 'Night Devotion',          host: 'Pastor James Mwangi'  },
    { start: 22, end: 29, show: 'Overnight Worship Music', host: 'Auto Playlist'         },
  ];

  const saturdaySchedule = [
    { start: 6,  end: 8,  show: 'Saturday Morning Praise',     host: 'Grace Wanjiku' },
    { start: 8,  end: 10, show: 'Family Time',                  host: 'David & Ruth'  },
    { start: 10, end: 13, show: 'Youth Connect',                host: 'Brian Mwenda'  },
    { start: 13, end: 16, show: 'Swahili Gospel Show',          host: 'Mama Pendo'    },
    { start: 16, end: 20, show: 'Saturday Evening Celebration', host: 'Moses Kamau'   },
    { start: 20, end: 30, show: 'Overnight Worship Music',      host: 'Auto Playlist' },
  ];

  const sundaySchedule = [
    { start: 6,  end: 8,  show: 'Sunday Morning Worship',  host: 'Pastor Samuel Kariuki' },
    { start: 8,  end: 10, show: 'Live Church Service',     host: 'Various Pastors'        },
    { start: 10, end: 13, show: 'Sunday Bible Study',      host: 'Pastor James Mwangi'   },
    { start: 13, end: 17, show: 'Afternoon Gospel Hymns',  host: 'Choir of Hope'          },
    { start: 17, end: 20, show: 'Sunday Evening Service',  host: 'Various Pastors'        },
    { start: 20, end: 30, show: 'Overnight Worship Music', host: 'Auto Playlist'          },
  ];

  let schedule;
  if (day === 0)      schedule = sundaySchedule;
  else if (day === 6) schedule = saturdaySchedule;
  else                schedule = weekdaySchedule;

  const current = schedule.find(s => h >= s.start && h < s.end);
  if (current) {
    showNameEl.textContent = current.show;
    hostEl.textContent     = current.host === 'Auto Playlist'
      ? current.host
      : `with ${current.host}`;
  } else {
    // Fallback (should not normally be reached with explicit overnight entries)
    showNameEl.textContent = 'Overnight Worship Music';
    hostEl.textContent     = 'Auto Playlist';
  }
}

/* ============================================================
   SCHEDULE TABS
   ============================================================ */

(function initScheduleTabs() {
  const tabBtns   = $$('.tab-btn');
  const tabPanels = $$('.schedule-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panel visibility
      tabPanels.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */

(function initContactForm() {
  const form       = $('#contact-form');
  const successMsg = $('#form-success');
  if (!form) return;

  const fields = {
    name:    { input: $('#contact-name'),    error: $('#name-error'),    validate: validateName    },
    email:   { input: $('#contact-email'),   error: $('#email-error'),   validate: validateEmail   },
    message: { input: $('#contact-message'), error: $('#message-error'), validate: validateMessage },
  };

  // Inline validation on blur
  Object.values(fields).forEach(({ input, error, validate }) => {
    if (!input) return;
    input.addEventListener('blur', () => {
      const msg = validate(input.value);
      showFieldError(input, error, msg);
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        const msg = validate(input.value);
        showFieldError(input, error, msg);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;

    Object.values(fields).forEach(({ input, error, validate }) => {
      if (!input) return;
      const msg = validate(input.value);
      showFieldError(input, error, msg);
      if (msg) hasErrors = true;
    });

    if (!hasErrors) {
      // In a real implementation, this would send data to a server.
      // For now, we display the success message and reset the form.
      form.reset();
      if (successMsg) {
        successMsg.classList.remove('hidden');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => successMsg.classList.add('hidden'), 8000);
      }
    }
  });

  function showFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    if (message) {
      input.classList.add('error');
      errorEl.textContent = message;
    } else {
      input.classList.remove('error');
      errorEl.textContent = '';
    }
  }

  function validateName(value) {
    const v = value.trim();
    if (!v) return 'Please enter your name.';
    if (v.length < 2) return 'Name must be at least 2 characters.';
    return '';
  }

  function validateEmail(value) {
    const v = value.trim();
    if (!v) return 'Please enter your email address.';
    // Simple RFC-5321 inspired check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
    return '';
  }

  function validateMessage(value) {
    const v = value.trim();
    if (!v) return 'Please enter a message.';
    if (v.length < 10) return 'Message must be at least 10 characters.';
    return '';
  }
})();

/* ============================================================
   INTERSECTION OBSERVER – REVEAL ON SCROLL
   ============================================================ */

(function initRevealOnScroll() {
  const targets = $$('.show-card, .stat-card, .contact-item, .schedule-row:not(.header-row)');

  targets.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    // Fallback: make all visible immediately
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ============================================================
   FOOTER YEAR
   ============================================================ */

(function setFooterYear() {
  const yearEl = $('#footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

/* ============================================================
   SMOOTH SCROLL POLYFILL for anchor links
   (Modern browsers support CSS scroll-behavior; this handles edge cases)
   ============================================================ */

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('site-header')?.offsetHeight ?? 70;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: targetY, behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  });
})();
