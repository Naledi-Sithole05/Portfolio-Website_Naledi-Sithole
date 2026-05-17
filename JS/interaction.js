

const CONFIG = {
  firstFrame: 1,
  lastFrame: 13,
  pixelsPerFrame: 70,
  easing: 'linear',
  heroDelay: 60,
  reverseOnScrollUp: true,
  touchMultiplier: 1.8,
};

const TOTAL_FRAMES = CONFIG.lastFrame - CONFIG.firstFrame + 1;
const ANIM_SCROLL  = TOTAL_FRAMES * CONFIG.pixelsPerFrame;
const TOTAL_SCROLL = ANIM_SCROLL + CONFIG.heroDelay;

const easeFns = {
  linear:    t => t,
  easeIn:    t => t * t,
  easeOut:   t => t * (2 - t),
  easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
};
const easeFn = easeFns[CONFIG.easing] || easeFns.linear;

// Pull src from each .anim-frame img in the HTML
const frameURLs = Array.from(
  document.querySelectorAll('#frame-store .anim-frame')
).map(img => img.src);

const animStage    = document.getElementById('anim-stage');
const frameImg     = document.getElementById('frame-img');
const progressFill = document.getElementById('anim-progress-fill');
const scrollHint   = document.getElementById('scroll-hint');
const heroSection  = document.getElementById('hero-section');

// Set first frame immediately
frameImg.src = frameURLs[0];

let scrollPos    = 0;
let currentFrame = 0;
let heroShown    = false;
let animDone     = false;

function render() {
  if (animDone) return;

  const clampedPos = Math.max(0, Math.min(scrollPos, ANIM_SCROLL));
  const rawT       = clampedPos / ANIM_SCROLL;
  const easedT     = easeFn(rawT);
  const frameIdx   = Math.min(Math.round(easedT * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

  if (frameIdx !== currentFrame) {
    currentFrame = frameIdx;
    frameImg.src = frameURLs[frameIdx];
  }

  progressFill.style.width = (rawT * 100) + '%';
  scrollHint.classList.toggle('hidden', scrollPos > 8);

  const triggerHero = scrollPos >= ANIM_SCROLL + CONFIG.heroDelay;

  if (triggerHero && !heroShown)  { heroShown = true;  showHero(); }
  if (!triggerHero && heroShown && CONFIG.reverseOnScrollUp) { heroShown = false; hideHero(); }
}

function showHero() {
  heroSection.classList.add('visible');
  animStage.classList.add('exit');
  animStage.addEventListener('transitionend', () => {
    if (!heroShown) return;
    finishAnimation();
  }, { once: true });
}

function hideHero() {
  heroSection.classList.remove('visible');
  animStage.classList.remove('exit');
}

function finishAnimation() {
  animDone = true;
  animStage.style.display = 'none';
  heroSection.classList.add('done');
  document.body.classList.add('animation-done');
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', onTouchEnd);
  window.removeEventListener('keydown', onKeyDown);
}

function onWheel(e) {
  e.preventDefault();
  if (!CONFIG.reverseOnScrollUp && e.deltaY < 0 && !heroShown) return;
  scrollPos = Math.max(0, Math.min(scrollPos + e.deltaY, TOTAL_SCROLL));
  render();
}
window.addEventListener('wheel', onWheel, { passive: false });

let lastTouchY = null;
function onTouchStart(e) { lastTouchY = e.touches[0].clientY; }
function onTouchMove(e) {
  if (lastTouchY === null) return;
  e.preventDefault();
  const dy = lastTouchY - e.touches[0].clientY;
  lastTouchY = e.touches[0].clientY;
  scrollPos = Math.max(0, Math.min(scrollPos + dy * CONFIG.touchMultiplier, TOTAL_SCROLL));
  render();
}
function onTouchEnd() { lastTouchY = null; }
window.addEventListener('touchstart', onTouchStart, { passive: true });
window.addEventListener('touchmove',  onTouchMove,  { passive: false });
window.addEventListener('touchend',   onTouchEnd,   { passive: true });

function onKeyDown(e) {
  const step = CONFIG.pixelsPerFrame;
  if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
    scrollPos = Math.min(scrollPos + step, TOTAL_SCROLL);
    render();
  }
  if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
    e.preventDefault();
    scrollPos = Math.max(scrollPos - step, 0);
    render();
  }
}
window.addEventListener('keydown', onKeyDown);

render();

additionalSections=
[{id:1, image:"/IMGS/Screenshot 2026-03-14 144704.png",projectTitle:"Brand Recall"},
{id:2, image:"/IMGS/Screenshot 2026-03-14 144704.png",projectTitle:"Brand Recall"},

];

function returnHomepagesections(sections){
  const sectionCard1 = document.createElement("div");
  sectionCard1.classList.add('homepage-section1');
  sectionCard1.setAttribute("data-id-section", data-id);

  const imageSection1= document.createElement("img");
  imageSection1.classList.add('img-section1');
  imageSection1.img = (sections.image);


  const sectionCard2 = document.createElement('div');
  sectionCard2.classList.add("homepage-section2");
  sectionCard2.setAttribute('data-id-section', data-id);


  const imageSection2 = document.createElement("img");
  imageSection2.classList.add("img-section1");
  imageSection2.img = (sections.image);


  sectionCard1.appendChild(imageSection1);
  sectionCard2.appendChild(sectionCard2);

  return([sectionCard1,sectionCard2] );


  
    
  
    
  
 
};

const homepageSections = document.querySelector('BrandRecall-Clientwork', "Adidas-Campaign");
  additionalSections.map(sections=>{
    const [sectionCard1,sectionCard2]= returnHomepagesections(sections);
    homepageSections.appendchild([sectionCard1,sectionCard2])
    

  });


const eventReturn = 
[{id:1, name:"Rocking the daisies", TopArtist: "Jorja Smith" },
 {id:2, name:"SoundSetSunday", TopArtists: 'Uncle waffles'} 
 
]





    



