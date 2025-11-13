// Fix: Changed createSvg return type to SVGElement to resolve type errors.
const createSvg = (html: string): SVGElement => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild as SVGElement;
};

export const SiteLogoIcon = ({ className }) => {
    const svg = createSvg(`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}"><path d="M12.5 4H8.5V14.5H12.5C14.7091 14.5 16.5 12.7091 16.5 10.5V8C16.5 5.79086 14.7091 4 12.5 4Z" fill="currentColor" /><path d="M8.5 14.5H5.5V20H8.5V14.5Z" fill="currentColor" /><path d="M18.5 10.5C18.5 13.8137 15.8137 16.5 12.5 16.5H8.5V18.5H12.5C16.9183 18.5 20.5 14.9183 20.5 10.5V8C20.5 6.89543 19.6046 6 18.5 6C17.3954 6 16.5 6.89543 16.5 8V10.5C16.5 10.5 18.5 10.5 18.5 10.5Z" fill="currentColor" opacity="0.7"/></svg>`);
    svg.style.height = '2rem';
    svg.style.width = '2rem';
    return svg;
};

export const SearchIcon = ({ className }) => {
  const svg = createSvg(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="${className}"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>`);
  svg.style.height = '1.25rem';
  svg.style.width = '1.25rem';
  return svg;
};

const iconMap = {
    electronics: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>`,
    furniture: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`,
    clothing: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" /></svg>`,
    motors: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v.958m12 0c0 2.209-1.79 4-4 4s-4-1.791-4-4m8 0c0-2.209-1.79-4-4-4s-4 1.791-4 4m0 0v-4.5m5.026-4.5h-3.836a1.125 1.125 0 01-1.125-1.125V6.75c0-.621.504-1.125 1.125-1.125h3.836c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125z" /></svg>`,
    books_magazines: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>`,
    sports: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.792V12a9 9 0 10-9 9h.792M21 12.792A9 9 0 0112.792 21M15.01 12.446a1.5 1.5 0 11-2.122-2.122 1.5 1.5 0 012.122 2.122zM8.99 9.004a1.5 1.5 0 100-2.121 1.5 1.5 0 000 2.121z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>`,
    real_estate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>`,
    collectibles: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`,
    music_movies: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 0112.75 5.25h1.5A2.25 2.25 0 0116.5 7.5v3.553" /></svg>`,
    jobs: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.075c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125V14.15M4.875 14.15L5.625 5.625h12.75l.75 8.525M9 18.225h6" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 9.75a4.5 4.5 0 10-9 0" /></svg>`,
    fallback: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 9h.008v.008H6V9z" /></svg>`,
};

export const CategoryIcon = ({ category, className }) => {
  const iconHtml = iconMap[category] || iconMap.fallback;
  const svg = createSvg(iconHtml);
  if (className) svg.setAttribute('class', className);
  svg.style.height = '1.5rem';
  svg.style.width = '1.5rem';
  return svg;
};