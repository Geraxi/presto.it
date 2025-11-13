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
    <div class="position-relative d-flex align-items-center" style="background: url('/public/images/hero-background.jpg') center center / cover; min-height: 60vh;">
      <div class="position-absolute-overlay" style="background: linear-gradient(to right, rgba(1, 48, 54, 0.7), rgba(1, 48, 54, 0.1));"></div>
      <div class="container position-relative">
          <div class="row">
              <div class="col-lg-7 col-md-8">
                  <div class="text-start">
                    <h1 class="text-white display-1 fw-bold">Presto.it</h1>
                    <p class="text-white-75 fs-4 mt-3">${i18n.t('hero_subtitle')}</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
    <style>
        .position-absolute-overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
    </style>
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