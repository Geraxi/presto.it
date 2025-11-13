export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg',
  };

  const spinner = document.createElement('div');
  spinner.className = `spinner-border ${sizeClasses[size]}`;
  spinner.setAttribute('role', 'status');

  const visuallyHidden = document.createElement('span');
  visuallyHidden.className = 'visually-hidden';
  visuallyHidden.textContent = 'Loading...';

  spinner.appendChild(visuallyHidden);
  return spinner;
};
