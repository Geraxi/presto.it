import { i18n } from '../hooks/useI18n.js';
import { LANGUAGES } from '../constants.js';

export const renderFooter = (state, actions) => {
  const { setView, setLanguage } = actions;
  const footer = document.createElement('footer');
  footer.className = 'bg-light text-dark text-opacity-75';
  footer.innerHTML = `
    <div class="container py-5">
      <div class="row text-center text-md-start">
        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="fw-bold text-dark mb-3">
            <i class="bi bi-lightning-charge-fill me-2 text-turquoise-blue"></i>Presto.it
          </h5>
          <p class="text-sm text-muted mb-0" style="line-height: 1.7;">${i18n.t('platform_description')}</p>
        </div>
        <div class="col-md-2 mb-4 mb-md-0">
          <h5 class="fw-bold text-dark mb-3">${i18n.t('quick_links')}</h5>
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><button class="btn btn-link text-decoration-none p-0 footer-link text-muted" data-view="home" style="transition: all 0.2s ease;">${i18n.t('home')}</button></li>
            <li class="mb-2"><button class="btn btn-link text-decoration-none p-0 footer-link text-muted" data-view="work_with_us" style="transition: all 0.2s ease;">${i18n.t('work_with_us')}</button></li>
            <li class="mb-2"><button class="btn btn-link text-decoration-none p-0 footer-link text-muted" data-view="about" style="transition: all 0.2s ease;">${i18n.t('about_us')}</button></li>
          </ul>
        </div>
        <div class="col-md-3 mb-4 mb-md-0">
          <h5 class="fw-bold text-dark mb-3">${i18n.t('follow_us')}</h5>
          <div class="d-flex justify-content-center justify-content-md-start gap-3 mb-3">
            <a href="#" aria-label="${i18n.t('instagram_aria')}" class="link-dark" style="transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(2, 170, 189, 0.1);">
              <i class="bi bi-instagram fs-5"></i>
            </a>
            <a href="#" aria-label="${i18n.t('facebook_aria')}" class="link-dark" style="transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(2, 170, 189, 0.1);">
              <i class="bi bi-facebook fs-5"></i>
            </a>
          </div>
        </div>
        <div class="col-md-3">
            <h5 class="fw-bold text-dark mb-3">Language</h5>
            <div class="d-flex justify-content-center justify-content-md-start gap-2">
                ${LANGUAGES.map(lang => `
                  <button class="btn p-0 fs-2 lang-btn" title="${lang.name}" data-lang-code="${lang.code}" style="transition: all 0.2s ease; filter: grayscale(0.3);">
                    ${lang.flag}
                  </button>
                `).join('')}
            </div>
        </div>
      </div>
      <div class="text-center text-sm mt-5 pt-4" style="border-top: 1px solid rgba(0, 0, 0, 0.08);">
        <p class="text-muted mb-0">${i18n.t('all_rights_reserved')}</p>
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