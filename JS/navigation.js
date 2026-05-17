
const navLinks = [
  { href: 'index.html',             label: 'Home'             },
  { href: '2D-Illustrations.html',  label: '2D Illustrations' },
  { href: '3D-Illustrations.html',  label: '3D Illustrations' },
  { href: 'About.html',             label: 'About'            }
];

function createNavLinks(NavLinks) {
const navigationContainer = document.getElementById('nav-Container');
navigationContainer.classList.add('li')
navigationContainer.setAttribute('data-id-media', NavLinks.id)

const linkElement = document.createElement('a');
linkElement.href = NavLinks.href;
linkElement.textContent = NavLinks.label;


navigationContainer.addEventListener('click', () => {
  window.location.href = NavLinks.href;
});

navigationContainer.appendChild(linkElement);

};

function appendNavLinks() {
  navLinks.forEach(link => {
    createNavLinks(link);
  });

}

appendNavLinks();





