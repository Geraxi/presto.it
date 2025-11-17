import { i18n } from '../hooks/useI18n.js';
import { renderAdCard } from './AdCard.js';

export const renderHome = (state, actions) => {
  const { ads, searchTerm, selectedCategory } = state;

  const approvedAds = ads.filter(ad => ad.status === 'approved');

  const filteredAds = approvedAds
    .filter(ad => {
      const term = searchTerm.toLowerCase();
      const title = ad.title[i18n.language.code] || ad.title.it;
      const description = ad.description[i18n.language.code] || ad.description.it;
      return title.toLowerCase().includes(term) || description.toLowerCase().includes(term);
    })
    .filter(ad => {
      return selectedCategory === 'all' || ad.category === selectedCategory;
    });

  const homeDiv = document.createElement('div');

  const hero = `
    <div class="position-relative d-flex align-items-center justify-content-center hero-section" style="min-height: 60vh;">
      <div class="position-absolute hero-overlay" style="top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(1, 48, 54, 0.3), rgba(1, 48, 54, 0.5));"></div>
      <div class="container position-relative" style="z-index: 1;">
          <div class="row justify-content-center align-items-center">
              <div class="col-lg-8 col-md-10 text-center">
                  <div>
                    <h1 class="display-1 fw-bold mb-4" style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Presto.it</h1>
                    <p class="fs-4 mt-3" style="color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${i18n.t('hero_subtitle')}</p>
                  </div>
              </div>
          </div>
      </div>
      <style>
        .hero-section {
          background-image: url('/images/heroimg.png');
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
          background-color: #013036;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(1, 48, 54, 0.7) 0%, rgba(1, 48, 54, 0.4) 50%, transparent 100%);
          z-index: 0;
        }
      </style>
    </div>
  `;

  const adContainer = document.createElement('div');
  adContainer.className = 'container py-5';

  adContainer.innerHTML = `<h2 class="h2 fw-semibold mb-5 text-secondary text-center">${i18n.t('recent_ads')}</h2>`;
  
  if (filteredAds.length > 0) {
    const adGrid = document.createElement('div');
    adGrid.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4';
    filteredAds.forEach(ad => {
      adGrid.appendChild(renderAdCard(ad, state, actions));
    });
    adContainer.appendChild(adGrid);
  } else {
    adContainer.innerHTML += `<p class="text-center text-muted py-5">${i18n.t('no_ads_found')}</p>`;
  }

  homeDiv.innerHTML = hero;
  homeDiv.appendChild(adContainer);

  return homeDiv;
};