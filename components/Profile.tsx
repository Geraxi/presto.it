import { i18n } from '../hooks/useI18n.js';

export const renderProfile = (state, actions) => {
  const { currentUser, ads, stores } = state;
  const { setView, deleteAccount } = actions;

  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!currentUser) {
    container.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body text-center py-5">
          <h2 class="h4 text-muted">${i18n.t('login_required')}</h2>
          <p class="text-muted">${i18n.t('please_login_to_view_profile')}</p>
        </div>
      </div>
    `;
    return container;
  }

  const userAds = ads.filter(ad => ad.userId === currentUser.id);
  const userStore = stores.find(store => store.ownerId === currentUser.id);

  const card = document.createElement('div');
  card.className = 'card shadow-sm';
  card.innerHTML = `
    <div class="card-header bg-deep-teal text-white">
      <h2 class="h4 mb-0">${i18n.t('my_profile')}</h2>
    </div>
    <div class="card-body">
      <div class="row mb-4">
        <div class="col-md-6">
          <h5 class="fw-bold text-secondary mb-3">${i18n.t('personal_information')}</h5>
          <div class="mb-3">
            <label class="text-muted small">${i18n.t('name')}</label>
            <p class="mb-0 fw-semibold">${currentUser.name}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">${i18n.t('email')}</label>
            <p class="mb-0 fw-semibold">${currentUser.email}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">${i18n.t('account_type')}</label>
            <p class="mb-0">
              ${currentUser.isRevisor ? `<span class="badge bg-primary">${i18n.t('revisor')}</span>` : ''}
              ${userStore ? `<span class="badge bg-success ms-2">${i18n.t('seller')}</span>` : ''}
              ${!currentUser.isRevisor && !userStore ? `<span class="badge bg-secondary">${i18n.t('regular_user')}</span>` : ''}
            </p>
          </div>
        </div>
        <div class="col-md-6">
          <h5 class="fw-bold text-secondary mb-3">${i18n.t('statistics')}</h5>
          <div class="mb-3">
            <label class="text-muted small">${i18n.t('total_ads')}</label>
            <p class="mb-0 fw-semibold">${userAds.length}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">${i18n.t('approved_ads')}</label>
            <p class="mb-0 fw-semibold">${userAds.filter(ad => ad.status === 'approved').length}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">${i18n.t('pending_ads')}</label>
            <p class="mb-0 fw-semibold">${userAds.filter(ad => ad.status === 'pending').length}</p>
          </div>
          ${currentUser.isRevisor ? `
            <div class="mb-3">
              <label class="text-muted small">${i18n.t('total_earnings')}</label>
              <p class="mb-0 fw-semibold text-success">€${(currentUser.earnings || 0).toFixed(2)}</p>
            </div>
          ` : ''}
          ${userStore ? `
            <div class="mb-3">
              <label class="text-muted small">${i18n.t('store')}</label>
              <p class="mb-0">
                <button class="btn btn-success btn-sm" id="view-store-btn">
                  <i class="bi bi-shop me-1"></i>${i18n.t('view_my_store')}
                </button>
              </p>
            </div>
          ` : `
            <div class="mb-3">
              <button class="btn btn-success" id="create-store-btn">
                <i class="bi bi-shop me-2"></i>${i18n.t('open_your_store')}
              </button>
            </div>
          `}
          <div class="mb-3">
            <button class="btn btn-primary" id="view-listings-btn">
              <i class="bi bi-list-ul me-2"></i>${i18n.t('view_my_listings')}
            </button>
          </div>
        </div>
      </div>

      <div class="border-top pt-4 mt-4">
        <h5 class="fw-bold text-danger mb-3">${i18n.t('danger_zone')}</h5>
        <p class="text-muted small mb-3">${i18n.t('delete_account_warning')}</p>
        <button class="btn btn-danger" id="delete-account-btn">
          <i class="bi bi-trash me-2"></i>${i18n.t('delete_account')}
        </button>
      </div>
    </div>
  `;

  if (userStore) {
    card.querySelector<HTMLButtonElement>('#view-store-btn')!.onclick = () => {
      setView({ name: 'store_detail', storeId: userStore.id });
    };
  } else {
    card.querySelector<HTMLButtonElement>('#create-store-btn')!.onclick = () => {
      setView({ name: 'become_seller' });
    };
  }

  card.querySelector<HTMLButtonElement>('#view-listings-btn')!.onclick = () => {
    setView({ name: 'my_listings' });
  };

  card.querySelector<HTMLButtonElement>('#delete-account-btn')!.onclick = () => {
    if (confirm(i18n.t('confirm_delete_account'))) {
      deleteAccount();
    }
  };

  container.appendChild(card);
  return container;
};

