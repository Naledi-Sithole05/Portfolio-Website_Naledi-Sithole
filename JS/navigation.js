/* ── navigation.js ──────────────────────────────────────────────────
   Injects the top nav bar AND (on section pages) a breadcrumb trail.
   ──────────────────────────────────────────────────────────────────── */

const navLinks = [
  { href: 'index.html',            label: 'Home'            },
  { href: '2D-Illustrations.html', label: '2D Illustrations' },
  { href: '3D-Illustrations.html', label: '3D Illustrations' },
  { href: 'About.html',            label: 'About'           },
];

// ── page detection ────────────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isHomePage  = currentPage === 'index.html' || currentPage === '';

// ── breadcrumb map  (page → [{label, href}])  ─────────────────────
// href: null = current page (no link), '#overlay' = re-open overlay
const breadcrumbMap = {
  '2D-Illustrations.html': [
    { label: 'Home', href: '/HTML/index.html' },
    { label: '2D Illustrations', href: null },
  ],
  '3D-Illustrations.html': [
    { label: 'Home', href: '/HTML/index.html' },
    { label: '3D Illustrations', href: null },
  ],
  '2d(Digital Art).html': [
    { label: 'Home',             href: '/HTML/index.html' },
    { label: '2D Illustrations', href: '/HTML/2D-Illustrations.html' },
    { label: 'Digital Art',      href: null },
  ],
  '2d(GameDev).html': [
    { label: 'Home',             href: '/HTML/index.html' },
    { label: '2D Illustrations', href: '/HTML/2D-Illustrations.html' },
    { label: 'Game Development', href: null },
  ],
  '3d(Assest-Design).html': [
    { label: 'Home',             href: '/HTML/index.html' },
    { label: '3D Illustrations', href: '/HTML/3D-Illustrations.html' },
    { label: 'Asset Design',     href: null },
  ],
  '3d(Game-dev).html': [
    { label: 'Home',             href: '/HTML/index.html' },
    { label: '3D Illustrations', href: '/HTML/3D-Illustrations.html' },
    { label: 'Game Development', href: null },
  ],
};

// ── build nav ─────────────────────────────────────────────────────
const listItems = navLinks
  .map(link => {
    const isActive = currentPage === link.href ? 'class="active"' : '';
    return `<li><a href="/HTML/${link.href}" ${isActive}>${link.label}</a></li>`;
  })
  .join('');

const navStyle = isHomePage
  ? 'opacity:0;pointer-events:none;transition:opacity 0.5s ease;'
  : '';

const navbar = `
  <nav id="main-nav" style="${navStyle}">
    <a class="nav-logo" href="/HTML/index.html">
      <img src="/IMGS/Site_logo/0001.png" alt="site logo" />
      <span>Naledi Sithole</span>
    </a>
    <ul>${listItems}</ul>
  </nav>
`;

document.body.insertAdjacentHTML('afterbegin', navbar);

// ── build breadcrumb (non-home pages only) ────────────────────────
const crumbs = breadcrumbMap[currentPage];

if (!isHomePage && crumbs) {
  const crumbHTML = crumbs
    .map((c, i) => {
      const isLast = i === crumbs.length - 1;
      const sep    = i > 0 ? '<span class="bc-sep" aria-hidden="true">›</span>' : '';
      const inner  = isLast
        ? `<span class="bc-current">${c.label}</span>`
        : `<a  class="bc-link" href="${c.href}">${c.label}</a>`;
      return sep + inner;
    })
    .join('');

  // "Back to top / overlay" button — appears on section-content pages
  const hasOverlay = !!document.querySelector; // always true; overlay script handles real check
  const backBtn = `
    <button class="bc-back-btn" id="bc-back-btn" aria-label="Back to section overview">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11 7H3M6 3.5L3 7l3 3.5" stroke="currentColor" stroke-width="1.3"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Overview
    </button>`;

  const breadcrumb = `
    <nav class="breadcrumb" id="breadcrumb" aria-label="Breadcrumb">
      <div class="bc-trail">${crumbHTML}</div>
      ${backBtn}
    </nav>`;

  // insert after <nav>
  const nav = document.getElementById('main-nav');
  nav.insertAdjacentHTML('afterend', breadcrumb);

  // ── scroll-spy: highlight active section & show/hide breadcrumb ──
  window.addEventListener('DOMContentLoaded', () => {
    const bc         = document.getElementById('breadcrumb');
    const backBtnEl  = document.getElementById('bc-back-btn');

    // wire back button: if page has overlay, reopen it; else go up a level
    if (backBtnEl) {
      backBtnEl.addEventListener('click', () => {
        const overlay = document.getElementById('sections-overlay');
        if (overlay) {
          overlay.classList.remove('overlay-hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const parent = crumbs.length >= 2 ? crumbs[crumbs.length - 2].href : '/HTML/index.html';
          if (parent) window.location.href = parent;
        }
      });
    }

    // scroll-spy: update .bc-current label to match visible section
    const sections = document.querySelectorAll('[data-section-title]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const label = entry.target.dataset.sectionTitle;
          const cur   = bc && bc.querySelector('.bc-current');
          if (cur && label) cur.textContent = label;
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  });
}






