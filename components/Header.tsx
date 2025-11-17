import { LANGUAGES, CATEGORY_KEYS } from '../constants.js';
import { i18n } from '../hooks/useI18n.js';
import { SiteLogoIcon, SearchIcon } from './ui/Icons.js';

export const renderHeader = (state, actions) => {
  const { currentUser, language, searchTerm, selectedCategory, basket } = state;
  const { setView, setLanguage, logout, openLogin, setSearchTerm, setSelectedCategory } = actions;
  
  const basketItemCount = basket.reduce((sum, item) => sum + item.quantity, 0);
  
  const header = document.createElement('header');
  header.className = 'sticky-top shadow-sm';

  const topBar = document.createElement('div');
  topBar.className = 'bg-light';
  topBar.innerHTML = `
    <div class="container py-3 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2" style="cursor: pointer;" id="logo-link">
        <span id="logo-icon-container"></span>
        <h1 class="h4 fw-bold mb-0" style="color: #1a9ba8; line-height: 1.2;">
          PRESTO<span class="small text-muted" style="font-size: 0.85em;">.IT</span>
        </h1>
      </div>
      <nav class="d-flex align-items-center gap-2">
        ${currentUser ? `<button class="btn btn-primary d-none d-md-inline-block" id="post-ad-btn">${i18n.t('post_ad')}</button>` : ''}
        
        <button class="btn btn-light position-relative" id="basket-btn" style="width: 40px; height: 40px;">
          <i class="bi bi-cart fs-5"></i>
          ${basketItemCount > 0 ? `
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
              ${basketItemCount}
            </span>
          ` : ''}
        </button>
        
        <div class="dropdown">
          <button class="btn btn-light d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span>${language.flag}</span>
            <i class="bi bi-chevron-down ms-2"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            ${LANGUAGES.map(lang => `
              <li><a class="dropdown-item d-flex align-items-center lang-item" href="#" data-lang-code="${lang.code}">
                <span class="me-3">${lang.flag}</span> ${lang.name}
              </a></li>
            `).join('')}
          </ul>
        </div>

        <div class="dropdown">
          ${currentUser ? `
            <button class="btn btn-light rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width: 40px; height: 40px;">
              <i class="bi bi-person-fill fs-5"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">${currentUser.name}</h6></li>
              <li><a class="dropdown-item" href="#" id="profile-link">${i18n.t('my_profile')}</a></li>
              <li><a class="dropdown-item" href="#" id="my-listings-link">${i18n.t('my_listings')}</a></li>
              ${currentUser.storeId ? `<li><a class="dropdown-item" href="#" id="my-store-link"><i class="bi bi-shop me-2"></i>${i18n.t('my_store')}</a></li>` : ''}
              ${currentUser.isRevisor ? `<li><a class="dropdown-item" href="#" id="revisor-link">${i18n.t('revisor_dashboard')}</a></li>` : ''}
              ${!currentUser.storeId ? `<li><a class="dropdown-item" href="#" id="become-seller-link">${i18n.t('become_seller')}</a></li>` : ''}
              <li><a class="dropdown-item" href="#" id="work-with-us-link">${i18n.t('work_with_us')}</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" id="logout-btn">${i18n.t('logout')}</a></li>
            </ul>
          ` : `
            <button class="btn btn-outline-secondary" id="login-register-btn">${i18n.t('login_register')}</button>
          `}
        </div>
      </nav>
    </div>
  `;
  
  const bottomBar = document.createElement('div');
  bottomBar.className = 'bg-deep-teal';
  bottomBar.innerHTML = `
    <div class="container d-flex align-items-center justify-content-between text-sm py-2">
      <nav class="flex-grow-1 d-flex align-items-center justify-content-evenly text-white overflow-x-auto">
        <button class="btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-link text-white text-decoration-none'} flex-shrink-0" data-category="all">${i18n.t('all_categories')}</button>
        ${CATEGORY_KEYS.map(cat => `
          <button class="btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-link text-white text-decoration-none'} flex-shrink-0" data-category="${cat}">${i18n.tCategory(cat)}</button>
        `).join('')}
      </nav>
      <div class="position-relative ms-4 d-none d-sm-flex align-items-center">
          <span class="position-absolute start-0 ms-3 text-white-50">${SearchIcon({ className: "h-5 w-5" }).outerHTML}</span>
          <input
              type="text"
              placeholder="${i18n.t('search_placeholder')}"
              value="${searchTerm}"
              class="form-control form-control-sm ps-5 bg-white bg-opacity-25 text-white border-0"
              id="search-input"
              style="--bs-body-color: white; --bs-placeholder-color: rgba(255,255,255,0.7);"
          />
      </div>
    </div>
  `;

  // Fix: Add type assertions to querySelector results to fix property access errors.
  topBar.querySelector<HTMLDivElement>('#logo-link')!.onclick = () => setView({ name: 'home' });
  topBar.querySelector<HTMLSpanElement>('#logo-icon-container')!.append(SiteLogoIcon({ className: 'h-8 w-8 text-turquoise-blue' }));
  topBar.querySelector<HTMLButtonElement>('#basket-btn')!.onclick = () => setView({ name: 'basket' });
  if(currentUser) {
    topBar.querySelector<HTMLButtonElement>('#post-ad-btn')!.onclick = () => setView({ name: 'create_ad' });
    topBar.querySelector<HTMLAnchorElement>('#logout-btn')!.onclick = (e) => { e.preventDefault(); logout(); };
    topBar.querySelector<HTMLAnchorElement>('#profile-link')!.onclick = (e) => { e.preventDefault(); setView({ name: 'profile' }); };
    topBar.querySelector<HTMLAnchorElement>('#my-listings-link')!.onclick = (e) => { e.preventDefault(); setView({ name: 'my_listings' }); };
    if(currentUser.storeId) {
      const storeLink = topBar.querySelector<HTMLAnchorElement>('#my-store-link');
      if (storeLink) {
        storeLink.onclick = (e) => { e.preventDefault(); setView({ name: 'store_detail', storeId: currentUser.storeId! }); };
      }
    }
    if(currentUser.isRevisor) topBar.querySelector<HTMLAnchorElement>('#revisor-link')!.onclick = (e) => { e.preventDefault(); setView({ name: 'revisor_dashboard' }); };
    if(!currentUser.storeId) topBar.querySelector<HTMLAnchorElement>('#become-seller-link')!.onclick = (e) => { e.preventDefault(); setView({ name: 'become_seller' }); };
    topBar.querySelector<HTMLAnchorElement>('#work-with-us-link')!.onclick = (e) => { e.preventDefault(); setView({ name: 'work_with_us' }); };
  } else {
    topBar.querySelector<HTMLButtonElement>('#login-register-btn')!.onclick = openLogin;
  }
  topBar.querySelectorAll<HTMLAnchorElement>('.lang-item').forEach(item => {
    item.onclick = (e) => {
      e.preventDefault();
      const lang = LANGUAGES.find(l => l.code === item.dataset.langCode);
      if (lang) setLanguage(lang);
    };
  });
  
  bottomBar.querySelectorAll<HTMLButtonElement>('button[data-category]').forEach(btn => {
      btn.onclick = () => setSelectedCategory(btn.dataset.category!);
  });
  (bottomBar.querySelector('#search-input') as HTMLInputElement).oninput = (e) => setSearchTerm((e.target as HTMLInputElement).value);


  header.append(topBar, bottomBar);
  return header;
};