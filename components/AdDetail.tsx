import { i18n } from '../hooks/useI18n.js';
import { CategoryIcon } from './ui/Icons.js';

const PLACEHOLDER_IMG = '/images/placeholder.svg';

// Normalize image paths to ensure they load from /images/
const normalizeImagePath = (path: string): string => {
  if (!path || typeof path !== 'string') return PLACEHOLDER_IMG;
  
  // If it's a base64 data URL, return as-is
  if (path.startsWith('data:')) return path;
  
  // If it's already absolute (http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  // Remove any '/public' prefix
  if (path.startsWith('/public/')) {
    path = path.replace('/public/', '/');
  } else if (path.startsWith('/public')) {
    path = path.replace('/public', '');
  }
  
  // Remove any '/components/images/' prefix
  if (path.startsWith('/components/images/')) {
    path = path.replace('/components/images/', '/images/');
  }
  
  // Ensure it starts with /images/
  if (!path.startsWith('/images/')) {
    const filename = path.split('/').pop();
    return `/images/${filename}`;
  }
  
  return path;
};

export const renderAdDetail = (state, actions, adId) => {
  const { ads, users, stores } = state;
  const { setView, addToBasket } = actions;
  
  const ad = ads.find(a => a.id === adId);
  const user = ad ? users.find(u => u.id === ad.userId) : null;
  const store = user?.storeId ? stores.find(s => s.id === user.storeId) : null;

  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!ad || !user) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h2 class="h2 fw-bold">${i18n.t('ad_not_found')}</h2>
        <button class="btn btn-primary mt-4" id="back-btn">${i18n.t('back_to_home')}</button>
      </div>`;
    // Fix: Add type assertion to resolve 'onclick' property error.
    container.querySelector<HTMLButtonElement>('#back-btn')!.onclick = () => setView({ name: 'home' });
    return container;
  }

  const images = (ad.watermarkedImages || ad.images || []).filter(img => img && img.trim() !== '');
  const carouselId = `adCarousel-${ad.id}`;

  // If no images, use placeholder
  const displayImages = images.length > 0 ? images : [PLACEHOLDER_IMG];

  const adDetailCard = document.createElement('div');
  adDetailCard.className = 'card shadow-xl border-0 p-3 p-md-4';
  adDetailCard.innerHTML = `
    <div class="card-body">
      <div class="mb-4">
        <button class="btn btn-link text-decoration-none p-0" id="back-btn-main">
          &larr; ${i18n.t('back_to_home')}
        </button>
      </div>
      <div class="row g-4">
        <div class="col-md-6">
          <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner rounded-3 shadow-sm">
              ${displayImages.map((img, index) => {
                const normalizedImg = normalizeImagePath(img);
                return `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                  <img src="${normalizedImg}" class="d-block w-100" alt="${i18n.tContent(ad.title)}" style="aspect-ratio: 1/1; object-fit: cover;" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';">
                </div>
              `;
              }).join('')}
            </div>
            ${displayImages.length > 1 ? `
              <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="flex-shrink-0 bg-light p-3 rounded-circle" id="cat-icon-container"></div>
            <div>
              <span class="text-secondary fw-semibold">${i18n.tCategory(ad.category)}</span>
              <h1 class="h2 fw-bold text-dark lh-tight mb-0">${i18n.tContent(ad.title)}</h1>
            </div>
          </div>
          <p class="display-5 text-secondary mt-4 mb-4">${i18n.formatPrice(ad.price)}</p>
          ${ad.status === 'approved' ? `
            <div class="mb-4">
              <button class="btn btn-primary btn-lg w-100" id="add-to-basket-detail-${ad.id}">
                <i class="bi bi-cart-plus me-2"></i>${i18n.t('add_to_basket')}
              </button>
            </div>
          ` : ''}
          <div class="border-top pt-4">
            <h5 class="fw-semibold mb-2 text-dark">${i18n.t('description')}</h5>
            <p class="text-dark" style="white-space: pre-wrap;">${i18n.tContent(ad.description)}</p>
          </div>
          <div class="mt-4 border-top pt-4">
            <h5 class="fw-semibold mb-3 text-dark">${i18n.t('seller_info')}</h5>
            ${store ? `
              <div class="d-flex align-items-center gap-3 bg-light p-3 rounded-3">
                <img src="${normalizeImagePath(store.logo)}" alt="${store.name} logo" class="rounded-circle" style="width: 64px; height: 64px; object-fit: cover;" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"/>
                <div>
                  <p class="fw-bold text-secondary mb-0">${store.name}</p>
                  <button id="visit-store-btn" class="btn btn-sm btn-primary mt-1">
                    ${i18n.t('visit_store')}
                  </button>
                </div>
              </div>
            ` : `
              <p class="text-sm text-dark-emphasis">${i18n.t('posted_by')}: <span class="fw-semibold text-dark">${user.name}</span></p>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Fix: Add type assertions to resolve 'onclick' property errors.
  adDetailCard.querySelector<HTMLButtonElement>('#back-btn-main')!.onclick = () => setView({ name: 'home' });
  adDetailCard.querySelector<HTMLDivElement>('#cat-icon-container')!.append(CategoryIcon({ category: ad.category, className: 'h-8 w-8 text-deep-teal' }));
  if (store) {
      adDetailCard.querySelector<HTMLButtonElement>('#visit-store-btn')!.onclick = () => setView({ name: 'store_detail', storeId: store.id });
  }
  if (ad.status === 'approved') {
    const addToBasketBtn = adDetailCard.querySelector<HTMLButtonElement>(`#add-to-basket-detail-${ad.id}`);
    if (addToBasketBtn) {
      addToBasketBtn.onclick = () => {
        addToBasket(ad.id);
        // Show feedback
        const originalText = addToBasketBtn.innerHTML;
        addToBasketBtn.innerHTML = `<i class="bi bi-check me-2"></i>${i18n.t('added')}`;
        addToBasketBtn.classList.remove('btn-primary');
        addToBasketBtn.classList.add('btn-success');
        setTimeout(() => {
          addToBasketBtn.innerHTML = originalText;
          addToBasketBtn.classList.remove('btn-success');
          addToBasketBtn.classList.add('btn-primary');
        }, 1500);
      };
    }
  }

  container.append(adDetailCard);
  return container;
};