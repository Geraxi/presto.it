import { I18N, CATEGORIES } from '../constants.js';

let _language;

const t = (key) => {
  return I18N[key]?.[_language.code] || key;
};

const tCategory = (key) => {
  return CATEGORIES[key]?.[_language.code] || key;
};

const tContent = (content) => {
  if (!content) return '';
  return content[_language.code] || content['it'] || '';
};

const formatPrice = (price) => {
  return new Intl.NumberFormat(_language.locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const i18n = {
  setLanguage: (lang) => {
    _language = lang;
  },
  get language() {
      return _language;
  },
  t,
  tCategory,
  tContent,
  formatPrice
};