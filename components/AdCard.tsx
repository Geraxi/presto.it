import { i18n } from '../hooks/useI18n.js';
import { CategoryIcon } from './ui/Icons.js';
import { PLACEHOLDER_IMG } from '../constants.js';

export const renderAdCard = (ad, state, actions) => {
  const { users } = state;
  const { setView } = actions;
  const seller = users.find(u => u.id === ad.userId);

  const card = document.createElement('div');
  card.className = 'col';
  card.style.cursor = 'pointer';

  /**
   * Gets a corrected GitHub URL for ads with known filename mismatches in the data source.
   * @param ad The ad object to check.
   * @returns A string with the correct URL, or null if no override is needed.
   */
  const getCorrectedImageUrl = (ad) => {
    const title = i18n.tContent(ad.title).toLowerCase();
    const baseUrl = 'https://raw.githubusercontent.com/Geraxi/presto.it/main/public/images/';
    
    // Map titles to the correct filenames from the GitHub repo to fix data mismatches.
    if (title.includes('iphone')) return `${baseUrl}iphone-15-pro.png`;
    if (title.includes('divano') || title.includes('vintage')) return `${baseUrl}vintage-sofa.png`;
    if (title.includes('fiat')) return `${baseUrl}fiat500.png`;
    if (title.includes('dragon') || title.includes('manga')) return `${baseUrl}dragonball.png`;
    if (title.includes('technogym') || title.includes('roulant')) return `${baseUrl}tapisroulant.png`;
    if (title.includes('harry') || title.includes('potter')) return `${baseUrl}Harrypotter.png`;
    if (title.includes('dark side') || title.includes('vinile')) return `${baseUrl}darkside.png`;

    // For other ads, no override is necessary, so we can trust the original path.
    return null;
  };

  const correctedImage = getCorrectedImageUrl(ad);
  const originalImage = ad.watermarkedImages?.[0] || ad.images?.[0];
  const displayedImage = correctedImage || originalImage || PLACEHOLDER_IMG;

  card.innerHTML = `
    <div class="card h-100 shadow-sm border-light-subtle transform-hover">
      <div class="position-relative">
        <img src="${displayedImage}" class="card-img-top" alt="${i18n.tContent(ad.title)}" style="height: 12rem; object-fit: cover;" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';">
        <div class="position-absolute top-0 start-0 m-2">
          <span class="badge bg-primary">${i18n.tCategory(ad.category)}</span>
        </div>
      </div>
      <div class="card-body d-flex flex-column">
        <div class="d-flex align-items-start gap-3 mb-2" style="min-height: 3.5rem;">
          <span id="cat-icon-container"></span>
          <h5 class="card-title fw-bold text-dark">${i18n.tContent(ad.title)}</h5>
        </div>
        <div class="mt-auto pt-2">
            <p class="fs-4 fw-semibold text-secondary mb-0">${i18n.formatPrice(ad.price)}</p>
            <p class="card-text text-muted small mt-1 mb-0">${i18n.t('posted_by')} <strong>${seller ? seller.name : i18n.t('unknown_user')}</strong></p>
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

  card.querySelector('#cat-icon-container').append(CategoryIcon({ category: ad.category, className: "h-6 w-6 text-secondary opacity-75 mt-1 flex-shrink-0" }));
  card.onclick = () => setView({ name: 'ad_detail', adId: ad.id });

  return card;
};