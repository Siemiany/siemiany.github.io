// Responsive variants for the current photo set. Originals remain available as source files.
const responsivePhotos = {
  "assets/img/jeziorak-siemiany.webp": {
    "width": 1448,
    "height": 1086,
    "srcset": "assets/img/r/jeziorak-siemiany-480.webp 480w, assets/img/r/jeziorak-siemiany-800.webp 800w, assets/img/r/jeziorak-siemiany-1200.webp 1200w, assets/img/jeziorak-siemiany.webp 1448w"
  },
  "assets/img/jeziorak-brzeg-siemiany.webp": {
    "width": 1448,
    "height": 1086,
    "srcset": "assets/img/r/jeziorak-brzeg-siemiany-480.webp 480w, assets/img/r/jeziorak-brzeg-siemiany-800.webp 800w, assets/img/r/jeziorak-brzeg-siemiany-1200.webp 1200w, assets/img/jeziorak-brzeg-siemiany.webp 1448w"
  },
  "assets/img/jeziorak-lesny-brzeg-siemiany.webp": {
    "width": 1448,
    "height": 1086,
    "srcset": "assets/img/r/jeziorak-lesny-brzeg-siemiany-480.webp 480w, assets/img/r/jeziorak-lesny-brzeg-siemiany-800.webp 800w, assets/img/r/jeziorak-lesny-brzeg-siemiany-1200.webp 1200w, assets/img/jeziorak-lesny-brzeg-siemiany.webp 1448w"
  },
  "assets/img/siemiany-szopa.webp": {
    "width": 1448,
    "height": 1086,
    "srcset": "assets/img/r/siemiany-szopa-480.webp 480w, assets/img/r/siemiany-szopa-800.webp 800w, assets/img/r/siemiany-szopa-1200.webp 1200w, assets/img/siemiany-szopa.webp 1448w"
  },
  "assets/img/siemiany-bar-na-skarpie.webp": {
    "width": 1448,
    "height": 1086,
    "srcset": "assets/img/r/siemiany-bar-na-skarpie-480.webp 480w, assets/img/r/siemiany-bar-na-skarpie-800.webp 800w, assets/img/r/siemiany-bar-na-skarpie-1200.webp 1200w, assets/img/siemiany-bar-na-skarpie.webp 1448w"
  },
  "assets/img/susz-plac-zabaw.webp": {
    "width": 1448,
    "height": 1086,
    "srcset": "assets/img/r/susz-plac-zabaw-480.webp 480w, assets/img/r/susz-plac-zabaw-800.webp 800w, assets/img/r/susz-plac-zabaw-1200.webp 1200w, assets/img/susz-plac-zabaw.webp 1448w"
  },
  "assets/img/susz-plaza-miejska.webp": {
    "width": 1448,
    "height": 1086,
    "srcset": "assets/img/r/susz-plaza-miejska-480.webp 480w, assets/img/r/susz-plaza-miejska-800.webp 800w, assets/img/r/susz-plaza-miejska-1200.webp 1200w, assets/img/susz-plaza-miejska.webp 1448w"
  },
  "assets/img/wielka-zulawa-um-ilawa.webp": {
    "width": 1800,
    "height": 1200,
    "srcset": "assets/img/r/wielka-zulawa-um-ilawa-480.webp 480w, assets/img/r/wielka-zulawa-um-ilawa-800.webp 800w, assets/img/r/wielka-zulawa-um-ilawa-1200.webp 1200w, assets/img/wielka-zulawa-um-ilawa.webp 1800w"
  }
};
function applyResponsivePhotos(root = document) {
  root.querySelectorAll("img[src]").forEach(image => {
    const photo = responsivePhotos[image.getAttribute("src")];
    if (!photo) return;
    image.srcset = photo.srcset;
    image.sizes = "(max-width: 980px) 100vw, 50vw";
    image.width = photo.width;
    image.height = photo.height;
  });
}

(() => {
  const mainSrc = 'assets/img/domek-salon-glowne.jpeg';
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

  // Aktualna ocena Booking.com dla Zacisza Siemiany (sprawdzone 7.09.2026).
  if (currentPage === 'domek.html') {
    const bookingLabel = [...document.querySelectorAll('.trust-strip .mini')]
      .find(label => label.textContent.trim() === 'Booking.com');
    const bookingCard = bookingLabel?.parentElement;
    if (bookingCard) {
      const rating = bookingCard.querySelector('strong');
      const details = [...bookingCard.querySelectorAll(':scope > span')]
        .find(span => !span.classList.contains('mini'));
      if (rating) rating.textContent = '9,4 / 10';
      if (details) details.textContent = '15 opinii · stan 7.09.2026';
    }
  }

  // Susz: wykorzystujemy własne zdjęcia plaży i dużego placu zabaw dodane do repo.
  const suszPlaygroundSrc = 'assets/img/susz-plac-zabaw.webp';
  const suszBeachSrc = 'assets/img/susz-plaza-miejska.webp';

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
      if (caption) caption.textContent = 'Plaża miejska nad Jeziorem Suskim - zdjęcie własne.';

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
            <figcaption>Duży plac zabaw przy plaży w Suszu - zdjęcie własne.</figcaption>
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

  // Strona główna: nowe własne zdjęcie Jezioraka zastępuje dotychczasowe ujęcie trzcin
  // w kaflu „Jeziorak” pod nagłówkiem „Jedno duże jezioro. Dziesiątki małych odkryć.”.
  if (currentPage === '' || currentPage === 'index.html') {
    const jeziorakCardImage = document.querySelector('.card-grid .card[href="jeziorak.html"] img');
    if (jeziorakCardImage) {
      jeziorakCardImage.src = 'assets/img/jeziorak-siemiany.webp';
      jeziorakCardImage.removeAttribute('srcset');
      jeziorakCardImage.removeAttribute('sizes');
      jeziorakCardImage.removeAttribute('width');
      jeziorakCardImage.removeAttribute('height');
      jeziorakCardImage.alt = 'Jeziorak w Siemianach';
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
      'assets/img/siemiany-szopa.webp',
      'Szopa w Siemianach - ogródek restauracyjny',
      'Szopa w Siemianach - zdjęcie własne'
    );

    const skarpieCard = [...document.querySelectorAll('#jedzenie .eatery-grid .info-card')]
      .find(card => card.querySelector('h3')?.textContent.trim() === 'Bar na Skarpie');
    addRestaurantPhoto(
      skarpieCard,
      'assets/img/siemiany-bar-na-skarpie.webp',
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
      zulawaHero.src = 'assets/img/wielka-zulawa-um-ilawa.webp';
      zulawaHero.removeAttribute('srcset');
      zulawaHero.alt = 'Wielka Żuława na Jezioraku widziana z powietrza';
    }

    const zulawaCaption = document.querySelector('.page-hero-figure figcaption');
    if (zulawaCaption) zulawaCaption.innerHTML = 'Wielka Żuława na Jezioraku widziana z powietrza — źródło: <a href="https://miastoilawa.pl/" rel="noopener" target="_blank">Urząd Miasta Iławy ↗</a>.';

    const zulawaCredit = document.querySelector('#dzis .external-credit');
    if (zulawaCredit) zulawaCredit.innerHTML = 'Zdjęcie główne: Wielka Żuława na Jezioraku widziana z powietrza — źródło: <a href="https://miastoilawa.pl/" rel="noopener" target="_blank">Urząd Miasta Iławy ↗</a>.';

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = 'https://siemiany.info/assets/img/wielka-zulawa-um-ilawa.webp';
  }

  // Ujednolicamy podpisy zdjęć zewnętrznych na wszystkich podstronach.
  const setFigureCaption = (figure, html) => {
    if (!figure) return;
    let caption = figure.querySelector('figcaption');
    if (!caption) {
      caption = document.createElement('figcaption');
      figure.appendChild(caption);
    }
    caption.innerHTML = html;
  };

  const addTripCredit = (id, html) => {
    const body = document.querySelector(`.trip#${id} .body`);
    if (!body || body.querySelector('[data-image-credit]')) return;
    const credit = document.createElement('div');
    credit.className = 'external-credit';
    credit.dataset.imageCredit = '';
    credit.innerHTML = html;
    body.prepend(credit);
  };

  if (currentPage === 'ilawa.html') {
    const heroGrid = document.querySelector('.page-hero .page-hero-grid');
    const heroImage = heroGrid ? [...heroGrid.children].find(element =>
      element.tagName === 'IMG' && element.getAttribute('src') === 'assets/img/ilawa-maly-jeziorak-um.jpg'
    ) : null;
    if (heroImage) {
      const figure = document.createElement('figure');
      figure.className = 'page-hero-figure';
      heroImage.replaceWith(figure);
      figure.appendChild(heroImage);
      setFigureCaption(figure, 'Mały Jeziorak w Iławie — źródło: <a href="https://miastoilawa.pl/" rel="noopener" target="_blank">Urząd Miasta Iławy ↗</a>.');
    }
    const ilawaCaption = document.querySelector('#ilawa figure.place-photo figcaption');
    if (ilawaCaption) ilawaCaption.innerHTML = 'Mały Jeziorak w Iławie — źródło: <a href="https://miastoilawa.pl/" rel="noopener" target="_blank">Urząd Miasta Iławy ↗</a>.';
  }

  if (currentPage === 'okolica.html') {
    addTripCredit('ilawa', 'Zdjęcie: Mały Jeziorak w Iławie — źródło: <a href="https://miastoilawa.pl/" rel="noopener" target="_blank">Urząd Miasta Iławy ↗</a>.');
    addTripCredit('pol-dnia', 'Zdjęcie: ruiny zamku w Szymbarku — fot. 1bumer, CC BY-SA 4.0, <a href="https://commons.wikimedia.org/wiki/File:Szymbark,_zamek,_pierzeja_wschodnia.jpg" rel="noopener" target="_blank">Wikimedia Commons ↗</a>.');
    addTripCredit('kamieniec-card', 'Zdjęcie: pałac w Kamieńcu — fot. Bardrock, CC BY-SA 4.0, <a href="https://commons.wikimedia.org/wiki/File:Pa%C5%82ac_w_Kamie%C5%84cu_%282011%29.JPG" rel="noopener" target="_blank">Wikimedia Commons ↗</a>.');
    addTripCredit('kanal', 'Zdjęcie: pochylnia Buczyniec — fot. Wojciech Pędzich, CC BY 3.0, <a href="https://commons.wikimedia.org/wiki/File:Kana%C5%82_Elbl%C4%85ski,_pochylnia_Buczyniec,_statek_na_w%C3%B3zku.jpg" rel="noopener" target="_blank">Wikimedia Commons ↗</a>.');
    addTripCredit('dalej', 'Zdjęcie: zamek w Malborku — fot. Holly (Hhoskins), CC BY-SA 3.0 PL, <a href="https://commons.wikimedia.org/wiki/File:Malbork_Castle_from_the_c.jpg" rel="noopener" target="_blank">Wikimedia Commons ↗</a>.');
  }

  if (currentPage === 'siemiany.html') {
    const posterSources = [
      ['www.infoilawa.pl', 'InfoIława.pl'],
      ['d-nm.ppstatic.pl', 'Iława NaszeMiasto'],
      ['mazury.travel', 'Mazury.travel']
    ];
    document.querySelectorAll('#wydarzenia .poster-card').forEach(card => {
      if (card.querySelector('[data-image-credit]')) return;
      const imageSrc = card.querySelector('img')?.getAttribute('src') || '';
      const match = posterSources.find(([host]) => imageSrc.includes(host));
      if (!match) return;
      const credit = document.createElement('span');
      credit.className = 'mini';
      credit.dataset.imageCredit = '';
      credit.textContent = `Źródło plakatu: ${match[1]} ↗`;
      card.querySelector('img')?.insertAdjacentElement('afterend', credit);
    });
  }

  if (currentPage === 'januszewo.html') {
    const historicalFigure = document.querySelector('.page-hero-figure');
    setFigureCaption(historicalFigure, 'Pałac w Januszewie przed zniszczeniem — źródło: <a href="https://polska-org.pl/foto/8741/Palac_Legowo_nie_istnieje_Legowo_8741526.jpg" rel="noopener" target="_blank">Polska-org.pl ↗</a>; autor i licencja nieustalone.');
    const ruinsImage = [...document.querySelectorAll('figure img')].find(image =>
      (image.getAttribute('src') || '').includes('Januszewo%206.%20Ruiny%20pa%C5%82acu')
    );
    setFigureCaption(ruinsImage?.closest('figure'), 'Ruiny pałacu w Januszewie — fot. Andrzej Błaszczak, CC BY-SA 4.0, <a href="https://commons.wikimedia.org/wiki/File:Januszewo_6._Ruiny_pa%C5%82acu_z_XVIII_wieku.jpg" rel="noopener" target="_blank">Wikimedia Commons ↗</a>.');
  }

  if (currentPage === 'tajemnice.html') {
    const ruinsImage = [...document.querySelectorAll('figure img')].find(image =>
      (image.getAttribute('src') || '').includes('Januszewo%206.%20Ruiny%20pa%C5%82acu')
    );
    setFigureCaption(ruinsImage?.closest('figure'), 'Ruiny pałacu w Januszewie — fot. Andrzej Błaszczak, CC BY-SA 4.0, <a href="https://commons.wikimedia.org/wiki/File:Januszewo_6._Ruiny_pa%C5%82acu_z_XVIII_wieku.jpg" rel="noopener" target="_blank">Wikimedia Commons ↗</a>.');
  }

  if (currentPage === 'pan-samochodzik.html') {
    const nienackiHero = document.querySelector('.page-hero-figure');
    setFigureCaption(nienackiHero, 'Dom Zbigniewa Nienackiego w Jerzwałdzie — archiwalne zdjęcie z nieistniejącej już strony nienacki.art.pl; autor i licencja nieustalone.');
  }

  if (currentPage === 'kanal-elblaski.html') {
    const canalHero = document.querySelector('.page-hero-figure');
    setFigureCaption(canalHero, 'Pochylnia Buczyniec — statek na wózku. Fot. Wojciech Pędzich, CC BY 3.0, <a href="https://commons.wikimedia.org/wiki/File:Kana%C5%82_Elbl%C4%85ski,_pochylnia_Buczyniec,_statek_na_w%C3%B3zku.jpg" rel="noopener" target="_blank">Wikimedia Commons ↗</a>.');
  }

  if (currentPage === 'jeziorak.html') {
    const jeziorakHeroNote = document.querySelector('.page-hero .hero-note');
    if (jeziorakHeroNote) jeziorakHeroNote.innerHTML = 'Jeziorak widziany z powietrza — źródło: <a href="https://miastoilawa.pl/uploaded_images/1623448307_jeziorak1.jpg" rel="noopener" target="_blank">Urząd Miasta Iławy ↗</a>.';
  }

  applyResponsivePhotos();

  // Zachowujemy całą dotychczasową logikę serwisu bez zmian.
  // Ładujemy ją dopiero po przygotowaniu galerii, aby lightbox objął też nowe zdjęcia.
  const legacyScript = document.createElement('script');
  legacyScript.src = 'script-original.js';
  legacyScript.async = false;
  document.body.appendChild(legacyScript);
})();