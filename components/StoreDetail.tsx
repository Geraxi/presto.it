import { i18n } from '../hooks/useI18n.js';
import { renderAdCard } from './AdCard.js';

const PLACEHOLDER_IMG = '/images/placeholder.svg';

export const renderStoreDetail = (state, actions, storeId) => {
  const { stores, ads, currentUser } = state;
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
  
  const isOwner = currentUser && currentUser.id === store.ownerId;
  
  // Show ads that are associated with this store (by storeId) or belong to the store owner
  // If user is the owner, show all ads (approved, pending, rejected). Otherwise, show only approved
  const allStoreAds = ads.filter(ad => 
    ad.storeId === store.id || (ad.userId === store.ownerId && !ad.storeId)
  );
  
  const approvedAds = allStoreAds.filter(ad => ad.status === 'approved');
  const pendingAds = allStoreAds.filter(ad => ad.status === 'pending');
  const rejectedAds = allStoreAds.filter(ad => ad.status === 'rejected');
  
  // For public view, only show approved. For owner, show all grouped by status
  const storeAds = isOwner ? allStoreAds : approvedAds;

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
                ${isOwner ? `
                  <div class="mt-3 d-flex gap-2 justify-content-center justify-content-sm-start">
                    <button class="btn btn-sm btn-primary" id="manage-store-btn">
                      <i class="bi bi-gear me-1"></i>${i18n.t('manage_store')}
                    </button>
                  </div>
                ` : ''}
            </div>
        </div>
        ${isOwner ? `
        <div class="row g-3 mt-4 pt-4 border-top">
          <div class="col-md-3">
            <div class="text-center">
              <h3 class="h4 mb-0">${allStoreAds.length}</h3>
              <p class="text-muted small mb-0">${i18n.t('total_products')}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center">
              <h3 class="h4 mb-0 text-success">${approvedAds.length}</h3>
              <p class="text-muted small mb-0">${i18n.t('approved_ads')}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center">
              <h3 class="h4 mb-0 text-warning">${pendingAds.length}</h3>
              <p class="text-muted small mb-0">${i18n.t('pending_ads')}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center">
              <h3 class="h4 mb-0 text-danger">${rejectedAds.length}</h3>
              <p class="text-muted small mb-0">${i18n.t('rejected_ads')}</p>
            </div>
          </div>
        </div>
        ` : ''}
    </div>
  `;
  
  if (isOwner) {
    header.querySelector<HTMLButtonElement>('#manage-store-btn')!.onclick = () => {
      setView({ name: 'manage_store' });
    };
  }
  
  container.appendChild(header);

  const productSection = document.createElement('div');
  
  if (isOwner) {
    // For owners, show products grouped by status
    const sections = [
      { status: 'approved', ads: approvedAds, title: i18n.t('approved_ads'), color: 'success' },
      { status: 'pending', ads: pendingAds, title: i18n.t('pending_ads'), color: 'warning' },
      { status: 'rejected', ads: rejectedAds, title: i18n.t('rejected_ads'), color: 'danger' },
    ];
    
    sections.forEach(({ status, ads: statusAds, title, color }) => {
      if (statusAds.length === 0) return;
      
      const section = document.createElement('div');
      section.className = 'mb-5';
      section.innerHTML = `
        <h3 class="h5 fw-bold mb-3 text-${color}">
          <i class="bi bi-${status === 'approved' ? 'check-circle' : status === 'pending' ? 'clock' : 'x-circle'} me-2"></i>
          ${title} (${statusAds.length})
        </h3>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="ads-${status}"></div>
      `;
      
      const adGrid = section.querySelector(`#ads-${status}`)!;
      statusAds.forEach(ad => {
        adGrid.appendChild(renderAdCard(ad, state, actions));
      });
      
      productSection.appendChild(section);
    });
    
    // If no products at all, show message
    if (allStoreAds.length === 0) {
      productSection.innerHTML = `
        <h2 class="h2 fw-semibold mb-5 text-secondary text-center">${i18n.t('products_from').replace('{storeName}', store.name)}</h2>
        <p class="text-center text-muted py-5">${i18n.t('no_ads_found')}</p>
      `;
    }
  } else {
    // For public view, show only approved ads
    productSection.innerHTML = `<h2 class="h2 fw-semibold mb-5 text-secondary text-center">${i18n.t('products_from').replace('{storeName}', store.name)}</h2>`;

    if (storeAds.length > 0) {
      const adGrid = document.createElement('div');
      adGrid.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4';
      storeAds.forEach(ad => {
        adGrid.appendChild(renderAdCard(ad, state, actions));
      });
      productSection.appendChild(adGrid);
    } else {
      productSection.innerHTML += `<p class="text-center text-muted py-5">${i18n.t('no_ads_found')}</p>`;
    }
  }
  
  container.appendChild(productSection);
  return container;
};