/* ── SectionsOverlay.js ──────────────────────────────────────────
   Builds a full-screen section-picker overlay on page load.
   Requires each <section> to have:
     data-section-title="My Section"
     data-overlay-img="/path/to/title-image.png"   (optional)

   The overlay only opens when 2+ opted-in sections exist.
   Single-section pages load normally with no overlay and no scroll lock.
   ──────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── scroll helpers ─────────────────────────────────────────── */
  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  /* Safety net: always clear any stale scroll lock on page load.
     Runs on 'load' (after DOMContentLoaded) so it fires last. */
  window.addEventListener('load', unlockScroll);

  document.addEventListener('DOMContentLoaded', () => {

    const sections = Array.from(
      document.querySelectorAll('[data-section-title]')
    );

    /* ── Guard: only show overlay when there are 2+ sections ─── */
    /* Single-section pages (intro/landing pages) don't need a    */
    /* picker — just let them scroll normally.                    */
    if (sections.length < 2) {
      unlockScroll(); // ensure no stale lock
      return;
    }

    /* ── build overlay ─────────────────────────────────────────── */
    const itemsHTML = sections
      .map((sec, i) => {
        const title = sec.dataset.sectionTitle || `Section ${i + 1}`;
        const img   = sec.dataset.overlayImg   || '';
        return `
          <button class="ov-item" data-index="${i}" aria-label="Go to ${title}">
            ${img
              ? `<img class="ov-item-img" src="${img}" alt="${title}">`
              : `<span class="ov-item-label">${title}</span>`
            }
            <span class="ov-item-hover-line"></span>
          </button>`;
      })
      .join('');

    const overlayHTML = `
      <div id="sections-overlay" role="dialog" aria-modal="true" aria-label="Section overview">
        <div class="ov-backdrop"></div>
        <div class="ov-content">
          <p class="ov-eyebrow">Choose a section</p>
          <div class="ov-grid">${itemsHTML}</div>
          <button class="ov-close" id="ov-close-btn" aria-label="Close overview">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor"
                    stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <span>Close</span>
          </button>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('afterbegin', overlayHTML);

    const overlay  = document.getElementById('sections-overlay');
    const closeBtn = document.getElementById('ov-close-btn');

    /* ── hide / show ───────────────────────────────────────────── */
    function hideOverlay() {
      overlay.classList.add('overlay-hidden');
      unlockScroll();
    }

    function showOverlay() {
      overlay.classList.remove('overlay-hidden');
      lockScroll();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    /* ── close button + backdrop click ────────────────────────── */
    closeBtn.addEventListener('click', hideOverlay);
    overlay.querySelector('.ov-backdrop').addEventListener('click', hideOverlay);

    /* ── Escape key closes overlay ─────────────────────────────── */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('overlay-hidden')) {
        hideOverlay();
      }
    });

    /* ── section cards ─────────────────────────────────────────── */
    overlay.querySelectorAll('.ov-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx    = parseInt(btn.dataset.index, 10);
        const target = sections[idx];
        if (!target) return;

        hideOverlay();

        setTimeout(() => {
          const navEl  = document.querySelector('nav');
          const bcEl   = document.querySelector('.breadcrumb');
          const offset = (navEl ? navEl.offsetHeight : 0)
                       + (bcEl  ? bcEl.offsetHeight  : 0)
                       + 12;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 350);
      });
    });

    /* ── breadcrumb "Overview" button re-opens overlay ─────────── */
    document.addEventListener('click', (e) => {
      if (e.target.closest('#bc-back-btn')) {
        e.stopImmediatePropagation();
        showOverlay();
      }
    }, { capture: true });

    /* ── open on first load ────────────────────────────────────── */
    showOverlay();
  });
})();