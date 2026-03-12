/**
 * Powerline Radio – index-previews.js
 * Populates the "Latest Episodes" and "From the Blog" preview sections
 * on the homepage (index.html).
 *
 * Depends on data.js being loaded first (EPISODES, BLOG_POSTS).
 */

'use strict';

(function initHomePreviews() {
  /* ---- helpers ---- */
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-KE', {
      year: 'numeric', month: 'short', day: 'numeric',
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

  /* ==============================================================
     LATEST EPISODES (3 most recent, featured first)
     ============================================================== */
  const epGrid = document.getElementById('latest-episodes-grid');
  if (epGrid && typeof EPISODES !== 'undefined') {
    const sorted = [...EPISODES].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    sorted.slice(0, 3).forEach((ep, i) => {
      const card = document.createElement('article');
      card.className = 'latest-ep-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;

      card.innerHTML = `
        <div class="latest-ep-icon" aria-hidden="true">🎙️</div>
        <div class="latest-ep-body">
          <p class="latest-ep-show">${escHtml(ep.show)}</p>
          <h3 class="latest-ep-title">${escHtml(ep.title)}</h3>
          <p class="latest-ep-meta">
            <span>${escHtml(ep.host)}</span>
            <span class="sep" aria-hidden="true">·</span>
            <span>${ep.duration}</span>
            <span class="sep" aria-hidden="true">·</span>
            <span>${formatDate(ep.date)}</span>
          </p>
        </div>
        <a href="programmes.html" class="latest-ep-link" aria-label="Listen to ${escHtml(ep.title)} on the Programmes page">
          Listen
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      `;

      epGrid.appendChild(card);
    });

    // Scroll-reveal for episode preview cards
    revealOnScroll(epGrid.querySelectorAll('.latest-ep-card'));
  }

  /* ==============================================================
     LATEST BLOG POSTS (3 most recent)
     ============================================================== */
  const postsGrid = document.getElementById('latest-posts-grid');
  if (postsGrid && typeof BLOG_POSTS !== 'undefined') {
    const sorted = [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.slice(0, 3).forEach((post, i) => {
      const card = document.createElement('article');
      card.className = 'latest-post-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;

      card.innerHTML = `
        <div class="latest-post-header">
          <span class="post-category-badge">${escHtml(post.categoryLabel)}</span>
          <span class="latest-post-date">${formatDate(post.date)}</span>
        </div>
        <h3 class="latest-post-title">${escHtml(post.title)}</h3>
        <p class="latest-post-excerpt">${escHtml(post.excerpt.slice(0, 120))}…</p>
        <a href="blog.html" class="latest-post-link" aria-label="Read ${escHtml(post.title)} on the Blog">
          Read more
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      `;

      postsGrid.appendChild(card);
    });

    revealOnScroll(postsGrid.querySelectorAll('.latest-post-card'));
  }

  /* ---- shared reveal helper ---- */
  function revealOnScroll(elements) {
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach(el => obs.observe(el));
  }
})();
