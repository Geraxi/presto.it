import { i18n } from '../hooks/useI18n.js';
import { renderAdCard } from './AdCard.js';

const PLACEHOLDER_IMG = '/images/placeholder.svg';

export const renderManageStore = (state, actions) => {
  const { currentUser, stores, ads } = state;
  const { setView, updateStore } = actions;

  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!currentUser || !currentUser.storeId) {
    container.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body text-center py-5">
          <h2 class="h4 text-muted">${i18n.t('no_store_to_manage')}</h2>
          <p class="text-muted">${i18n.t('create_store_first')}</p>
          <button class="btn btn-primary mt-3" id="create-store-btn">${i18n.t('open_your_store')}</button>
        </div>
      </div>
    `;
    container.querySelector<HTMLButtonElement>('#create-store-btn')!.onclick = () => {
      setView({ name: 'become_seller' });
    };
    return container;
  }

  const store = stores.find(s => s.id === currentUser.storeId);
  if (!store) {
    container.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body text-center py-5">
          <h2 class="h4 text-muted">${i18n.t('store_not_found')}</h2>
          <button class="btn btn-primary mt-3" id="back-btn">${i18n.t('back_to_home')}</button>
        </div>
      </div>
    `;
    container.querySelector<HTMLButtonElement>('#back-btn')!.onclick = () => {
      setView({ name: 'home' });
    };
    return container;
  }

  const storeAds = ads.filter(ad => 
    ad.storeId === store.id || (ad.userId === store.ownerId && !ad.storeId)
  );
  const approvedAds = storeAds.filter(ad => ad.status === 'approved');
  const pendingAds = storeAds.filter(ad => ad.status === 'pending');
  const rejectedAds = storeAds.filter(ad => ad.status === 'rejected');

  const card = document.createElement('div');
  card.className = 'card shadow-sm';
  card.innerHTML = `
    <div class="card-header bg-deep-teal text-white">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="h4 mb-0">${i18n.t('manage_store')}</h2>
        <button class="btn btn-sm btn-light" id="view-store-btn">
          <i class="bi bi-eye me-1"></i>${i18n.t('view_store')}
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row mb-4">
        <div class="col-md-6">
          <h5 class="fw-bold text-secondary mb-3">${i18n.t('store_information')}</h5>
          <form id="store-edit-form" class="row g-3">
            <div class="col-12">
              <label for="edit-store-name" class="form-label">${i18n.t('store_name')}</label>
              <input type="text" class="form-control" id="edit-store-name" value="${store.name}" required>
            </div>
            <div class="col-12">
              <label for="edit-store-description" class="form-label">${i18n.t('store_description')}</label>
              <textarea class="form-control" id="edit-store-description" rows="4" required>${store.description}</textarea>
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save me-1"></i>${i18n.t('save_changes')}
              </button>
            </div>
          </form>
        </div>
        <div class="col-md-6">
          <h5 class="fw-bold text-secondary mb-3">${i18n.t('store_statistics')}</h5>
          <div class="row g-3">
            <div class="col-6">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="h4 mb-0">${storeAds.length}</h3>
                  <p class="text-muted small mb-0">${i18n.t('total_products')}</p>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card bg-success bg-opacity-10">
                <div class="card-body text-center">
                  <h3 class="h4 mb-0 text-success">${approvedAds.length}</h3>
                  <p class="text-muted small mb-0">${i18n.t('approved_ads')}</p>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card bg-warning bg-opacity-10">
                <div class="card-body text-center">
                  <h3 class="h4 mb-0 text-warning">${pendingAds.length}</h3>
                  <p class="text-muted small mb-0">${i18n.t('pending_ads')}</p>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card bg-danger bg-opacity-10">
                <div class="card-body text-center">
                  <h3 class="h4 mb-0 text-danger">${rejectedAds.length}</h3>
                  <p class="text-muted small mb-0">${i18n.t('rejected_ads')}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-outline-primary w-100" id="view-listings-btn">
              <i class="bi bi-list-ul me-1"></i>${i18n.t('manage_products')}
            </button>
          </div>
        </div>
      </div>

      <div class="border-top pt-4 mt-4">
        <h5 class="fw-bold text-secondary mb-3">${i18n.t('store_products')}</h5>
        ${storeAds.length > 0 ? `
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="store-products-grid"></div>
        ` : `
          <p class="text-center text-muted py-5">${i18n.t('no_products_in_store')}</p>
          <div class="text-center">
            <button class="btn btn-primary" id="add-product-btn">
              <i class="bi bi-plus-circle me-1"></i>${i18n.t('add_product')}
            </button>
          </div>
        `}
      </div>
    </div>
  `;

  // Handle form submission
  card.querySelector<HTMLFormElement>('#store-edit-form')!.onsubmit = (e) => {
    e.preventDefault();
    const storeName = (card.querySelector('#edit-store-name') as HTMLInputElement).value;
    const storeDescription = (card.querySelector('#edit-store-description') as HTMLTextAreaElement).value;
    if (storeName && storeDescription) {
      updateStore(store.id, storeName, storeDescription);
      alert(i18n.t('store_updated_success'));
    }
  };

  // Handle buttons
  card.querySelector<HTMLButtonElement>('#view-store-btn')!.onclick = () => {
    setView({ name: 'store_detail', storeId: store.id });
  };

  card.querySelector<HTMLButtonElement>('#view-listings-btn')!.onclick = () => {
    setView({ name: 'my_listings' });
  };

  const addProductBtn = card.querySelector<HTMLButtonElement>('#add-product-btn');
  if (addProductBtn) {
    addProductBtn.onclick = () => {
      setView({ name: 'create_ad' });
    };
  }

  // Add products grid if there are products
  if (storeAds.length > 0) {
    const productsGrid = card.querySelector('#store-products-grid')!;
    storeAds.forEach(ad => {
      productsGrid.appendChild(renderAdCard(ad, state, actions));
    });
  }

  container.appendChild(card);
  return container;
};

