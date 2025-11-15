import { i18n } from '../hooks/useI18n.js';

export const renderLoginView = (state, actions) => {
  const { login, setView } = actions;
  const div = document.createElement('div');
  div.className = 'container text-center py-5';
  div.innerHTML = `
    <h1 class="fw-bold mb-4">${i18n.t('login')}</h1>
    <div id="error-alert" class="alert alert-danger d-none mx-auto" style="max-width: 320px;"></div>
    <form id="login-form" class="mx-auto" style="max-width: 320px;">
      <div class="mb-3">
        <input type="email" id="email" class="form-control" placeholder="${i18n.t('email')}" required />
      </div>
      <div class="mb-3">
        <input type="password" id="password" class="form-control" placeholder="${i18n.t('password')}" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">${i18n.t('login')}</button>
    </form>
    <p class="mt-3">
        ${i18n.t('no_account')} <button class="btn btn-link" id="register-link">${i18n.t('register')}</button>
    </p>
  `;
  
  const form = div.querySelector<HTMLFormElement>('#login-form')!;
  form.onsubmit = (e) => {
      e.preventDefault();
      const email = (div.querySelector('#email') as HTMLInputElement).value;
      const password = (div.querySelector('#password') as HTMLInputElement).value;
      const success = login(email, password);
      if (!success) {
          const errorAlert = div.querySelector<HTMLDivElement>('#error-alert')!;
          errorAlert.textContent = i18n.t('login_failed');
          errorAlert.classList.remove('d-none');
      }
  };

  div.querySelector<HTMLButtonElement>('#register-link')!.onclick = () => setView({ name: 'register' });
  
  return div;
};