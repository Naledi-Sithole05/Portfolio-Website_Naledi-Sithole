/* ── sections-overlay.js ─────────────────────────────────────────
   Builds a full-screen section-picker overlay on page load.
   Requires each <section> to have:
     data-section-title="My Section"
     data-overlay-img="/path/to/title-image.png"
   ──────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── scroll helpers — defined early so they're always available ── */
  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  // Safety net: always ensure scroll is unlocked on load.
  // If the overlay never opens (no opted-in sections), this is a no-op.
  // If a previous page navigation left a stale lock, this clears it.
  window.addEventListener('load', unlockScroll);

  document.addEventListener('DOMContentLoaded', () => {

    const sections = Array.from(
      document.querySelectorAll('[data-section-title]')
    );

    // No opted-in sections — nothing to do, scroll stays free
    if (!sections.length) return;

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

    /* ── close button + backdrop ───────────────────────────────── */
    closeBtn.addEventListener('click', hideOverlay);
    overlay.querySelector('.ov-backdrop').addEventListener('click', hideOverlay);

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

    /* ── breadcrumb "Overview" button ──────────────────────────── */
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