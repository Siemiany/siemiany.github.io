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

  // Susz: wykorzystujemy własne zdjęcia plaży i dużego placu zabaw dodane do repo.
  const suszPlaygroundSrc = 'assets/img/9CE80E4D-E41C-4C7D-83CD-77EBFA4B1AF6.png';
  const suszBeachSrc = 'assets/img/A7D37753-C878-4B94-9B4F-D1396AAEBA37.png';

  if (currentPage === 'susz.html') {
    const suszSection = document.querySelector('#susz');
    const firstPhoto = suszSection?.querySelector('figure.place-photo');

    if (firstPhoto) {
      const image = firstPhoto.querySelector('img');
      if (image) {
        image.src = suszBeachSrc;
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.alt = 'Plaża miejska nad Jeziorem Suskim';
        image.width = 1536;
        image.height = 1024;
      }

      const caption = firstPhoto.querySelector('figcaption');
      if (caption) caption.textContent = 'Plaża miejska nad Jeziorem Suskim — zdjęcie własne.';

      if (!suszSection.querySelector('[data-susz-family-feature]')) {
        const familyFeature = document.createElement('div');
        familyFeature.className = 'event-feature';
        familyFeature.dataset.suszFamilyFeature = '';
        familyFeature.innerHTML = `
          <div>
            <p class="kicker">Z dzieckiem</p>
            <h3>Plaża i duży plac zabaw</h3>
            <p>To właśnie dlatego Susz jest jednym z naszych najprostszych pomysłów na rodzinne pół dnia z Siemian. Kąpielisko, duży plac zabaw i promenada są blisko siebie, więc nie trzeba budować skomplikowanego planu ani dużo jeździć po mieście.</p>
            <p>Najlepiej połączyć zabawę i plażę ze spacerem nad Jeziorem Suskim, a później zostać w Suszu na obiad.</p>
          </div>
          <figure class="place-photo" style="margin:0">
            <img alt="Duży plac zabaw przy plaży w Suszu" decoding="async" height="1024" loading="lazy" src="${suszPlaygroundSrc}" width="1536"/>
            <figcaption>Duży plac zabaw przy plaży w Suszu — zdjęcie własne.</figcaption>
          </figure>`;
        firstPhoto.insertAdjacentElement('afterend', familyFeature);
      }
    }
  }

  // Strona główna: wizualnie wzmacniamy rodzinne polecenie „Plaża + Warmianka”.
  if (currentPage === '' || currentPage === 'index.html') {
    const suszRecommendation = [...document.querySelectorAll('.recommend.light-card')]
      .find(card => card.querySelector('h3')?.textContent.trim() === 'Plaża + Warmianka');

    if (suszRecommendation && !suszRecommendation.querySelector('[data-susz-home-photo]')) {
      const heading = suszRecommendation.querySelector('h3');
      const image = document.createElement('img');
      image.dataset.suszHomePhoto = '';
      image.src = suszPlaygroundSrc;
      image.alt = 'Duży plac zabaw przy plaży w Suszu';
      image.width = 1536;
      image.height = 1024;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.style.cssText = 'width:100%;height:240px;object-fit:cover;border-radius:16px;margin:16px 0 18px';
      heading?.insertAdjacentElement('afterend', image);
    }
  }

  // Okolica: kafel Susza pokazuje konkretnie plażę, o której mówi jego opis.
  if (currentPage === 'okolica.html') {
    const suszTripImage = document.querySelector('.trip#susz img');
    if (suszTripImage) {
      suszTripImage.src = suszBeachSrc;
      suszTripImage.removeAttribute('srcset');
      suszTripImage.removeAttribute('sizes');
      suszTripImage.alt = 'Plaża miejska nad Jeziorem Suskim';
      suszTripImage.width = 1536;
      suszTripImage.height = 1024;
    }
  }

  // Siemiany: pokazujemy własne zdjęcia bezpośrednio przy polecanych lokalach.
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
      image.width = 1536;
      image.height = 1024;
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
      'assets/img/B4825D86-09A7-4643-9B57-598410EC5210.png',
      'Szopa w Siemianach - ogródek restauracyjny',
      'Szopa w Siemianach - zdjęcie własne'
    );

    const skarpieCard = [...document.querySelectorAll('#jedzenie .eatery-grid .info-card')]
      .find(card => card.querySelector('h3')?.textContent.trim() === 'Bar na Skarpie');
    addRestaurantPhoto(
      skarpieCard,
      'assets/img/A75B004D-9A11-43A9-8B8D-3CAE549080F6.png',
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
