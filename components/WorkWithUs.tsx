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
      <div class="text-center mb-4">
        <div class="mb-3">
          <i class="bi bi-wallet" style="font-size: 4rem; color: var(--bs-success);"></i>
        </div>
        <h2 class="card-title h2 fw-bold text-dark mb-2">${i18n.t('become_a_revisor')}</h2>
        <p class="text-muted mb-4">${i18n.t('revisor_description')}</p>
      </div>
      
      <!-- How to Earn Money Visual Guide -->
      <div class="bg-light rounded p-4 mb-4">
        <h4 class="fw-bold mb-3 text-center">
          <i class="bi bi-cash me-2"></i>${i18n.t('how_to_earn_money')}
        </h4>
        <div class="row g-3">
          <div class="col-md-4">
            <div class="text-center p-3 bg-white rounded shadow-sm h-100">
              <div class="mb-2">
                <i class="bi bi-file-earmark-text" style="font-size: 2.5rem; color: var(--bs-primary);"></i>
              </div>
              <h6 class="fw-bold mb-2">${i18n.t('step_1')}</h6>
              <p class="small text-muted mb-0">${i18n.t('step_1_desc')}</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-3 bg-white rounded shadow-sm h-100">
              <div class="mb-2">
                <i class="bi bi-check-circle" style="font-size: 2.5rem; color: var(--bs-success);"></i>
              </div>
              <h6 class="fw-bold mb-2">${i18n.t('step_2')}</h6>
              <p class="small text-muted mb-0">${i18n.t('step_2_desc')}</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-3 bg-white rounded shadow-sm h-100">
              <div class="mb-2">
                <i class="bi bi-wallet" style="font-size: 2.5rem; color: var(--bs-success);"></i>
              </div>
              <h6 class="fw-bold mb-2">${i18n.t('step_3')}</h6>
              <p class="small text-muted mb-0">${i18n.t('step_3_desc')}</p>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <div class="d-inline-block p-3 bg-success bg-opacity-10 rounded border border-success">
            <div class="d-flex align-items-center justify-content-center">
              <i class="bi bi-cash me-2" style="font-size: 1.5rem; color: var(--bs-success);"></i>
              <div class="text-start">
                <strong class="text-success d-block">${i18n.t('earn_per_review')}</strong>
                <span class="text-muted small">${i18n.t('instant_payment')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
    const { becomeRevisor, setView } = actions;
    
    // Make the user a revisor
    becomeRevisor();
    
    card.innerHTML = `
      <div class="card-body text-center p-5">
        <h2 class="h2 fw-bold text-dark mb-4">${i18n.t('thank_you')}</h2>
        <p class="text-muted mb-4">${i18n.t('revisor_application_approved')}</p>
        <button class="btn btn-primary" id="go-to-dashboard-btn">${i18n.t('go_to_revisor_dashboard')}</button>
      </div>
    `;
    
    card.querySelector<HTMLButtonElement>('#go-to-dashboard-btn')!.onclick = () => {
      setView({ name: 'revisor_dashboard' });
    };
  };
  
  container.append(card);
  return container;
};