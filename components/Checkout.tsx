import { i18n } from '../hooks/useI18n.js';

export const renderCheckout = (state, actions) => {
  const { basket, ads, currentUser } = state;
  const { setView, checkout } = actions;

  const container = document.createElement('div');
  container.className = 'container my-5';

  if (!currentUser) {
    container.innerHTML = `
      <div class="alert alert-warning">
        <h4 class="alert-heading">${i18n.t('login_required')}</h4>
        <p>${i18n.t('login_required_for_checkout')}</p>
        <hr>
        <button class="btn btn-primary" id="login-btn">${i18n.t('login')}</button>
      </div>
    `;
    container.querySelector('#login-btn')!.onclick = () => {
      actions.openLogin();
    };
    return container;
  }

  if (basket.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info">
        <p>${i18n.t('basket_empty')}</p>
        <button class="btn btn-primary" id="continue-shopping-btn">${i18n.t('continue_shopping')}</button>
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
          <i class="bi bi-credit-card me-2"></i>${i18n.t('checkout')}
        </h2>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="bi bi-person me-2"></i>${i18n.t('customer_information')}</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">${i18n.t('name')}</label>
              <input type="text" class="form-control" value="${currentUser.name}" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">${i18n.t('email')}</label>
              <input type="email" class="form-control" value="${currentUser.email}" readonly>
            </div>
          </div>
        </div>

        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="bi bi-credit-card me-2"></i>${i18n.t('payment_method')}</h5>
          </div>
          <div class="card-body">
            <div class="form-check mb-3">
              <input class="form-check-input" type="radio" name="paymentMethod" id="payment-card" value="card" checked>
              <label class="form-check-label" for="payment-card">
                <i class="bi bi-credit-card me-2"></i>${i18n.t('credit_debit_card')}
              </label>
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="radio" name="paymentMethod" id="payment-paypal" value="paypal">
              <label class="form-check-label" for="payment-paypal">
                <i class="bi bi-paypal me-2"></i>PayPal
              </label>
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="radio" name="paymentMethod" id="payment-bank" value="bank">
              <label class="form-check-label" for="payment-bank">
                <i class="bi bi-bank me-2"></i>${i18n.t('bank_transfer')}
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="paymentMethod" id="payment-cash" value="cash">
              <label class="form-check-label" for="payment-cash">
                <i class="bi bi-cash me-2"></i>${i18n.t('cash_on_delivery')}
              </label>
            </div>
          </div>
        </div>

        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="bi bi-list-ul me-2"></i>${i18n.t('order_items')}</h5>
          </div>
          <div class="card-body">
            <div id="order-items-list"></div>
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
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">${i18n.t('shipping')}</span>
              <span class="fw-semibold">${i18n.t('free')}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">${i18n.t('total')}</span>
              <span class="fw-bold fs-5 text-primary">${i18n.formatPrice(subtotal)}</span>
            </div>
            <button class="btn btn-primary btn-lg w-100 mb-2" id="complete-order-btn">
              <i class="bi bi-check-circle me-2"></i>${i18n.t('complete_order')}
            </button>
            <button class="btn btn-outline-secondary w-100" id="back-to-basket-btn">
              <i class="bi bi-arrow-left me-2"></i>${i18n.t('back_to_basket')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render order items
  const orderItemsList = container.querySelector('#order-items-list')!;
  basketItems.forEach(({ ad, quantity }) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'd-flex justify-content-between align-items-center mb-3 pb-3 border-bottom';
    itemDiv.innerHTML = `
      <div>
        <div class="fw-semibold">${i18n.tContent(ad!.title)}</div>
        <div class="text-muted small">${i18n.t('quantity')}: ${quantity} × ${i18n.formatPrice(ad!.price)}</div>
      </div>
      <div class="fw-bold">${i18n.formatPrice(ad!.price * quantity)}</div>
    `;
    orderItemsList.appendChild(itemDiv);
  });

  // Complete order button
  container.querySelector('#complete-order-btn')!.onclick = () => {
    const selectedPayment = (container.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement)?.value || 'card';
    checkout(selectedPayment);
  };

  // Back to basket button
  container.querySelector('#back-to-basket-btn')!.onclick = () => {
    setView({ name: 'basket' });
  };

  return container;
};

