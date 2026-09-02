const menu = document.querySelector('.menu');
const nav = document.querySelector('.navlinks');
const body = document.body;

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.classList.toggle('menu-open', open);
    updateBookbar();
  });
}

document.querySelectorAll('.nav-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.matchMedia('(max-width:1120px)').matches) {
      const group = btn.closest('.nav-group');
      const open = group.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.nav-group') && window.matchMedia('(min-width:1121px)').matches) {
    document.querySelectorAll('.nav-group.open').forEach(group => {
      group.classList.remove('open');
      group.querySelector('.nav-trigger')?.setAttribute('aria-expanded','false');
    });
  }
});

// Accessible lightbox: ordinary image links remain usable if JavaScript is unavailable.
const lightbox = document.querySelector('.lightbox');
let lastLightboxTrigger = null;
if (lightbox) {
  const closeButton = lightbox.querySelector('button');
  const lightboxImage = lightbox.querySelector('img');
  const openLightbox = trigger => {
    lastLightboxTrigger = trigger;
    lightboxImage.src = trigger.href;
    lightboxImage.alt = trigger.querySelector('img')?.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    body.classList.add('lightbox-open');
    closeButton?.focus();
    updateBookbar();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    lastLightboxTrigger?.focus();
    updateBookbar();
  };
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openLightbox(link);
    });
  });
  closeButton?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton?.focus();
    }
  });
}

// Progressive YouTube enhancement: the visible control is a normal link without JS.
document.querySelectorAll('.video-facade[data-youtube]').forEach(box => {
  const id = box.dataset.youtube;
  const title = box.dataset.title || 'Film na YouTube';
  const link = box.querySelector('[data-play]');
  if (!link) return;
  link.addEventListener('click', event => {
    if (!id || location.protocol === 'file:') return;
    event.preventDefault();
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    box.replaceChildren(iframe);
    box.classList.add('playing');
  });
});

// Leśne bingo.
const natureQuest = document.querySelector('[data-nature-quest]');
if (natureQuest) {
  const storageKey = 'siemiany-nature-quest-v1';
  const boxes = [...natureQuest.querySelectorAll('input[type="checkbox"]')];
  const progress = natureQuest.querySelector('[data-quest-progress]');
  const update = () => {
    const completed = boxes.filter(box => box.checked).map(box => box.value);
    if (progress) progress.textContent = `Odnalezione: ${completed.length}/${boxes.length}`;
    try { localStorage.setItem(storageKey, JSON.stringify(completed)); } catch (_error) {}
  };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    boxes.forEach(box => { box.checked = saved.includes(box.value); });
  } catch (_error) {}
  boxes.forEach(box => box.addEventListener('change', update));
  natureQuest.querySelector('[data-quest-reset]')?.addEventListener('click', () => {
    boxes.forEach(box => { box.checked = false; });
    update();
  });
  update();
}

// Mobile booking bar: appears only after the opening hero and never competes with menu/lightbox.
const bar = document.querySelector('.mobile-bookbar');
const hero = document.querySelector('.hero, .page-hero');
function updateBookbar() {
  if (!bar || window.innerWidth > 760) {
    body.classList.remove('bookbar-active');
    bar?.classList.remove('is-visible');
    return;
  }
  const threshold = hero ? hero.offsetTop + Math.max(220, hero.offsetHeight - 120) : 420;
  const blocked = body.classList.contains('menu-open') || body.classList.contains('lightbox-open');
  const show = window.scrollY > threshold && !blocked;
  bar.classList.toggle('is-visible', show);
  body.classList.toggle('bookbar-active', show);
}
updateBookbar();
addEventListener('scroll', updateBookbar, {passive:true});
addEventListener('resize', updateBookbar);
