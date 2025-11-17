import App from './App.tsx';

// Ensure DOM is ready before initializing
try {
  // Show loading indicator
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div class="d-flex justify-content-center align-items-center min-vh-100"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        const app = new App();
        app.init();
      } catch (error) {
        console.error('Error initializing app:', error);
        const rootEl = document.getElementById('root');
        if (rootEl) {
          rootEl.innerHTML = `<div class="alert alert-danger m-3">
            <h4>Error loading application</h4>
            <p>Please refresh the page.</p>
            <pre>${error instanceof Error ? error.message : String(error)}</pre>
            <pre>${error instanceof Error ? error.stack : ''}</pre>
          </div>`;
        }
      }
    });
  } else {
    try {
      const app = new App();
      app.init();
    } catch (error) {
      console.error('Error initializing app:', error);
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.innerHTML = `<div class="alert alert-danger m-3">
          <h4>Error loading application</h4>
          <p>Please refresh the page.</p>
          <pre>${error instanceof Error ? error.message : String(error)}</pre>
          <pre>${error instanceof Error ? error.stack : ''}</pre>
        </div>`;
      }
    }
  }
} catch (error) {
  console.error('Fatal error:', error);
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `<div class="alert alert-danger m-3">
      <h4>Fatal error loading application</h4>
      <p>Please check the console for details.</p>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>`;
  }
}
