import { i18n } from '../hooks/useI18n.js';
import { analyzeImageSafety, watermarkImage, analyzeAdText } from '../services/geminiService.js';
import { Spinner } from './ui/Spinner.js';
import { PLACEHOLDER_IMG } from '../constants.js';

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
        <div id="text-analysis-container" class="mb-3">
          <div class="d-flex align-items-center gap-2">
            ${Spinner({size: 'sm'}).outerHTML}
            <span>${i18n.t('text_analysis')}...</span>
          </div>
        </div>
        <div class="row g-3 mt-2" id="image-analysis-container">
          ${ad.images.map((img, index) => `
            <div class="col-6 col-md-3">
              <img src="${img}" class="img-fluid rounded" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"/>
              <div class="mt-1" id="img-analysis-result-${index}">
                <div class="d-flex align-items-center gap-2 mt-2">
                  ${Spinner({size: 'sm'}).outerHTML}
                  <span class="small">${i18n.t('analyze_image')}...</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  const runAnalysis = async () => {
      // Text analysis
      const textContainer = card.querySelector('#text-analysis-container')!;
      try {
        const result = await analyzeAdText(i18n.tContent(ad.title), i18n.tContent(ad.description));
        textContainer.innerHTML = `
            <div class="alert alert-${result.safe ? 'success' : 'danger'} small p-2">
            <strong>${i18n.t('text_analysis')}: ${result.safe ? i18n.t('safe') : i18n.t('not_safe')}</strong> - ${result.reason}
            <div class="mt-1">
                ${result.tags.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('') || `<em>${i18n.t('not_available')}</em>`}
            </div>
            </div>`;
    } catch (e) {
       textContainer.innerHTML = `<div class="alert alert-warning small p-2">${i18n.t('text_analysis')}: ${i18n.t('analysis_failed')}</div>`;
    }

    // Image analysis (in parallel)
    await Promise.all(ad.images.map(async (img, index) => {
        const imgResultEl = card.querySelector(`#img-analysis-result-${index}`)!;
        try {
            const [header, base64] = img.split(',');
            const mimeType = header.replace('data:', '').replace(';base64', '');
            const result = await analyzeImageSafety(base64, mimeType);
            imgResultEl.innerHTML = `
            <div class="alert alert-${result.safe ? 'success' : 'danger'} small p-2">
            <strong>${result.safe ? i18n.t('safe') : i18n.t('not_safe')}</strong>
            <div class="mt-1">
                ${result.tags.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('') || `<em>${i18n.t('not_available')}</em>`}
            </div>
            </div>`;
        } catch (e) {
            imgResultEl.innerHTML = `<div class="alert alert-warning small p-2">${i18n.t('analysis_failed')}</div>`;
        }
    }));
  };

  runAnalysis();

  card.querySelector<HTMLButtonElement>('#reject-btn')!.onclick = () => {
    updateAd({ ...ad, status: 'rejected' });
  };
  
  card.querySelector<HTMLButtonElement>('#approve-btn')!.onclick = async (e) => {
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