const navLinks = [
  { href: 'index.html',            label: 'Home'            },
  { href: '2D-Illustrations.html', label: '2D Illustrations' },
  { href: '3D-Illustrations.html', label: '3D Illustrations' },
  { href: 'About.html',            label: 'About'           },
];

const currentPage = window.location.pathname.split('/').pop();

const listItems = navLinks
  .map(link => {
    const isActive = currentPage === link.href ? 'class="active"' : '';
    return `<li><a href="/HTML/${link.href}" ${isActive}>${link.label}</a></li>`;
  })
  .join('');

const navbar = `
  <nav id="main-nav">
    <a class="nav-logo" href="/HTML/index.html">
      <img src="/IMGS/Site_logo/0001.png" alt="site logo" />
      <span>Naledi Sithole</span>
    </a>
    <ul>${listItems}</ul>
  </nav>
`;

document.body.insertAdjacentHTML('afterbegin', navbar);







