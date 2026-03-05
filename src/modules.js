const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const hexToRgb = (hex) => {
  const h = String(hex || "").replace("#", "").trim();
  const hh = h.length === 3 ? h.split("").map(x => x + x).join("") : h;
  const n = parseInt(hh || "000000", 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHex = (r, g, b) =>
  "#" + [r, g, b].map(x => clamp(x, 0, 255).toString(16).padStart(2, "0")).join("");

const mix = (a, b, t) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(
    Math.round(A.r + (B.r - A.r) * t),
    Math.round(A.g + (B.g - A.g) * t),
    Math.round(A.b + (B.b - A.b) * t)
  );
};

const rgbaFromHex = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
};

const AppModules = {
  applyTheme: (data) => {
    const root = document.documentElement;
    const body = document.body;

    if (!data || !data.enabled) {
      root.classList.remove("ext-enabled");
      if (body) body.classList.remove("theme-solid", "theme-gradient");
      [
        "--ext-bg", "--ext-header", "--ext-surface", "--ext-text", "--ext-muted", "--ext-border",
        "--ext-accent", "--ext-btn-border", "--ext-g1", "--ext-g2"
      ].forEach(v => root.style.removeProperty(v));
      if (body) {
        body.style.backgroundImage = "";
        body.style.backgroundAttachment = "";
        body.style.backgroundSize = "";
        body.style.backgroundRepeat = "";
        body.style.backgroundPosition = "";
      }
      return;
    }

    const bg = data.bgColor || "#789d2a";
    const accent = data.accentColor || "#789d2a";
    const gradOn = !!data.gradientEnabled;
    const g2 = data.gradientColor || mix(bg, "#000000", 0.22);
    const img = String(data.bgImage || "").trim();

    const text = "#ffffff";
    const surface = mix(bg, "#000000", 0.18);

    root.classList.add("ext-enabled");

    root.style.setProperty("--ext-bg", bg);
    root.style.setProperty("--ext-header", bg);
    root.style.setProperty("--ext-surface", surface);
    root.style.setProperty("--ext-text", text);
    root.style.setProperty("--ext-muted", rgbaFromHex(text, 0.72));
    root.style.setProperty("--ext-border", rgbaFromHex(text, 0.14));

    root.style.setProperty("--ext-accent", accent);
    root.style.setProperty("--ext-accent-text", accent);
    root.style.setProperty("--ext-btn-border", rgbaFromHex(accent, 0.85));

    root.style.setProperty("--ext-g1", bg);
    root.style.setProperty("--ext-g2", g2);

    if (body) {
      body.classList.remove("theme-solid", "theme-gradient");
      body.classList.add(gradOn ? "theme-gradient" : "theme-solid");

      if (img) {
        const safe = img.replace(/"/g, '\\"');
        body.style.backgroundImage = `url("${safe}")`;
        body.style.backgroundAttachment = "fixed";
        body.style.backgroundSize = "cover";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = "center";
      } else {
        body.style.backgroundImage = "";
        body.style.backgroundAttachment = "";
        body.style.backgroundSize = "";
        body.style.backgroundRepeat = "";
        body.style.backgroundPosition = "";
      }
    }
  },

  initVideoPreviews: (enabled) => {
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
        `
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
  },

  initScrollTop: (enabled) => {
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
        display: flex;
        opacity: 0;
        visibility: hidden;
        transition: .3s;
        z-index: 9999;
      }
      .ext-scroll-top-btn.show {
        opacity: 1;
        visibility: visible;
      }
    `;
      document.head.appendChild(style);
    }
  }
};