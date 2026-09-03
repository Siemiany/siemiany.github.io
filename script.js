(() => {
  const mainAlt = 'Jasny salon domku z kominkiem po remoncie';

  // taras.webp jest wspólnym zdjęciem domku w CTA na podstronach.
  // Po podmianie pliku aktualizujemy również tekst alternatywny.
  document.querySelectorAll('img[src="assets/img/taras.webp"]').forEach(image => {
    if (!image.closest('.gallery')) image.alt = mainAlt;
  });

  // Główne zdjęcie na stronie domku korzysta z taras-2.webp.
  const houseHero = document.querySelector('.page-hero img[src="assets/img/taras-2.webp"]');
  if (houseHero) houseHero.alt = mainAlt;

  const gallery = document.querySelector('.gallery');
  if (gallery) {
    // Zachowujemy dotychczasowe zdjęcie tarasu w galerii, mimo że taras.webp
    // staje się nowym zdjęciem głównym domku w pozostałych miejscach serwisu.
    const originalTerraceLink = [...gallery.querySelectorAll('a[data-lightbox]')]
      .find(link => link.getAttribute('href') === 'assets/img/taras.webp');

    if (originalTerraceLink) {
      originalTerraceLink.href = 'assets/img/taras-stary.webp';
      const terraceImage = originalTerraceLink.querySelector('img');
      if (terraceImage) {
        terraceImage.src = 'assets/img/taras-stary.webp';
        terraceImage.srcset = 'assets/img/r/taras-stary-800.webp 800w, assets/img/r/taras-stary-1200.webp 1200w, assets/img/taras-stary.webp 1800w';
      }
    }

    if (!gallery.querySelector('[data-new-house-photo]')) {
      const additions = [
        {
          className: 'gallery-wide',
          src: 'assets/img/domek-glowne.webp',
          alt: 'Jasny salon z kominkiem po remoncie',
          width: 900,
          height: 600,
          sizes: '(max-width: 760px) 100vw, 66vw'
        },
        {
          className: 'gallery-narrow',
          src: 'assets/img/domek-wejscie.webp',
          alt: 'Wejście do domku i zadaszony taras od strony ogrodu',
          width: 480,
          height: 320,
          sizes: '(max-width: 760px) 100vw, 33vw'
        },
        {
          className: 'gallery-full',
          src: 'assets/img/domek-ogrod-2026.webp',
          alt: 'Ogród i domek wśród zieleni',
          width: 480,
          height: 320,
          sizes: '100vw'
        }
      ];

      additions.forEach(photo => {
        const link = document.createElement('a');
        link.className = photo.className;
        link.dataset.lightbox = '';
        link.dataset.newHousePhoto = '';
        link.href = photo.src;

        const image = document.createElement('img');
        image.alt = photo.alt;
        image.src = photo.src;
        image.width = photo.width;
        image.height = photo.height;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.sizes = photo.sizes;

        link.appendChild(image);
        gallery.appendChild(link);
      });
    }
  }

  // Zachowujemy całą dotychczasową logikę serwisu bez zmian.
  // Ładujemy ją dopiero po przygotowaniu galerii, aby lightbox objął też nowe zdjęcia.
  const legacyScript = document.createElement('script');
  legacyScript.src = 'script-original.js';
  legacyScript.async = false;
  document.body.appendChild(legacyScript);
})();
