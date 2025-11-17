import App from './App.tsx';

// Ensure DOM is ready before initializing
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        const app = new App();
        app.init();
      } catch (error) {
        console.error('Error initializing app:', error);
        document.getElementById('root')!.innerHTML = '<div class="alert alert-danger m-3">Error loading application. Please refresh the page.</div>';
      }
    });
  } else {
    try {
      const app = new App();
      app.init();
    } catch (error) {
      console.error('Error initializing app:', error);
      document.getElementById('root')!.innerHTML = '<div class="alert alert-danger m-3">Error loading application. Please refresh the page.</div>';
    }
  }
} catch (error) {
  console.error('Fatal error:', error);
  if (document.getElementById('root')) {
    document.getElementById('root')!.innerHTML = '<div class="alert alert-danger m-3">Fatal error loading application. Please check the console.</div>';
  }
}
