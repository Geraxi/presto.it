import { i18n } from '../hooks/useI18n.js';
import { PLACEHOLDER_IMG } from '../constants.js';

export const renderBasket = (state, actions) => {
  const { basket, ads, users } = state;
  const { setView, removeFromBasket, updateBasketQuantity, clearBasket } = actions;

  const container = document.createElement('div');
  container.className = 'container my-5';

  if (basket.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x" style="font-size: 4rem; color: var(--bs-secondary);"></i>
        <h2 class="h2 fw-bold text-dark mt-4 mb-3">${i18n.t('basket_empty_title')}</h2>
        <p class="text-muted mb-4">${i18n.t('basket_empty_message')}</p>
        <button class="btn btn-primary btn-lg" id="continue-shopping-btn">
          <i class="bi bi-arrow-left me-2"></i>${i18n.t('continue_shopping')}
        </button>
      </div>
    `;
    container.querySelector('#continue-shopping-btn')!.onclick = () => {
      setView({ name: 'home' });
    };
    return container;
  }

  // Calculate totals
  const basketItems = basket.map(item => {
    const ad = ads.find(a => a.id === item.adId);
    return { ...item, ad };
  }).filter(item => item.ad);

  const subtotal = basketItems.reduce((sum, item) => {
    return sum + (item.ad!.price * item.quantity);
  }, 0);

  container.innerHTML = `
    <div class="row">
      <div class="col-12 mb-4">
        <h2 class="h2 fw-bold text-dark">
          <i class="bi bi-cart me-2"></i>${i18n.t('shopping_basket')}
        </h2>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <div id="basket-items"></div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm sticky-top" style="top: 20px;">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-4">${i18n.t('order_summary')}</h5>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">${i18n.t('subtotal')}</span>
              <span class="fw-semibold">${i18n.formatPrice(subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">${i18n.t('total_items')}</span>
              <span class="fw-semibold">${basket.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">${i18n.t('total')}</span>
              <span class="fw-bold fs-5 text-primary">${i18n.formatPrice(subtotal)}</span>
            </div>
            <button class="btn btn-primary btn-lg w-100 mb-2" id="checkout-btn">
              <i class="bi bi-credit-card me-2"></i>${i18n.t('proceed_to_checkout')}
            </button>
            <button class="btn btn-outline-secondary w-100" id="clear-basket-btn">
              <i class="bi bi-trash me-2"></i>${i18n.t('clear_basket')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render basket items
  const basketItemsContainer = container.querySelector('#basket-items')!;
  basketItems.forEach(({ ad, quantity, adId }) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'd-flex gap-3 mb-4 pb-4 border-bottom';
    
    const image = ad!.images && ad!.images.length > 0 ? ad!.images[0] : PLACEHOLDER_IMG;
    
    itemDiv.innerHTML = `
      <div style="width: 120px; height: 120px; flex-shrink: 0;">
        <img src="${image}" alt="${i18n.tContent(ad!.title)}" 
             class="w-100 h-100 object-fit-cover rounded" 
             style="object-fit: cover;"
             onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';">
      </div>
      <div class="flex-grow-1">
        <h5 class="fw-bold mb-2">${i18n.tContent(ad!.title)}</h5>
        <p class="text-muted small mb-2">${i18n.tCategory(ad!.category)}</p>
        <div class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center gap-2">
            <label class="small text-muted mb-0">${i18n.t('quantity')}:</label>
            <div class="input-group" style="width: 100px;">
              <button class="btn btn-sm btn-outline-secondary" type="button" id="decrease-${adId}">-</button>
              <input type="number" class="form-control form-control-sm text-center" 
                     value="${quantity}" min="1" id="quantity-${adId}">
              <button class="btn btn-sm btn-outline-secondary" type="button" id="increase-${adId}">+</button>
            </div>
          </div>
          <div class="ms-auto">
            <span class="fw-bold fs-5 text-primary">${i18n.formatPrice(ad!.price * quantity)}</span>
            <div class="small text-muted">${i18n.formatPrice(ad!.price)} ${i18n.t('each')}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger mt-2" id="remove-${adId}">
          <i class="bi bi-trash me-1"></i>${i18n.t('remove')}
        </button>
      </div>
    `;

    // Quantity controls
    itemDiv.querySelector(`#decrease-${adId}`)!.onclick = () => {
      updateBasketQuantity(adId, Math.max(1, quantity - 1));
    };
    itemDiv.querySelector(`#increase-${adId}`)!.onclick = () => {
      updateBasketQuantity(adId, quantity + 1);
    };
    const quantityInput = itemDiv.querySelector(`#quantity-${adId}`) as HTMLInputElement;
    quantityInput.onchange = () => {
      const newQuantity = parseInt(quantityInput.value) || 1;
      updateBasketQuantity(adId, newQuantity);
    };
    itemDiv.querySelector(`#remove-${adId}`)!.onclick = () => {
      if (confirm(i18n.t('confirm_remove_item'))) {
        removeFromBasket(adId);
      }
    };

    basketItemsContainer.appendChild(itemDiv);
  });

  // Checkout button
  container.querySelector('#checkout-btn')!.onclick = () => {
    setView({ name: 'checkout' });
  };

  // Clear basket button
  container.querySelector('#clear-basket-btn')!.onclick = () => {
    if (confirm(i18n.t('confirm_clear_basket'))) {
      clearBasket();
    }
  };

  return container;
};

