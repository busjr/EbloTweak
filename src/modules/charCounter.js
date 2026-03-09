window.AppModules = window.AppModules || {};

window.AppModules.initCharCounter = (enabled) => {
  const existing = document.getElementById('ext-char-counter');
  if (existing) existing.remove();
  if (!enabled) return;

  const style = document.createElement('style');
  style.id = 'ext-char-counter';

  style.textContent = `
      .char-counter.hidden {
          display: block !important;
          visibility: visible !important;
        }
    `;
  document.head.appendChild(style);
};

