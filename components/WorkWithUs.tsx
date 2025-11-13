import { i18n } from '../hooks/useI18n.js';

export const renderWorkWithUs = (state, actions) => {
  const { currentUser } = state;
  const container = document.createElement('div');
  container.className = 'container py-5';

  const card = document.createElement('div');
  card.className = 'card shadow-xl border-0 mx-auto p-4 p-md-5';
  card.style.maxWidth = '700px';

  card.innerHTML = `
    <div class="card-body">
      <h2 class="card-title h2 fw-bold text-dark mb-2">${i18n.t('become_a_revisor')}</h2>
      <p class="text-muted mb-4">${i18n.t('revisor_description')}</p>
      <form id="work-form" class="row g-3">
        <div class="col-12">
          <label for="name" class="form-label">${i18n.t('your_name')}</label>
          <input type="text" class="form-control" id="name" value="${currentUser?.name || ''}" required>
        </div>
        <div class="col-12">
          <label for="email" class="form-label">${i18n.t('your_email')}</label>
          <input type="email" class="form-control" id="email" value="${currentUser?.email || ''}" required>
        </div>
        <div class="col-12">
          <label for="reason" class="form-label">${i18n.t('why_revisor')}</label>
          <textarea class="form-control" id="reason" rows="4" required></textarea>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary btn-lg w-100">${i18n.t('send_request')}</button>
        </div>
      </form>
    </div>
  `;

  // Fix: Add type assertion to resolve 'onsubmit' property error.
  card.querySelector<HTMLFormElement>('#work-form')!.onsubmit = (e) => {
    e.preventDefault();
    card.innerHTML = `
      <div class="card-body text-center p-5">
        <h2 class="h2 fw-bold text-dark mb-4">${i18n.t('thank_you')}</h2>
        <p class="text-muted">${i18n.t('request_sent')}</p>
      </div>
    `;
  };
  
  container.append(card);
  return container;
};