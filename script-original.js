// Privacy-friendly analytics. Track only the production site; skip 404 and legacy redirect stubs.
const analyticsExcludedPaths = new Set([
  '/404.html',
  '/galeria.html',
  '/polozenie.html',
  '/rezerwacja.html',
  '/terminy.html',
  '/wyposazenie.html'
]);
const isNotFoundPage = document.title === 'Nie znaleziono strony - siemiany.info';
const analyticsEnabled =
  location.protocol === 'https:' &&
  location.hostname === 'siemiany.info' &&
  !isNotFoundPage &&
  !analyticsExcludedPaths.has(location.pathname);

if (analyticsEnabled) {
  const umamiScript = document.createElement('script');
  umamiScript.defer = true;
  umamiScript.src = 'https://cloud.umami.is/script.js';
  umamiScript.dataset.websiteId = '71156e21-af68-4e4f-906e-1526f39437a5';
  document.head.appendChild(umamiScript);
}

function trackUmami(eventName, data = {}) {
  if (!analyticsEnabled || !window.umami?.track) return;
  window.umami.track(eventName, data);
}

function analyticsPageName() {
  const file = location.pathname.split('/').filter(Boolean).pop();
  if (!file || /^index\.html$/i.test(file)) return 'home';
  return file.replace(/\.html$/i, '');
}

function analyticsPlacement(element) {
  if (element.closest('.mobile-bookbar')) return 'mobile_bookbar';
  if (element.closest('nav')) return 'navigation';
  if (element.closest('.hero, .page-hero')) return 'hero';
  if (element.closest('footer')) return 'footer';
  if (element.closest('.guide-cta, .stay-cta, .book-cta')) return 'article_cta';
  return 'content';
}

function normalizedLinkLabel(link) {
  return (link.textContent || link.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 100);
}

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
    trackUmami('video_play', {
      source_page: analyticsPageName(),
      video_id: id,
      title: title.slice(0, 100)
    });
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

// Key navigation and conversion events. Event properties let Umami answer
// which page and CTA placement generated a click without creating dozens of event names.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || !analyticsEnabled) return;

  let url;
  try { url = new URL(link.href, location.href); } catch (_error) { return; }

  const sourcePage = analyticsPageName();
  const placement = analyticsPlacement(link);
  const label = normalizedLinkLabel(link);
  const properties = {
    source_page: sourcePage,
    placement,
    label
  };

  if (url.hostname === 'booking.com' || url.hostname.endsWith('.booking.com')) {
    trackUmami('booking_click', properties);
    return;
  }

  if (url.origin === location.origin && /\/domek\.html$/i.test(url.pathname) && sourcePage !== 'domek') {
    trackUmami('guide_to_house_click', properties);
    return;
  }

  if (/\.gpx(?:$|[?#])/i.test(url.pathname + url.search + url.hash)) {
    trackUmami('gpx_download', { ...properties, destination: url.hostname || 'siemiany.info' });
    return;
  }

  if (/komoot\./i.test(url.hostname)) {
    trackUmami('route_open', { ...properties, destination: url.hostname });
    return;
  }

  if (link.matches('[data-map], .map-link') || /maps\.google\.|google\.[^/]+\/maps|mapy\.cz/i.test(url.href)) {
    trackUmami('map_open', { ...properties, destination: url.hostname });
    return;
  }

  if (url.origin === location.origin && /\.html$/i.test(url.pathname) && !link.closest('nav')) {
    trackUmami('related_content_click', {
      ...properties,
      destination_page: url.pathname.split('/').pop().replace(/\.html$/i, '')
    });
    return;
  }

  if (url.origin !== location.origin && !/youtube\.com|youtu\.be|youtube-nocookie\.com/i.test(url.hostname)) {
    trackUmami('outbound_click', { ...properties, destination: url.hostname });
  }
});

// Jeziorak: pokazujemy własne zdjęcia leśnego brzegu tuż po wprowadzeniu do charakteru jeziora.
if (analyticsPageName() === 'jeziorak') {
  const characterSection = document.querySelector('#charakter');
  if (characterSection && !document.querySelector('[data-jeziorak-shore-photos]')) {
    const photoBlock = document.createElement('div');
    photoBlock.className = 'map-grid';
    photoBlock.dataset.jeziorakShorePhotos = '';
    photoBlock.style.margin = '28px 0 44px';
    photoBlock.innerHTML = `
      <figure class="place-photo">
        <img alt="Naturalny brzeg Jezioraka w okolicy Siemian" decoding="async" height="1024" loading="lazy" src="BE1F13FA-E708-4556-864E-E773607D8D16.png" width="1536"/>
        <figcaption>Jeziorak od brzegu — zdjęcie własne.</figcaption>
      </figure>
      <figure class="place-photo">
        <img alt="Drzewa nad brzegiem Jezioraka w okolicy Siemian" decoding="async" height="1024" loading="lazy" src="C4A6653C-3FDB-45DF-9EF3-B57A0A4F821A.png" width="1536"/>
        <figcaption>Leśny brzeg Jezioraka — zdjęcie własne.</figcaption>
      </figure>`;
    characterSection.insertAdjacentElement('afterend', photoBlock);
  }
}
