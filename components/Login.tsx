import { i18n } from '../hooks/useI18n.js';

// Add a more robust TypeScript declaration for the global bootstrap object.
declare global {
  interface Window {
    bootstrap: any;
  }
}

/**
 * Awaits for the Bootstrap library to be available on the window object,
 * then executes a callback. This provides a robust way to handle script
 * loading race conditions.
 * @param callback The function to execute once Bootstrap is ready.
 */
const onBootstrapReady = (callback: () => void) => {
  // Check specifically for the Modal property to ensure bootstrap is fully initialized.
  if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
    callback();
    return;
  }

  // Poll for the bootstrap object to become available.
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
      clearInterval(interval);
      callback();
    } else if (attempts > 100) { // Timeout after 5 seconds
      clearInterval(interval);
      console.error('Bootstrap Modal component failed to load in time. Modal cannot be opened.');
    }
  }, 50);
};


export const renderLogin = (state, actions) => {
    const { users } = state;
    const { login, register } = actions;

    onBootstrapReady(() => {
        // Remove any existing modals to prevent conflicts
        const existingModalEl = document.getElementById('loginModal');
        if (existingModalEl) {
            const modalInstance = window.bootstrap.Modal.getInstance(existingModalEl);
            if (modalInstance) {
                // Hiding is async, the 'hidden.bs.modal' listener on the original modal should handle removal
                modalInstance.hide();
            }
             // Fallback to ensure the element is removed if hide fails or has no listener
            existingModalEl.remove();
        }

        const modalEl = document.createElement('div');
        modalEl.className = 'modal fade';
        modalEl.id = 'loginModal';
        modalEl.tabIndex = -1;

        let modal; // Declare modal instance variable to be accessible in the scope

        const renderForm = (isRegistering = false) => {
            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${isRegistering ? i18n.t('create_account') : i18n.t('login_to_presto')}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="error-alert" class="alert alert-danger d-none"></div>
                            <form id="auth-form" class="row g-3">
                                ${isRegistering ? `
                                    <div class="col-12">
                                        <label for="name" class="form-label">${i18n.t('name')}</label>
                                        <input type="text" class="form-control" id="name" required>
                                    </div>
                                ` : ''}
                                <div class="col-12">
                                    <label for="email" class="form-label">${i18n.t('email')}</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                                <div class="col-12">
                                    <label for="password" class="form-label">${i18n.t('password')}</label>
                                    <input type="password" class="form-control" id="password" required>
                                </div>
                                ${isRegistering ? `
                                    <div class="col-12">
                                        <label for="confirm-password" class="form-label">${i18n.t('confirm_password')}</label>
                                        <input type="password" class="form-control" id="confirm-password" required>
                                    </div>
                                ` : ''}
                            </form>
                        </div>
                        <div class="modal-footer d-block text-center">
                            <button type="submit" form="auth-form" class="btn btn-primary w-100 mb-3">${isRegistering ? i18n.t('register') : i18n.t('login')}</button>
                            <p class="text-muted small">
                                ${isRegistering ? i18n.t('already_have_account') : i18n.t('no_account')}
                                <button class="btn btn-link p-0" id="toggle-mode">${isRegistering ? i18n.t('login') : i18n.t('register')}</button>
                            </p>
                        </div>
                    </div>
                </div>
            `;

            const form = modalEl.querySelector<HTMLFormElement>('#auth-form')!;
            form.onsubmit = (e) => {
                e.preventDefault();
                const email = (form.querySelector('#email') as HTMLInputElement).value;
                const password = (form.querySelector('#password') as HTMLInputElement).value;
                const errorAlert = modalEl.querySelector<HTMLDivElement>('#error-alert')!;
                errorAlert.classList.add('d-none');
                
                if (isRegistering) {
                    const name = (form.querySelector('#name') as HTMLInputElement).value;
                    const confirmPassword = (form.querySelector('#confirm-password') as HTMLInputElement).value;
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
                    modal.hide();
                } else {
                    const success = login(email, password);
                    if (!success) {
                        errorAlert.textContent = i18n.t('login_failed');
                        errorAlert.classList.remove('d-none');
                    } else {
                        modal.hide();
                    }
                }
            };

            modalEl.querySelector<HTMLButtonElement>('#toggle-mode')!.onclick = () => renderForm(!isRegistering);
        };

        renderForm();
        document.body.appendChild(modalEl);
        
        modal = new window.bootstrap.Modal(modalEl);
        modal.show();

        modalEl.addEventListener('hidden.bs.modal', () => {
            modalEl.remove();
        });
    });
};