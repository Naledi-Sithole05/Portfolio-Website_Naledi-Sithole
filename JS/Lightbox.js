

(function () {
  'use strict';

  /* ── util ── */
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  /* ── build lightbox overlay (shared across all galleries) ── */
  function buildLightbox() {
    const lb = document.createElement('div');
    lb.id = 'lb-overlay';
    lb.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-stage">
        <img class="lb-img" src="" alt="">
        <p class="lb-caption"></p>
      </div>
      <button class="lb-nav lb-prev" aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button class="lb-nav lb-next" aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      <button class="lb-close" aria-label="Close">
        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
          <path d="M4 4l10 10M14 4L4 14"/>
        </svg>
      </button>
      <span class="lb-counter"></span>
    `;
    document.body.appendChild(lb);
    return lb;
  }

  /* ── init ── */
  document.addEventListener('DOMContentLoaded', () => {
    const galleries = Array.from(document.querySelectorAll('.lb-gallery'));
    if (!galleries.length) return;

    const lb       = buildLightbox();
    const lbImg    = lb.querySelector('.lb-img');
    const lbCap    = lb.querySelector('.lb-caption');
    const lbPrev   = lb.querySelector('.lb-prev');
    const lbNext   = lb.querySelector('.lb-next');
    const lbClose  = lb.querySelector('.lb-close');
    const lbBack   = lb.querySelector('.lb-backdrop');
    const lbCount  = lb.querySelector('.lb-counter');

    let currentGallery = null; // array of img elements for active gallery
    let currentIndex   = 0;

    /* ── open / close ── */
    function openLightbox(imgs, idx) {
      currentGallery = imgs;
      currentIndex   = idx;
      lb.classList.add('lb-active');
      document.body.style.overflow = 'hidden';
      showImage();
    }

    function closeLightbox() {
      lb.classList.remove('lb-active');
      document.body.style.overflow = '';
    }

    function showImage() {
      const img = currentGallery[currentIndex];
      lbImg.src        = img.src;
      lbImg.alt        = img.alt || '';
      lbCap.textContent = img.alt || '';
      lbCount.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
      lbPrev.style.opacity = currentIndex === 0 ? '0.25' : '1';
      lbNext.style.opacity = currentIndex === currentGallery.length - 1 ? '0.25' : '1';
      /* micro-pop on change */
      lbImg.style.transform = 'scale(0.96)';
      requestAnimationFrame(() => {
        lbImg.style.transform = '';
      });
    }

    function goPrev() {
      if (currentIndex > 0) { currentIndex--; showImage(); }
    }

    function goNext() {
      if (currentIndex < currentGallery.length - 1) { currentIndex++; showImage(); }
    }

    lbPrev.addEventListener('click', goPrev);
    lbNext.addEventListener('click', goNext);
    lbClose.addEventListener('click', closeLightbox);
    lbBack.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('lb-active')) return;
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape')     closeLightbox();
    });

    /* ── per-gallery stack setup ── */
    galleries.forEach(gallery => {
      const imgs = Array.from(gallery.querySelectorAll('img'));
      if (!imgs.length) return;

      /* wrap each img in a card div */
      imgs.forEach((img, i) => {
        const card = document.createElement('div');
        card.className = 'lb-card';
        card.dataset.index = i;
        img.parentNode.insertBefore(card, img);
        card.appendChild(img);

        /* assign a fixed resting rotation so the stack looks natural */
        const restRot = rand(-6, 6);
        card.style.setProperty('--rest-rot', `${restRot}deg`);

        /* click opens lightbox */
        card.addEventListener('click', () => openLightbox(imgs, i));
      });

      /* ── entry animation: fly cards in from the right, sequentially ── */
      function animateIn() {
        imgs.forEach((img, i) => {
          const card = img.closest('.lb-card');
          /* start off-screen to the right */
          card.style.transform = 'translateX(120vw) rotate(0deg)';
          card.style.opacity   = '0';
          card.style.zIndex    = imgs.length - i; /* first card on top */

          const delay = i * 120; /* 120ms between each card */
          setTimeout(() => {
            card.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease';
            card.style.transform  = `rotate(var(--rest-rot))`;
            card.style.opacity    = '1';
          }, delay);
        });
      }

      /* use IntersectionObserver so animation fires when gallery scrolls into view */
      let animated = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            animateIn();
            observer.disconnect();
          }
        });
      }, { threshold: 0.15 });

      observer.observe(gallery);
    });
  });
})();