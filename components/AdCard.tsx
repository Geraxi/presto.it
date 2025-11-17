import { i18n } from '../hooks/useI18n.js';
import { CategoryIcon } from './ui/Icons.js';

const PLACEHOLDER_IMG = '/images/placeholder.svg';

// Decide image purely from the title text
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

export const renderAdCard = (ad, state, actions) => {
  const { users } = state;
  const { setView, addToBasket } = actions;
  const seller = users.find(u => u.id === ad.userId);

  const card = document.createElement('div');
  card.className = 'col';
  card.style.cursor = 'pointer';

  // Prioritize uploaded images over title-based images
  const uploadedImage = ad.images && ad.images.length > 0 ? ad.images[0] : null;
  const fromTitle = !uploadedImage ? imageFromTitle(ad.title) : null;
  const displayedImage = uploadedImage || fromTitle || PLACEHOLDER_IMG;

  console.log(
    `[AdCard] Ad ID ${ad.id} - "${i18n.tContent(ad.title)}" -> ${displayedImage}`
  );

  card.innerHTML = `
    <div class="card h-100 shadow-sm transform-hover" style="border: 2px solid #1a9ba8 !important; border-radius: 8px; overflow: hidden;">
      <div class="position-relative" style="height: 200px; overflow: hidden;">
        <img 
          src="${displayedImage}" 
          class="card-img-top" 
          alt="${i18n.tContent(ad.title)}" 
          style="width: 100%; height: 100%; object-fit: cover; display: block;" 
          onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';this.style.display='block';"
        />
        <div class="position-absolute top-0 start-0 m-2">
          <span class="badge" style="background-color: #1a9ba8; color: white;">
            ${i18n.tCategory(ad.category)}
          </span>
        </div>
      </div>
      <div class="card-body d-flex flex-column" style="padding: 16px; min-height: 200px;">
        <div class="d-flex align-items-start gap-3 mb-2" style="min-height: 3.5rem;">
          <span id="cat-icon-container"></span>
          <h5 class="card-title fw-bold text-dark mb-0" style="font-size: 1.1rem; line-height: 1.3;">
            ${i18n.tContent(ad.title)}
          </h5>
        </div>
        <div class="mt-auto pt-2" style="padding-top: 10px;">
          <p class="fs-4 fw-semibold mb-2" style="color: #1a9ba8; font-size: 1.2rem; font-weight: 700;">
            ${i18n.formatPrice(ad.price)}
          </p>
          ${ad.status === 'approved' ? `
            <button class="btn btn-primary btn-sm w-100 mb-2" id="add-to-basket-${ad.id}" onclick="event.stopPropagation();">
              <i class="bi bi-cart-plus me-1"></i>${i18n.t('add_to_basket')}
            </button>
          ` : ''}
          <p class="card-text text-muted small mt-1 mb-0">
            ${i18n.t('posted_by')} <strong>${seller ? seller.name : i18n.t('unknown_user')}</strong>
          </p>
        </div>
      </div>
    </div>
    <style>
      .transform-hover {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .transform-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
      }
    </style>
  `;

  card
    .querySelector('#cat-icon-container')
    .append(
      CategoryIcon({
        category: ad.category,
        className: 'h-6 w-6 text-secondary opacity-75 mt-1 flex-shrink-0',
      })
    );

  card.onclick = () => setView({ name: 'ad_detail', adId: ad.id });

  // Add to basket button
  if (ad.status === 'approved') {
    const addToBasketBtn = card.querySelector(`#add-to-basket-${ad.id}`);
    if (addToBasketBtn) {
      addToBasketBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToBasket(ad.id);
        // Show feedback
        const btn = e.target as HTMLButtonElement;
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="bi bi-check me-1"></i>${i18n.t('added')}`;
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-success');
          btn.classList.add('btn-primary');
        }, 1500);
      });
    }
  }

  return card;
};
