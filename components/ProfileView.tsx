import { i18n } from '../hooks/useI18n.js';
import { renderAdCard } from './AdCard.js';
import type { AdStatus } from '../types.js';

// Helper to ensure Bootstrap is ready before use. It polls for the Modal
// component to become available, providing a robust way to handle script loading delays.
const onBootstrapReady = (callback: () => void) => {
  const checkAndExecute = () => {
    if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
      callback();
      return true; // Indicates success
    }
    return false; // Indicates bootstrap is not ready
  };

  // If bootstrap is already available, execute immediately.
  if (checkAndExecute()) {
    return;
  }

  // Otherwise, start polling.
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (checkAndExecute()) {
      // If bootstrap becomes available, stop polling.
      clearInterval(interval);
    } else if (attempts > 100) { // Timeout after 5 seconds (100 * 50ms)
      // If it's still not available after the timeout, stop polling and log an error.
      clearInterval(interval);
      console.error('Bootstrap Modal component failed to load in time. Modal cannot be opened.');
    }
  }, 50);
};

export const renderProfileView = (state, actions) => {
    const { currentUser, ads, view } = state;
    const { setView, logout } = actions;

    const container = document.createElement('div');
    container.className = 'container py-5';

    if (!currentUser) {
        // This case should ideally not be reached if the link is only shown when logged in, but it's good practice.
        container.innerHTML = `<p class="text-center">You must be logged in to view this page.</p>`;
        return container;
    }

    const initialTab = view.name === 'profile' ? (view.initialTab || 'approved') : 'approved';
    const userAds = ads.filter(ad => ad.userId === currentUser.id);

    container.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-4">
                <div class="card shadow-sm position-sticky" style="top: 6.5rem;">
                    <div class="card-body text-center p-4">
                        <i class="bi bi-person-circle display-1 text-primary"></i>
                        <h2 class="card-title mt-2 mb-0">${currentUser.name}</h2>
                        <p class="card-text text-muted">${currentUser.email}</p>
                    </div>
                    <div class="list-group list-group-flush">
                        ${currentUser.storeId 
                            ? `<button class="list-group-item list-group-item-action" id="my-store-link"><i class="bi bi-shop-window me-2"></i> ${i18n.t('my_store')}</button>`
                            : `<button class="list-group-item list-group-item-action" id="become-seller-link"><i class="bi bi-briefcase-fill me-2"></i> ${i18n.t('become_seller')}</button>`
                        }
                        ${currentUser.isRevisor 
                            ? `<button class="list-group-item list-group-item-action" id="revisor-link"><i class="bi bi-clipboard2-check-fill me-2"></i> ${i18n.t('revisor_dashboard')}</button>`
                            : ''
                        }
                        <button class="list-group-item list-group-item-action" id="work-with-us-link"><i class="bi bi-envelope-paper-heart-fill me-2"></i> ${i18n.t('work_with_us')}</button>
                        <button class="list-group-item list-group-item-action text-danger" id="logout-btn"><i class="bi bi-box-arrow-right me-2"></i> ${i18n.t('logout')}</button>
                        <button class="list-group-item list-group-item-action text-danger" id="delete-account-btn"><i class="bi bi-trash3-fill me-2"></i> ${i18n.t('delete_account')}</button>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <h1 class="h2 fw-bold mb-4">${i18n.t('my_ads')}</h1>
                <ul class="nav nav-tabs mb-3" id="ads-tabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link ${initialTab === 'approved' ? 'active' : ''}" id="approved-tab" data-bs-toggle="tab" data-bs-target="#approved-panel" type="button" role="tab" aria-controls="approved-panel" aria-selected="${initialTab === 'approved'}">${i18n.t('ads_approved')} <span class="badge bg-secondary-subtle text-secondary-emphasis rounded-pill"></span></button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link ${initialTab === 'pending' ? 'active' : ''}" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending-panel" type="button" role="tab" aria-controls="pending-panel" aria-selected="${initialTab === 'pending'}">${i18n.t('ads_pending')} <span class="badge bg-secondary-subtle text-secondary-emphasis rounded-pill"></span></button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link ${initialTab === 'rejected' ? 'active' : ''}" id="rejected-tab" data-bs-toggle="tab" data-bs-target="#rejected-panel" type="button" role="tab" aria-controls="rejected-panel" aria-selected="${initialTab === 'rejected'}">${i18n.t('ads_rejected')} <span class="badge bg-secondary-subtle text-secondary-emphasis rounded-pill"></span></button>
                    </li>
                </ul>
                <div class="tab-content" id="ads-tabs-content">
                    <div class="tab-pane fade ${initialTab === 'approved' ? 'show active' : ''}" id="approved-panel" role="tabpanel" aria-labelledby="approved-tab"></div>
                    <div class="tab-pane fade ${initialTab === 'pending' ? 'show active' : ''}" id="pending-panel" role="tabpanel" aria-labelledby="pending-tab"></div>
                    <div class="tab-pane fade ${initialTab === 'rejected' ? 'show active' : ''}" id="rejected-panel" role="tabpanel" aria-labelledby="rejected-tab"></div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners for action links
    if (currentUser.storeId) {
        container.querySelector<HTMLButtonElement>('#my-store-link')!.onclick = () => setView({ name: 'store_detail', storeId: currentUser.storeId! });
    } else {
        container.querySelector<HTMLButtonElement>('#become-seller-link')!.onclick = () => setView({ name: 'become_seller' });
    }
    if (currentUser.isRevisor) {
        container.querySelector<HTMLButtonElement>('#revisor-link')!.onclick = () => setView({ name: 'revisor_dashboard' });
    }
    container.querySelector<HTMLButtonElement>('#work-with-us-link')!.onclick = () => setView({ name: 'work_with_us' });
    container.querySelector<HTMLButtonElement>('#logout-btn')!.onclick = logout;

    container.querySelector<HTMLButtonElement>('#delete-account-btn')!.onclick = () => {
        onBootstrapReady(() => {
            const modalId = 'deleteAccountConfirmModal';
            
            document.getElementById(modalId)?.remove();

            const modalEl = document.createElement('div');
            modalEl.className = 'modal fade';
            modalEl.id = modalId;
            modalEl.tabIndex = -1;
            modalEl.setAttribute('aria-labelledby', 'deleteAccountModalLabel');
            modalEl.setAttribute('aria-hidden', 'true');

            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteAccountModalLabel">${i18n.t('delete_account_confirm_title')}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${i18n.t('delete_account_confirm_text')}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('cancel')}</button>
                            <button type="button" class="btn btn-danger" id="confirm-delete-btn">${i18n.t('confirm_delete')}</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modalEl);
            const modal = new window.bootstrap.Modal(modalEl);

            modalEl.querySelector<HTMLButtonElement>('#confirm-delete-btn')!.onclick = () => {
                actions.deleteAccount();
                modal.hide();
            };

            modalEl.addEventListener('hidden.bs.modal', () => {
                modal.dispose();
                modalEl.remove();
            }, { once: true });

            modal.show();
        });
    };

    const renderAdsByStatus = (status: AdStatus, panelId: string, tabId: string) => {
        const panel = container.querySelector<HTMLDivElement>(`#${panelId}`)!;
        const tabBadge = container.querySelector<HTMLSpanElement>(`#${tabId} span.badge`)!;
        const filteredAds = userAds.filter(ad => ad.status === status);
        
        tabBadge.textContent = filteredAds.length.toString();

        if (filteredAds.length > 0) {
            const adGrid = document.createElement('div');
            adGrid.className = 'row row-cols-1 row-cols-md-2 g-4';
            filteredAds.forEach(ad => {
                adGrid.appendChild(renderAdCard(ad, state, actions));
            });
            panel.appendChild(adGrid);
        } else {
            panel.innerHTML = `<div class="text-center py-5 text-muted">
                <i class="bi bi-journal-x fs-1"></i>
                <p class="mt-3">${i18n.t('no_ads_with_status').replace('{status}', i18n.t(`status_${status}`))}</p>
            </div>`;
        }
    };

    renderAdsByStatus('approved', 'approved-panel', 'approved-tab');
    renderAdsByStatus('pending', 'pending-panel', 'pending-tab');
    renderAdsByStatus('rejected', 'rejected-panel', 'rejected-tab');
    
    return container;
};