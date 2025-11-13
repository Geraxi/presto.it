import { i18n } from '../hooks/useI18n.js';

export const renderBecomeSeller = (state, actions) => {
  const { currentUser } = state;
  const { createStore } = actions;
  const container = document.createElement('div');
  container.className = 'container py-5';

  const card = document.createElement('div');
  card.className = 'card shadow-xl border-0 mx-auto p-4 p-md-5';
  card.style.maxWidth = '700px';

  if (!currentUser) {
    card.innerHTML = `<div class="card-body text-center"><h2 class="h2 fw-bold text-dark">${i18n.t('login_to_open_store')}</h2></div>`;
    container.append(card);
    return container;
  }
  
  if (currentUser.storeId) {
    card.innerHTML = `<div class="card-body text-center"><h2 class="h2 fw-bold text-dark">${i18n.t('already_have_store')}</h2></div>`;
    container.append(card);
    return container;
  }

  card.innerHTML = `
    <div class="card-body">
      <h2 class="card-title h2 fw-bold text-dark mb-2">${i18n.t('open_your_store')}</h2>
      <p class="text-muted mb-4">${i18n.t('store_description_long')}</p>
      <form id="store-form" class="row g-3">
        <div class="col-12">
          <label for="storeName" class="form-label">${i18n.t('store_name')}</label>
          <input type="text" class="form-control" id="storeName" required>
        </div>
        <div class="col-12">
          <label for="storeDescription" class="form-label">${i18n.t('store_description')}</label>
          <textarea class="form-control" id="storeDescription" rows="4" required></textarea>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary btn-lg w-100">${i18n.t('create_store')}</button>
        </div>
      </form>
    </div>
  `;

  // Fix: Add type assertion to resolve 'onsubmit' property error.
  card.querySelector<HTMLFormElement>('#store-form')!.onsubmit = (e) => {
    e.preventDefault();
    // Fix: Add type assertions to resolve 'value' property errors.
    const storeName = (card.querySelector('#storeName') as HTMLInputElement).value;
    const storeDescription = (card.querySelector('#storeDescription') as HTMLTextAreaElement).value;
    if (!storeName || !storeDescription) {
        alert(i18n.t('fill_all_fields'));
        return;
    }
    createStore(storeName, storeDescription);
  };
  
  container.append(card);
  return container;
};