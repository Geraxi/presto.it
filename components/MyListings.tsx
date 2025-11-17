import { i18n } from '../hooks/useI18n.js';
import { CategoryIcon } from './ui/Icons.js';
import { renderAdCard } from './AdCard.js';

const PLACEHOLDER_IMG = '/images/placeholder.svg';

const imageFromTitle = (titleObj) => {
  const title = i18n.tContent(titleObj).toLowerCase();
  if (title.includes('iphone')) return '/images/iphone-15-pro.png';
  if (title.includes('divano') || title.includes('sofa') || title.includes('vintage')) return '/images/vintage-sofa.png';
  if (title.includes('fiat')) return '/images/fiat500.png';
  if (title.includes('dragon') || title.includes('manga')) return '/images/dragonball.png';
  if (title.includes('tapis') || title.includes('technogym')) return '/images/tapisroulant.png';
  if (title.includes('harry') || title.includes('potter')) return '/images/Harrypotter.png';
  if (title.includes('vinile') || title.includes('dark side') || title.includes('dark side of the moon')) return '/images/darkside.png';
  if (title.includes('sviluppatore') || title.includes('developer') || title.includes('web')) return '/images/web-developer.png';
  return null;
};

export const renderMyListings = (state, actions) => {
  const { currentUser, ads } = state;
  const { setView, deleteAd } = actions;

  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!currentUser) {
    container.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body text-center py-5">
          <h2 class="h4 text-muted">${i18n.t('login_required')}</h2>
          <p class="text-muted">${i18n.t('please_login_to_view_listings')}</p>
        </div>
      </div>
    `;
    return container;
  }

  const userAds = ads.filter(ad => ad.userId === currentUser.id);
  const approvedAds = userAds.filter(ad => ad.status === 'approved');
  const pendingAds = userAds.filter(ad => ad.status === 'pending');
  const rejectedAds = userAds.filter(ad => ad.status === 'rejected');

  const header = document.createElement('div');
  header.className = 'mb-4';
  header.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h3 fw-bold text-dark">${i18n.t('my_listings')}</h2>
      <button class="btn btn-primary" id="create-new-ad-btn">
        <i class="bi bi-plus-circle me-2"></i>${i18n.t('create_new_ad')}
      </button>
    </div>
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card bg-light">
          <div class="card-body text-center">
            <h3 class="h4 mb-0">${userAds.length}</h3>
            <p class="text-muted small mb-0">${i18n.t('total_ads')}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success bg-opacity-10">
          <div class="card-body text-center">
            <h3 class="h4 mb-0 text-success">${approvedAds.length}</h3>
            <p class="text-muted small mb-0">${i18n.t('approved_ads')}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning bg-opacity-10">
          <div class="card-body text-center">
            <h3 class="h4 mb-0 text-warning">${pendingAds.length}</h3>
            <p class="text-muted small mb-0">${i18n.t('pending_ads')}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger bg-opacity-10">
          <div class="card-body text-center">
            <h3 class="h4 mb-0 text-danger">${rejectedAds.length}</h3>
            <p class="text-muted small mb-0">${i18n.t('rejected_ads')}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  header.querySelector<HTMLButtonElement>('#create-new-ad-btn')!.onclick = () => {
    setView({ name: 'create_ad' });
  };

  container.appendChild(header);

  if (userAds.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'card shadow-sm';
    emptyState.innerHTML = `
      <div class="card-body text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
        <h3 class="h5 text-muted">${i18n.t('no_listings_yet')}</h3>
        <p class="text-muted">${i18n.t('create_your_first_listing')}</p>
        <button class="btn btn-primary mt-3" id="create-first-ad-btn">
          <i class="bi bi-plus-circle me-2"></i>${i18n.t('create_new_ad')}
        </button>
      </div>
    `;
    emptyState.querySelector<HTMLButtonElement>('#create-first-ad-btn')!.onclick = () => {
      setView({ name: 'create_ad' });
    };
    container.appendChild(emptyState);
    return container;
  }

  // Group ads by status
  const adsByStatus = [
    { status: 'approved', ads: approvedAds, title: i18n.t('approved_ads'), color: 'success' },
    { status: 'pending', ads: pendingAds, title: i18n.t('pending_ads'), color: 'warning' },
    { status: 'rejected', ads: rejectedAds, title: i18n.t('rejected_ads'), color: 'danger' },
  ];

  adsByStatus.forEach(({ status, ads: statusAds, title, color }) => {
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

    const adsContainer = section.querySelector(`#ads-${status}`)!;
    
    statusAds.forEach(ad => {
      const card = document.createElement('div');
      card.className = 'col';
      
      // Prioritize uploaded images over title-based images
      // Check if ad.images exists, has items, and the first item is a valid string
      const uploadedImage = (ad.images && ad.images.length > 0 && ad.images[0] && typeof ad.images[0] === 'string' && ad.images[0].trim().length > 0) 
        ? ad.images[0] 
        : null;
      const fromTitle = !uploadedImage ? imageFromTitle(ad.title) : null;
      const displayedImage = uploadedImage || fromTitle || PLACEHOLDER_IMG;
      
      // Debug: Log image info for troubleshooting
      if (uploadedImage) {
        console.log(`[MyListings] Ad ${ad.id} has uploaded image:`, uploadedImage.substring(0, 100) + '...');
      } else {
        console.log(`[MyListings] Ad ${ad.id} - images array:`, ad.images);
      }

      card.innerHTML = `
        <div class="card h-100 shadow-sm" style="border: 2px solid #1a9ba8 !important; border-radius: 8px; overflow: hidden;">
          <div class="position-relative" style="height: 200px; overflow: hidden;">
            <img 
              class="card-img-top listing-image" 
              alt="${i18n.tContent(ad.title)}" 
              style="width: 100%; height: 100%; object-fit: cover; display: block;" 
            />
            <div class="position-absolute top-0 start-0 m-2">
              <span class="badge bg-${color}">${i18n.tCategory(ad.category)}</span>
            </div>
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-${color}">${i18n.t(`status_${status}`)}</span>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-start gap-2 mb-2">
              <span id="cat-icon-${ad.id}"></span>
              <h5 class="card-title fw-bold text-dark mb-0 flex-grow-1" style="font-size: 1rem; line-height: 1.3;">
                ${i18n.tContent(ad.title)}
              </h5>
            </div>
            <p class="fs-5 fw-semibold mb-2" style="color: #1a9ba8; font-size: 1.1rem;">
              ${i18n.formatPrice(ad.price)}
            </p>
            <div class="mt-auto pt-2 d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary flex-grow-1" id="view-ad-${ad.id}">
                <i class="bi bi-eye me-1"></i>${i18n.t('view')}
              </button>
              <button class="btn btn-sm btn-outline-danger" id="delete-ad-${ad.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      // Set image src using setAttribute to avoid issues with long base64 strings in template literals
      const imgElement = card.querySelector<HTMLImageElement>('.listing-image')!;
      if (displayedImage) {
        // For base64 images, ensure they're properly formatted
        if (displayedImage.startsWith('data:')) {
          imgElement.src = displayedImage;
        } else {
          imgElement.src = displayedImage;
        }
        imgElement.onerror = function() {
          console.warn(`Failed to load image for ad ${ad.id}:`, displayedImage.substring(0, 50));
          this.onerror = null;
          this.src = PLACEHOLDER_IMG;
          this.style.display = 'block';
        };
      } else {
        imgElement.src = PLACEHOLDER_IMG;
      }

      card.querySelector<HTMLSpanElement>(`#cat-icon-${ad.id}`)!.append(
        CategoryIcon({
          category: ad.category,
          className: 'h-5 w-5 text-secondary opacity-75 mt-1 flex-shrink-0',
        })
      );

      card.querySelector<HTMLButtonElement>(`#view-ad-${ad.id}`)!.onclick = () => {
        setView({ name: 'ad_detail', adId: ad.id });
      };

      card.querySelector<HTMLButtonElement>(`#delete-ad-${ad.id}`)!.onclick = () => {
        if (confirm(i18n.t('confirm_delete_ad'))) {
          deleteAd(ad.id);
        }
      };

      adsContainer.appendChild(card);
    });

    container.appendChild(section);
  });

  return container;
};

