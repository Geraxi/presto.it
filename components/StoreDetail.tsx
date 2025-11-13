import { i18n } from '../hooks/useI18n.js';
import { renderAdCard } from './AdCard.js';

const PLACEHOLDER_IMG = '/public/images/placeholder.svg';

export const renderStoreDetail = (state, actions, storeId) => {
  const { stores, ads } = state;
  const { setView } = actions;
  
  const store = stores.find(s => s.id === storeId);
  
  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!store) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h2 class="h2 fw-bold">${i18n.t('store_not_found')}</h2>
        <button class="btn btn-primary mt-4" id="back-btn">${i18n.t('back_to_home')}</button>
      </div>`;
    // Fix: Add type assertion to resolve 'onclick' property error.
    container.querySelector<HTMLButtonElement>('#back-btn')!.onclick = () => setView({ name: 'home' });
    return container;
  }
  
  const sellerAds = ads.filter(ad => ad.userId === store.ownerId && ad.status === 'approved');

  const header = document.createElement('div');
  header.className = 'card shadow-lg border-0 mb-5';
  header.innerHTML = `
    <div class="card-body p-5">
        <div class="row align-items-center g-4">
            <div class="col-sm-auto text-center">
                <img src="${store.logo}" alt="${store.name} logo" class="rounded-circle border border-4 border-primary" style="width: 128px; height: 128px; object-fit: cover;" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"/>
            </div>
            <div class="col-sm text-center text-sm-start">
                <h1 class="h1 fw-bold text-dark">${store.name}</h1>
                <p class="mt-2 text-muted">${store.description}</p>
            </div>
        </div>
    </div>
  `;
  container.appendChild(header);

  const productSection = document.createElement('div');
  productSection.innerHTML = `<h2 class="h2 fw-semibold mb-5 text-secondary text-center">${i18n.t('products_from').replace('{storeName}', store.name)}</h2>`;

  if (sellerAds.length > 0) {
    const adGrid = document.createElement('div');
    adGrid.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4';
    sellerAds.forEach(ad => {
      adGrid.appendChild(renderAdCard(ad, state, actions));
    });
    productSection.appendChild(adGrid);
  } else {
    productSection.innerHTML += `<p class="text-center text-muted py-5">${i18n.t('no_ads_found')}</p>`;
  }
  
  container.appendChild(productSection);
  return container;
};