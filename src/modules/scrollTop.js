window.AppModules = window.AppModules || {};

window.AppModules.initScrollTop = (enabled) => {
  const existing = document.getElementById('ext-scroll-top');
  if (existing) existing.remove();

  if (!enabled) return;

  const btn = document.createElement('div');
  btn.id = 'ext-scroll-top';
  btn.className = 'support-btn ext-scroll-top-btn';
  btn.title = 'Наверх';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
      <path d="M7 14l5-5 5 5H7z"/>
    </svg>
  `;

  document.body.appendChild(btn);

  btn.onclick = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  const onScroll = () =>
    btn.classList.toggle('show', window.scrollY > 300);

  window.addEventListener('scroll', onScroll);
  onScroll();

  if (!document.getElementById('ext-scroll-style')) {
    const style = document.createElement('style');
    style.id = 'ext-scroll-style';
    style.textContent = `
      .ext-scroll-top-btn {
        position: fixed;
        bottom: 20px;
        left: 50%;
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(20, 20, 20, 0.7);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: .3s;
        z-index: 9999;
      }
      .ext-scroll-top-btn.show {
        opacity: 1;
        visibility: visible;
      }
      .ext-scroll-top-btn svg {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }
};

