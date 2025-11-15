import { i18n } from '../hooks/useI18n.js';

export const renderRegisterView = (state, actions) => {
  const { register, setView } = actions;
  const { users } = state;
  
  const div = document.createElement('div');
  div.className = 'container text-center py-5';
  div.innerHTML = `
    <h1 class="fw-bold mb-4">${i18n.t('register')}</h1>
     <div id="error-alert" class="alert alert-danger d-none mx-auto" style="max-width: 320px;"></div>
    <form id="register-form" class="mx-auto" style="max-width: 320px;">
      <div class="mb-3">
        <input type="text" id="name" class="form-control" placeholder="${i18n.t('name')}" required />
      </div>
      <div class="mb-3">
        <input type="email" id="email" class="form-control" placeholder="${i18n.t('email')}" required />
      </div>
      <div class="mb-3">
        <input type="password" id="password" class="form-control" placeholder="${i18n.t('password')}" required />
      </div>
       <div class="mb-3">
        <input type="password" id="confirm-password" class="form-control" placeholder="${i18n.t('confirm_password')}" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">${i18n.t('register')}</button>
    </form>
    <p class="mt-3">
        ${i18n.t('already_have_account')} <button class="btn btn-link" id="login-link">${i18n.t('login')}</button>
    </p>
  `;

  const form = div.querySelector<HTMLFormElement>('#register-form')!;
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = (div.querySelector('#name') as HTMLInputElement).value;
    const email = (div.querySelector('#email') as HTMLInputElement).value;
    const password = (div.querySelector('#password') as HTMLInputElement).value;
    const confirmPassword = (div.querySelector('#confirm-password') as HTMLInputElement).value;
    const errorAlert = div.querySelector<HTMLDivElement>('#error-alert')!;
    errorAlert.classList.add('d-none');

    if (password !== confirmPassword) {
        errorAlert.textContent = i18n.t('passwords_no_match');
        errorAlert.classList.remove('d-none');
        return;
    }
    if (users.some(u => u.email === email)) {
        errorAlert.textContent = i18n.t('email_exists');
        errorAlert.classList.remove('d-none');
        return;
    }

    register(name, email, password);
  };
  
  div.querySelector<HTMLButtonElement>('#login-link')!.onclick = () => setView({ name: 'login' });
  
  return div;
};