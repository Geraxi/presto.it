import { i18n } from '../hooks/useI18n.js';
import { renderAdCard } from './AdCard.js';
import { asset } from '../utils.js';

export const renderHome = (state, actions) => {
  const { ads, searchTerm, selectedCategory, currentUser } = state;
  const { setView } = actions;

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
    <div class="position-relative d-flex align-items-center" style="background: url('${asset('public/images/hero-background.jpg')}') center center / cover; min-height: 60vh;">
      <div class="position-absolute-overlay" style="background-color: rgba(1, 48, 54, 0.6);"></div>
      <div class="container position-relative">
          <div class="row justify-content-center">
              <div class="col-lg-8 text-center">
                  <h1 class="text-white display-1 fw-bold">Presto.it</h1>
                  <p class="text-white-75 fs-4 mt-3">${i18n.t('hero_subtitle')}</p>
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
  homeDiv.innerHTML = hero;
  
  const mainContentContainer = document.createElement('div');
  mainContentContainer.className = 'container py-5';

  // 1. Add Revisor CTA if applicable
  if (currentUser?.isRevisor) {
    const pendingCount = ads.filter(ad => ad.status === 'pending').length;
    const revisorCta = document.createElement('div');
    revisorCta.className = 'my-4 p-4 bg-light rounded-3 text-center';
    revisorCta.innerHTML = `
      <h3 class="fw-bold text-secondary">${i18n.t('revisor_dashboard')}</h3>
      <p class="lead text-muted">${i18n.t('you_have_ads_to_review').replace('{count}', pendingCount.toString())}</p>
      <button class="btn btn-primary mt-2" id="go-to-dashboard-btn">
        <i class="bi bi-clipboard2-check-fill me-2"></i> ${i18n.t('go_to_dashboard')}
      </button>
    `;
    revisorCta.querySelector<HTMLButtonElement>('#go-to-dashboard-btn')!.onclick = () => setView({ name: 'revisor_dashboard' });
    mainContentContainer.appendChild(revisorCta);
  }

  // 2. Add Recent Ads Title
  const adsTitle = document.createElement('h2');
  adsTitle.className = 'h2 fw-semibold mb-5 text-secondary text-center';
  adsTitle.textContent = i18n.t('recent_ads');
  mainContentContainer.appendChild(adsTitle);

  // 3. Add Ad Grid or "Not Found" message
  if (filteredAds.length > 0) {
    const adGrid = document.createElement('div');
    adGrid.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4';
    filteredAds.forEach(ad => {
      adGrid.appendChild(renderAdCard(ad, state, actions));
    });
    mainContentContainer.appendChild(adGrid);
  } else {
    const noAdsMessage = document.createElement('p');
    noAdsMessage.className = 'text-center text-muted py-5';
    noAdsMessage.textContent = i18n.t('no_ads_found');
    mainContentContainer.appendChild(noAdsMessage);
  }

  homeDiv.appendChild(mainContentContainer);
  return homeDiv;
};