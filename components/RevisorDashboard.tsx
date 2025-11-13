import { i18n } from '../hooks/useI18n.js';
import { analyzeImageSafety, watermarkImage, analyzeAdText } from '../services/geminiService.js';
import { Spinner } from './ui/Spinner.js';

const PLACEHOLDER_IMG = '/public/images/placeholder.svg';

const renderAdReviewCard = (ad, state, actions) => {
  const { users, currentUser } = state;
  const { updateAd } = actions;
  const user = users.find(u => u.id === ad.userId);
  const card = document.createElement('div');
  card.className = 'card shadow-sm mb-3';
  card.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="card-title fw-bold">${i18n.tContent(ad.title)}</h5>
          <p class="card-subtitle text-muted">${i18n.t('by_user').replace('{user}', user?.name || i18n.t('unknown_user'))} - ${i18n.formatPrice(ad.price)}</p>
        </div>
        <div class="d-flex gap-2" id="action-buttons">
          <button class="btn btn-success btn-sm" id="approve-btn">${i18n.t('approve')}</button>
          <button class="btn btn-danger btn-sm" id="reject-btn">${i18n.t('reject')}</button>
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
  
  container.innerHTML = `<h2 class="h2 fw-bold text-dark mb-4">${i18n.t('ads_to_review')}</h2>`;

  const pendingAds = ads.filter(ad => ad.status === 'pending');
  if (pendingAds.length > 0) {
    pendingAds.forEach(ad => {
      container.append(renderAdReviewCard(ad, state, actions));
    });
  } else {
    container.innerHTML += `<p class="text-center text-muted py-5">${i18n.t('no_ads_to_review')}</p>`;
  }

  return container;
};