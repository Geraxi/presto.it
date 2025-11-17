import { i18n } from '../hooks/useI18n.js';
import { analyzeImageSafety, watermarkImage, analyzeAdText } from '../services/geminiService.js';
import { Spinner } from './ui/Spinner.js';

const PLACEHOLDER_IMG = '/images/placeholder.svg';

const renderAdReviewCard = (ad, state, actions) => {
  const { users, currentUser } = state;
  const { updateAd } = actions;
  const user = users.find(u => u.id === ad.userId);
  const card = document.createElement('div');
  card.className = 'card shadow-sm mb-3 border-start border-4 border-warning';
  card.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center mb-2">
            <span class="badge bg-warning text-dark me-2">
              <i class="bi bi-wallet me-1"></i>${i18n.t('earn_reviewing')}
            </span>
            <span class="badge bg-success bg-opacity-10 text-success">+€0.50</span>
          </div>
          <h5 class="card-title fw-bold mb-1">${i18n.tContent(ad.title)}</h5>
          <p class="card-subtitle text-muted mb-0">${i18n.t('by_user').replace('{user}', user?.name || i18n.t('unknown_user'))} - ${i18n.formatPrice(ad.price)}</p>
        </div>
        <div class="d-flex gap-2" id="action-buttons">
          <button class="btn btn-success btn-sm" id="approve-btn">
            <i class="bi bi-check-circle me-1"></i>${i18n.t('approve')}
          </button>
          <button class="btn btn-danger btn-sm" id="reject-btn">
            <i class="bi bi-x-circle me-1"></i>${i18n.t('reject')}
          </button>
        </div>
      </div>
      <p class="mt-2">${i18n.tContent(ad.description)}</p>
      <div class="mt-4 border-top pt-3">
        <h6 class="fw-bold text-secondary">${i18n.t('content_analysis')}</h6>
        <div class="d-grid gap-2 d-md-flex">
          <button class="btn btn-outline-secondary btn-sm" id="analyze-text-btn">${i18n.t('analyze_text')}</button>
        </div>
        <div id="text-analysis-result" class="mt-2"></div>
        <div class="row g-3 mt-2">
          ${ad.images.map((img, index) => `
            <div class="col-6 col-md-3">
              <img src="${img}" class="img-fluid rounded" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"/>
              <button class="btn btn-outline-secondary btn-sm w-100 mt-2" data-img-index="${index}">${i18n.t('analyze_image')}</button>
              <div class="mt-1" id="img-analysis-result-${index}"></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Fix: Add type assertion to resolve property access errors.
  const textBtn = card.querySelector<HTMLButtonElement>('#analyze-text-btn')!;
  textBtn.onclick = async () => {
    textBtn.disabled = true;
    textBtn.innerHTML = '';
    textBtn.append(Spinner({size: 'sm'}));
    try {
      const result = await analyzeAdText(i18n.tContent(ad.title), i18n.tContent(ad.description));
      const resultEl = card.querySelector('#text-analysis-result')!;
      resultEl.innerHTML = `
        <div class="alert alert-${result.safe ? 'success' : 'danger'} small p-2">
          <strong>${result.safe ? i18n.t('safe') : i18n.t('not_safe')}</strong>: ${result.reason}
          <div class="mt-1">
            ${result.tags.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('') || i18n.t('not_available')}
          </div>
        </div>`;
    } catch (e) {
       card.querySelector('#text-analysis-result')!.innerHTML = `<div class="alert alert-warning small p-2">${i18n.t('analysis_failed')}</div>`;
    } finally {
      textBtn.innerHTML = i18n.t('analyze_text');
      textBtn.disabled = false;
    }
  };

  // Fix: Add type assertion to resolve property access errors.
  card.querySelectorAll<HTMLButtonElement>('button[data-img-index]').forEach(btn => {
    btn.onclick = async () => {
      const index = btn.dataset.imgIndex!;
      btn.disabled = true;
      btn.innerHTML = '';
      btn.append(Spinner({size: 'sm'}));
      try {
        const img = ad.images[parseInt(index, 10)];
        const [header, base64] = img.split(',');
        const mimeType = header.replace('data:', '').replace(';base64', '');
        const result = await analyzeImageSafety(base64, mimeType);
        const resultEl = card.querySelector(`#img-analysis-result-${index}`)!;
         resultEl.innerHTML = `
        <div class="alert alert-${result.safe ? 'success' : 'danger'} small p-2">
          <strong>${result.safe ? i18n.t('safe') : i18n.t('not_safe')}</strong>
          <div class="mt-1">
             ${result.tags.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('') || i18n.t('not_available')}
          </div>
        </div>`;
      } catch (e) {
        card.querySelector(`#img-analysis-result-${index}`)!.innerHTML = `<div class="alert alert-warning small p-2">${i18n.t('analysis_failed')}</div>`;
      } finally {
        btn.innerHTML = i18n.t('analyze_image');
        btn.disabled = false;
      }
    };
  });
  
  card.querySelector<HTMLButtonElement>('#reject-btn')!.onclick = () => {
    updateAd({ ...ad, status: 'rejected' });
    // Show earnings notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
      <strong>${i18n.t('earnings_added')}</strong> ${i18n.t('earned_review')}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };
  
  card.querySelector<HTMLButtonElement>('#approve-btn')!.onclick = async (e) => {
    // Fix: Cast event target to HTMLButtonElement to resolve property access errors.
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    btn.innerHTML = '';
    btn.append(Spinner({size: 'sm'}));
    
    try {
      const watermarked = await Promise.all(ad.images.map(async (img) => {
        const [header, base64] = img.split(',');
        const mimeType = header.replace('data:', '').replace(';base64', '');
        return `data:${mimeType};base64,${await watermarkImage(base64, mimeType)}`;
      }));
      updateAd({ ...ad, status: 'approved', watermarkedImages: watermarked });
      // Show earnings notification
      const notification = document.createElement('div');
      notification.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
      notification.style.zIndex = '9999';
      notification.innerHTML = `
        <strong>${i18n.t('earnings_added')}</strong> ${i18n.t('earned_review')}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      alert(i18n.t('watermark_preview_error'));
      btn.disabled = false;
      btn.innerHTML = i18n.t('approve');
    }
  };

  return card;
};


export const renderRevisorDashboard = (state, actions) => {
  const { ads, currentUser } = state;
  const { setView } = actions;
  
  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!currentUser?.isRevisor) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h2 class="h2 fw-bold">${i18n.t('access_denied')}</h2>
        <p>${i18n.t('revisor_only_section')}</p>
        <button class="btn btn-primary mt-4" id="back-btn">${i18n.t('back_to_home')}</button>
      </div>`;
    // Fix: Add type assertion to resolve 'onclick' property error.
    container.querySelector<HTMLButtonElement>('#back-btn')!.onclick = () => setView({ name: 'home' });
    return container;
  }
  
  // Calculate earnings
  const totalEarnings = currentUser.earnings || 0;
  const reviewedAds = ads.filter(ad => ad.status === 'approved' || ad.status === 'rejected');
  const totalReviewed = reviewedAds.length;
  
  container.innerHTML = `
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex align-items-center mb-3">
          <i class="bi bi-person-badge me-2" style="font-size: 2rem; color: var(--bs-primary);"></i>
          <h2 class="h2 fw-bold text-dark mb-0">${i18n.t('revisor_dashboard')}</h2>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <div class="card shadow-sm border-0 border-top border-4 border-success">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="card-title text-muted mb-0">${i18n.t('total_earnings')}</h5>
              <i class="bi bi-wallet" style="font-size: 2rem; color: var(--bs-success);"></i>
            </div>
            <h2 class="h2 fw-bold text-success mb-2">€${totalEarnings.toFixed(2)}</h2>
            <div class="d-flex align-items-center">
              <span class="badge bg-success bg-opacity-10 text-success me-2">+€0.50</span>
              <small class="text-muted">${i18n.t('per_review')}</small>
            </div>
            ${totalEarnings > 0 ? `
              <div class="mt-3 pt-3 border-top">
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-success" role="progressbar" style="width: ${Math.min((totalEarnings / 100) * 100, 100)}%" aria-valuenow="${totalEarnings}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small class="text-muted">${i18n.t('earnings_progress')}</small>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card shadow-sm border-0 border-top border-4 border-primary">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="card-title text-muted mb-0">${i18n.t('total_reviews')}</h5>
              <i class="bi bi-bar-chart" style="font-size: 2rem; color: var(--bs-primary);"></i>
            </div>
            <h2 class="h2 fw-bold text-primary mb-2">${totalReviewed}</h2>
            <div class="d-flex align-items-center">
              <span class="badge bg-primary bg-opacity-10 text-primary me-2">${i18n.t('completed')}</span>
              <small class="text-muted">${i18n.t('ads_reviewed')}</small>
            </div>
            ${totalReviewed > 0 ? `
              <div class="mt-3 pt-3 border-top">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">${i18n.t('potential_earnings')}</small>
                  <strong class="text-success">€${(totalReviewed * 0.5).toFixed(2)}</strong>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-12">
        <div class="alert alert-info border-0 shadow-sm d-flex align-items-center">
          <i class="bi bi-lightbulb me-3" style="font-size: 2rem; color: var(--bs-info);"></i>
          <div class="flex-grow-1">
            <strong>${i18n.t('earning_tip')}</strong>
            <p class="mb-0 small">${i18n.t('earning_tip_desc')}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h3 class="h4 fw-bold text-dark mb-3">${i18n.t('ads_to_review')}</h3>
      </div>
    </div>
  `;

  const pendingAds = ads.filter(ad => ad.status === 'pending');
  const adsContainer = document.createElement('div');
  if (pendingAds.length > 0) {
    pendingAds.forEach(ad => {
      adsContainer.append(renderAdReviewCard(ad, state, actions));
    });
  } else {
    adsContainer.innerHTML = `<p class="text-center text-muted py-5">${i18n.t('no_ads_to_review')}</p>`;
  }
  container.append(adsContainer);

  return container;
};