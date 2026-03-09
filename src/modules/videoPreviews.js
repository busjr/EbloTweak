window.AppModules = window.AppModules || {};

window.AppModules.initVideoPreviews = (enabled) => {
  document.removeEventListener("mouseover", window._extEnter, true);
  if (!enabled) return;

  window._extEnter = (e) => {
    const card = e.target.closest(".feed-card") || e.target.closest(".feed-card-link");
    if (!card || card._hasPreview) return;

    const img = card.querySelector('img[data-full-src]');
    if (!img) return;

    const videoUrlRaw = img.getAttribute("data-full-src");
    if (!/\.(mp4|webm|mov|ogv)/i.test(videoUrlRaw)) return;
    card._hasPreview = true;

    const cleanup = () => {
      clearTimeout(card._previewTimeout);
      const video = card.querySelector(".ext-preview-video");
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.remove();
      }
      card._hasPreview = false;
      card.removeEventListener("mouseleave", cleanup);
    };

    card.addEventListener("mouseleave", cleanup);

    card._previewTimeout = setTimeout(() => {
      if (!card._hasPreview) return;

      let videoUrl = videoUrlRaw;
      if (videoUrl.startsWith("/")) videoUrl = window.location.origin + videoUrl;
      const container = card.querySelector(".feed-card-preview") || img.parentElement;
      if (!container) return;

      const video = document.createElement("video");
      video.muted = video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "none";
      video.className = "ext-preview-video";
      video.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 999;
          pointer-events: none;
          border-radius: inherit;
          background: #000;
          opacity: 0;
          transition: opacity 0.2s;";
        `;
      video.onerror = () => cleanup();
      video.oncanplay = () => {
        video.style.opacity = "1";
      };
      container.appendChild(video);
      setTimeout(() => {
        if (!card._hasPreview) return;

        const needsEncoding = /[а-яё]/i.test(videoUrl) && !videoUrl.includes('%');
        video.src = needsEncoding ? encodeURI(videoUrl) : videoUrl;
        video.load();
        video.play().catch(() => { });
      }, 0);

    }, 150);
  };

  document.addEventListener("mouseover", window._extEnter, true);
};

