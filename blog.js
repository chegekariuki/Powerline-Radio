/**
 * Powerline Radio – blog.js
 * Blog / news post browser with category filtering, search,
 * pagination, and an accessible inline post reader (modal).
 *
 * Depends on data.js being loaded first (BLOG_POSTS, BLOG_CATEGORIES).
 */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

const POSTS_PER_PAGE = 5;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   SHARED NAV INIT
   ============================================================ */
(function initNav() {
  const header = $('#site-header');
  const toggle = $('#nav-toggle');
  const menu   = $('#nav-menu');

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-link').forEach(l => l.addEventListener('click', () => {
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
      if (e.key === 'Escape') {
        if (menu.classList.contains('open')) {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      }
    });
  }

  $$('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });
})();

/* ============================================================
   BLOG PAGE INIT
   ============================================================ */
(function initBlog() {
  const filterContainer  = $('#blog-filters');
  const searchInput      = $('#blog-search');
  const featuredWrapper  = $('#featured-post-wrapper');
  const grid             = $('#blog-grid');
  const countEl          = $('#blog-results-count');
  const emptyState       = $('#blog-empty-state');
  const pagination       = $('#blog-pagination');

  let activeCategory = 'all';
  let searchQuery    = '';
  let currentPage    = 1;

  // ---- Build filter buttons ----
  BLOG_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className   = 'filter-btn' + (cat.slug === 'all' ? ' active' : '');
    btn.dataset.cat  = cat.slug;
    btn.textContent  = cat.label;
    btn.setAttribute('aria-pressed', String(cat.slug === 'all'));
    btn.addEventListener('click', () => {
      activeCategory = cat.slug;
      currentPage    = 1;
      filterContainer.querySelectorAll('.filter-btn').forEach(b => {
        const isActive = b.dataset.cat === cat.slug;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      render();
    });
    filterContainer.appendChild(btn);
  });

  // ---- Search ----
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = searchInput.value.toLowerCase().trim();
      currentPage = 1;
      render();
    }, 250);
  });

  // ---- Main render function ----
  function render() {
    const filtered = BLOG_POSTS.filter(post => {
      const matchCat = activeCategory === 'all' || post.category === activeCategory;
      const q        = searchQuery;
      const matchQ   = !q ||
        post.title.toLowerCase().includes(q)    ||
        post.author.toLowerCase().includes(q)   ||
        post.excerpt.toLowerCase().includes(q)  ||
        post.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });

    // Sort: newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Featured post (only when viewing all + no search)
    const showFeatured = activeCategory === 'all' && !searchQuery;
    const featuredPost  = BLOG_POSTS.find(p => p.featured);
    if (featuredWrapper) {
      if (showFeatured && featuredPost) {
        featuredWrapper.innerHTML = buildFeaturedCard(featuredPost);
        featuredWrapper.querySelector('.read-post-btn').addEventListener('click', () => {
          openModal(featuredPost);
        });
      } else {
        featuredWrapper.innerHTML = '';
      }
    }

    // Non-featured posts for pagination
    const nonFeatured = showFeatured && featuredPost
      ? filtered.filter(p => p.id !== featuredPost.id)
      : filtered;

    const totalPages = Math.ceil(nonFeatured.length / POSTS_PER_PAGE);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

    const pageItems = nonFeatured.slice(
      (currentPage - 1) * POSTS_PER_PAGE,
      currentPage * POSTS_PER_PAGE,
    );

    // Update count
    if (countEl) {
      const total = nonFeatured.length + (showFeatured && featuredPost ? 1 : 0);
      countEl.textContent = filtered.length > 0
        ? `${filtered.length} post${filtered.length !== 1 ? 's' : ''} found`
        : '';
    }

    // Render grid
    if (grid) {
      grid.innerHTML = '';
      if (pageItems.length === 0 && !showFeatured) {
        emptyState && emptyState.classList.remove('hidden');
      } else {
        emptyState && emptyState.classList.add('hidden');
        pageItems.forEach((post, i) => {
          const card = buildPostCard(post);
          card.style.animationDelay = `${i * 0.05}s`;
          card.classList.add('card-animate');
          grid.appendChild(card);
        });
      }
    }

    // Render pagination
    if (pagination) renderPagination(totalPages);
  }

  // ---- Build featured card HTML (string) ----
  function buildFeaturedCard(post) {
    return `
      <article class="featured-post-card" aria-label="Featured post">
        <div class="featured-post-body">
          <div class="featured-post-header">
            <span class="post-category-badge">${escHtml(post.categoryLabel)}</span>
            <span class="featured-badge">⭐ Featured</span>
          </div>
          <h2 class="featured-post-title">${escHtml(post.title)}</h2>
          <p class="featured-post-excerpt">${escHtml(post.excerpt)}</p>
          <div class="post-meta">
            <span class="post-author">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              ${escHtml(post.author)}
            </span>
            <span class="post-date">${formatDate(post.date)}</span>
          </div>
          <button class="btn btn-primary read-post-btn">Read Article</button>
        </div>
      </article>
    `;
  }

  // ---- Build post card element ----
  function buildPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';

    article.innerHTML = `
      <div class="post-card-header">
        <span class="post-category-badge">${escHtml(post.categoryLabel)}</span>
        <span class="post-date">${formatDate(post.date)}</span>
      </div>
      <h2 class="post-card-title">${escHtml(post.title)}</h2>
      <p class="post-card-excerpt">${escHtml(post.excerpt)}</p>
      <div class="post-card-footer">
        <span class="post-author">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          ${escHtml(post.author)}
          <em class="post-author-role">${escHtml(post.authorRole)}</em>
        </span>
        <button class="read-more-btn" aria-label="Read ${escHtml(post.title)}">
          Read more
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;

    article.querySelector('.read-more-btn').addEventListener('click', () => openModal(post));

    return article;
  }

  // ---- Pagination ----
  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    const makeBtn = (label, page, disabled, ariaCurrent) => {
      const btn = document.createElement('button');
      btn.className  = 'page-btn' + (ariaCurrent ? ' active' : '');
      btn.textContent = label;
      btn.disabled    = disabled;
      if (ariaCurrent) btn.setAttribute('aria-current', 'page');
      btn.setAttribute('aria-label', `Go to page ${page}`);
      btn.addEventListener('click', () => {
        currentPage = page;
        render();
        grid && grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return btn;
    };

    // Prev
    const prev = makeBtn('← Prev', currentPage - 1, currentPage === 1, false);
    prev.setAttribute('aria-label', 'Previous page');
    pagination.appendChild(prev);

    // Page numbers
    for (let p = 1; p <= totalPages; p++) {
      pagination.appendChild(makeBtn(String(p), p, false, p === currentPage));
    }

    // Next
    const next = makeBtn('Next →', currentPage + 1, currentPage === totalPages, false);
    next.setAttribute('aria-label', 'Next page');
    pagination.appendChild(next);
  }

  // Initial render
  render();
})();

/* ============================================================
   POST MODAL
   ============================================================ */
(function initModal() {
  const modal    = $('#post-modal');
  const backdrop = $('#post-modal-backdrop');
  const closeBtn = $('#post-modal-close');
  const catEl    = $('#modal-category');
  const titleEl  = $('#modal-title');
  const metaEl   = $('#modal-meta');
  const bodyEl   = $('#modal-body');
  const tagsEl   = $('#modal-tags');

  if (!modal) return;

  let previousFocus = null;

  window.openModal = function openModal(post) {
    previousFocus = document.activeElement;

    catEl.textContent  = post.categoryLabel;
    titleEl.textContent = post.title;
    metaEl.innerHTML   = `
      <span class="post-author">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        ${escHtml(post.author)} · <em>${escHtml(post.authorRole)}</em>
      </span>
      <span class="post-date">${formatDate(post.date)}</span>
    `;

    // The content field is trusted HTML (authored in data.js, not user input)
    bodyEl.innerHTML = post.content;

    tagsEl.innerHTML = post.tags
      .map(t => `<span class="post-tag">#${escHtml(t)}</span>`)
      .join('');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Focus the modal content
    const contentEl = modal.querySelector('.post-modal-content');
    if (contentEl) contentEl.focus();
  };

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // Trap focus inside modal
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

/* ============================================================
   HELPERS
   ============================================================ */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
