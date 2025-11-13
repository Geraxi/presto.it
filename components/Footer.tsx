import { i18n } from '../hooks/useI18n.js';
import { LANGUAGES } from '../constants.js';

export const renderFooter = (state, actions) => {
  const { setView, setLanguage } = actions;
  const footer = document.createElement('footer');
  footer.className = 'bg-light text-dark text-opacity-75 border-top';
  footer.innerHTML = `
    <div class="container py-5">
      <div class="row text-center text-md-start">
        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="fw-bold text-dark mb-2">Presto.it</h5>
          <p class="text-sm">${i18n.t('platform_description')}</p>
        </div>
        <div class="col-md-2 mb-4 mb-md-0">
          <h5 class="fw-bold text-dark mb-2">${i18n.t('quick_links')}</h5>
          <ul class="list-unstyled">
            <li><button class="btn btn-link text-decoration-none p-0 footer-link" data-view="home">${i18n.t('home')}</button></li>
            <li><button class="btn btn-link text-decoration-none p-0 footer-link" data-view="work_with_us">${i18n.t('work_with_us')}</button></li>
            <li><button class="btn btn-link text-decoration-none p-0 footer-link" data-view="about">${i18n.t('about_us')}</button></li>
          </ul>
        </div>
        <div class="col-md-3 mb-4 mb-md-0">
          <h5 class="fw-bold text-dark mb-2">${i18n.t('follow_us')}</h5>
          <div class="d-flex justify-content-center justify-content-md-start gap-3 mb-3">
            <a href="#" aria-label="${i18n.t('instagram_aria')}" class="link-dark"><i class="bi bi-instagram fs-4"></i></a>
            <a href="#" aria-label="${i18n.t('facebook_aria')}" class="link-dark"><i class="bi bi-facebook fs-4"></i></a>
          </div>
        </div>
        <div class="col-md-3">
            <h5 class="fw-bold text-dark mb-2">Language</h5>
            <div class="d-flex justify-content-center justify-content-md-start gap-2">
                ${LANGUAGES.map(lang => `
                  <button class="btn p-0 fs-2 lang-btn" title="${lang.name}" data-lang-code="${lang.code}">${lang.flag}</button>
                `).join('')}
            </div>
        </div>
      </div>
      <div class="text-center text-sm mt-5 pt-4 border-top">
        <p>${i18n.t('all_rights_reserved')}</p>
      </div>
    </div>
  `;

  // Fix: Add type assertions for querySelectorAll to resolve property access errors.
  footer.querySelectorAll<HTMLButtonElement>('.footer-link').forEach(link => {
    link.onclick = () => {
        if(link.dataset.view === 'home') setView({ name: 'home' });
        if(link.dataset.view === 'work_with_us') setView({ name: 'work_with_us' });
    }
  });

  footer.querySelectorAll<HTMLButtonElement>('.lang-btn').forEach(btn => {
      btn.onclick = () => {
          const lang = LANGUAGES.find(l => l.code === btn.dataset.langCode);
          if (lang) setLanguage(lang);
      };
  });

  return footer;
};