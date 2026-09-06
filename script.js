(() => {
  const mainSrc = 'assets/img/zdjecie-glowne.jpeg';
  const mainAlt = 'Jasny salon domku z kominkiem po remoncie';

  // To samo, pełnej jakości zdjęcie salonu jest głównym zdjęciem domku
  // w CTA na podstronach oraz w hero strony domku.
  document.querySelectorAll('img[src="assets/img/taras.webp"]').forEach(image => {
    if (!image.closest('.gallery')) {
      image.src = mainSrc;
      image.removeAttribute('srcset');
      image.alt = mainAlt;
      image.width = 1536;
      image.height = 1024;
    }
  });

  const houseHero = document.querySelector('.page-hero img[src="assets/img/taras-2.webp"]');
  if (houseHero) {
    houseHero.src = mainSrc;
    houseHero.removeAttribute('srcset');
    houseHero.alt = mainAlt;
    houseHero.width = 1536;
    houseHero.height = 1024;
  }

  // W sekcji „Wygodnie po całym dniu nad wodą i w lesie.” pokazujemy sypialnię,
  // która lepiej wspiera komunikat o wygodzie i dobrych materacach po remoncie.
  // To nie zmienia zdjęcia sypialni istniejącego już w galerii.
  if (window.location.pathname.endsWith('domek.html')) {
    const comfortImage = document.querySelector('.split.reverse .visual img[src="assets/img/lazienka.webp"]');
    if (comfortImage) {
      comfortImage.src = 'assets/img/sypialnia.webp';
      comfortImage.srcset = 'assets/img/r/sypialnia-800.webp 800w, assets/img/r/sypialnia-1200.webp 1200w, assets/img/sypialnia.webp 1800w';
      comfortImage.alt = 'Sypialnia dwuosobowa z wygodnym łóżkiem po remoncie';
      comfortImage.width = 1800;
      comfortImage.height = 1208;
    }
  }

  const gallery = document.querySelector('.gallery');
  if (gallery) {
    // Zachowujemy dotychczasowe zdjęcie tarasu w galerii.
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
          src: mainSrc,
          alt: 'Jasny salon z kominkiem po remoncie',
          width: 1536,
          height: 1024,
          sizes: '(max-width: 760px) 100vw, 66vw'
        },
        {
          className: 'gallery-narrow',
          src: 'assets/img/domek-bok.jpeg',
          alt: 'Domek od boku, z wejściem i zadaszonym tarasem',
          width: 1536,
          height: 1024,
          sizes: '(max-width: 760px) 100vw, 33vw'
        },
        {
          className: 'gallery-full',
          src: 'assets/img/domek-tyl.jpeg',
          alt: 'Domek od strony ogrodu wśród zieleni',
          width: 1536,
          height: 1024,
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

    // Pełnoszeroki kafel nie może wystawać poza wysokość wiersza grida,
    // bo wtedy znika odstęp przed kolejnym zdjęciem.
    gallery.querySelectorAll('.gallery-full').forEach(link => {
      link.style.height = '100%';
    });
  }

  // Na stronach stricte redakcyjnych domek jest tylko dyskretnym przypomnieniem,
  // a nie drugim dużym blokiem sprzedażowym po artykule.
  const editorialStayPages = new Set([
    'bialy-chlop.html',
    'januszewo.html',
    'tajemnice.html',
    'pan-samochodzik.html',
    'wielka-zulawa.html'
  ]);
  const currentPage = window.location.pathname.split('/').pop();

  // Siemiany: pokazujemy własne zdjęcia bezpośrednio przy polecanych lokalach.
  // Pliki są małe i ładowane leniwie, więc nie obciążają wejścia na stronę.
  if (currentPage === 'siemiany.html') {
    const addRestaurantPhoto = (card, src, alt, caption) => {
      if (!card || card.querySelector('[data-restaurant-photo]')) return;

      const heading = card.querySelector('h3');
      if (!heading) return;

      const figure = document.createElement('figure');
      figure.className = 'place-photo';
      figure.dataset.restaurantPhoto = '';
      figure.style.margin = '18px 0 20px';

      const image = document.createElement('img');
      image.src = src;
      image.alt = alt;
      image.width = 400;
      image.height = 300;
      image.loading = 'lazy';
      image.decoding = 'async';

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = caption;

      figure.append(image, figcaption);
      heading.insertAdjacentElement('afterend', figure);
    };

    const szopaCard = [...document.querySelectorAll('#jedzenie .recommend')]
      .find(card => card.querySelector('h3')?.textContent.trim() === 'Szopa');
    addRestaurantPhoto(
      szopaCard,
      'assets/img/szopa-siemiany.webp',
      'Szopa w Siemianach - ogródek restauracyjny',
      'Szopa w Siemianach - zdjęcie własne'
    );

    const skarpieCard = [...document.querySelectorAll('#jedzenie .eatery-grid .info-card')]
      .find(card => card.querySelector('h3')?.textContent.trim() === 'Bar na Skarpie');
    addRestaurantPhoto(
      skarpieCard,
      'assets/img/bar-na-skarpie-siemiany.webp',
      'Bar na Skarpie w Siemianach - taras z widokiem na Jeziorak',
      'Bar na Skarpie - widok na Jeziorak, zdjęcie własne'
    );
  }

  if (editorialStayPages.has(currentPage)) {
    const stayCta = document.querySelector('.guide-stay-cta');
    if (stayCta) {
      stayCta.className = 'section compact';
      stayCta.innerHTML = '<div class="wrap"><a class="place-link" href="domek.html"><strong>Chcesz poznawać tę okolicę z Siemian? →</strong><span>Nasz domek stoi 200 m od Jezioraka i 100 m od lasu. Pełny opis, zdjęcia i wyposażenie są na stronie domku.</span></a></div>';
    }
  }

  // Wielka Żuława: używamy zdjęcia UM dodanego do repo zamiast starego hero.
  if (window.location.pathname.endsWith('wielka-zulawa.html')) {
    const zulawaHero = document.querySelector('.page-hero-figure img');
    if (zulawaHero) {
      zulawaHero.src = 'assets/img/WielkaZulawa-UM-Iława.jpg';
      zulawaHero.removeAttribute('srcset');
      zulawaHero.alt = 'Wielka Żuława na Jezioraku widziana z powietrza';
    }

    const zulawaCaption = document.querySelector('.page-hero-figure figcaption');
    if (zulawaCaption) zulawaCaption.textContent = 'UM';

    const zulawaCredit = document.querySelector('#dzis .external-credit');
    if (zulawaCredit) zulawaCredit.textContent = 'Zdjęcie główne: UM.';

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = 'https://siemiany.info/assets/img/WielkaZulawa-UM-Iława.jpg';
  }

  // Zachowujemy całą dotychczasową logikę serwisu bez zmian.
  // Ładujemy ją dopiero po przygotowaniu galerii, aby lightbox objął też nowe zdjęcia.
  const legacyScript = document.createElement('script');
  legacyScript.src = 'script-original.js';
  legacyScript.async = false;
  document.body.appendChild(legacyScript);
})();
