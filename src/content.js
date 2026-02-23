(() => {
  const getApi = () => {
    if (typeof api !== "undefined") return api;
    if (typeof browser !== "undefined") return browser;
    return chrome;
  };

  const API = getApi();

  const ensureDefaults = () => {
    if (typeof DEFAULTS === "undefined") {
      window.DEFAULTS = { theme: { enabled: false, bgColor: "#202020", bgImage: "" } };
    }
    if (!DEFAULTS.theme) DEFAULTS.theme = { enabled: false, bgColor: "#202020", bgImage: "" };
    if (!DEFAULTS.previews) DEFAULTS.previews = { enabled: false };
    if (!DEFAULTS.scroll) DEFAULTS.scroll = { enabled: false };
    if (!("accentColor" in DEFAULTS.theme)) DEFAULTS.theme.accentColor = "#789d2a";
    if (!("gradientEnabled" in DEFAULTS.theme)) DEFAULTS.theme.gradientEnabled = false;
    if (!("gradientColor" in DEFAULTS.theme)) DEFAULTS.theme.gradientColor = "#4a4a4a";
  };

  ensureDefaults();

  const injectInterface = () => {
    if (document.getElementById("ext-custom-settings")) return;

    const targetInput = document.getElementById("nsfw-consent-toggle");
    if (!targetInput) return;

    const targetRow = targetInput.closest(".settings-row")
      || targetInput.closest(".settings-toggle")?.parentElement;

    if (!targetRow) return;

    const settingsContainer = targetRow.parentElement;
    if (!settingsContainer) return;

    const wrapper = document.createElement("div");
    wrapper.id = "ext-custom-settings";

    // получаем версию
    const manifestData = chrome.runtime.getManifest();
    const version = manifestData.version;

    wrapper.innerHTML = `
      <div style="font-size:12px; color:#888; margin: 20px 0 8px 0; text-transform:uppercase; letter-spacing: 0.5px;">
          EbloTweak Дополнения ver${version}
      </div>

      <div class="settings-row">
          <div class="settings-row-info">
              <span class="settings-row-label">Кастомная тема</span>
              <div class="settings-row-desc">Включить кастомную тему</div>
          </div>
          <label class="settings-toggle">
              <input type="checkbox" id="ext-master-switch">
              <span class="settings-toggle-slider"></span>
          </label>
      </div>

      <div id="ext-controls-group" style="display:none; flex-direction:column; gap:10px; padding: 12px 0; border-bottom: 1px solid #ffffff11;">
          <div style="display:flex; gap:10px;">
            <input type="color" id="ext-color" title="Цвет фона"
              style="flex:1; height:32px; cursor:pointer; border:1px solid #444; border-radius:6px; background:#111; padding:2px; box-sizing:border-box;">
            <input type="color" id="ext-accent" title="Акцент (кнопки/рамки)"
              style="flex:1; height:32px; cursor:pointer; border:1px solid #444; border-radius:6px; background:#111; padding:2px; box-sizing:border-box;">
          </div>

          <div class="settings-row" style="padding: 8px 0; border-bottom:none;">
            <div class="settings-row-info">
              <span class="settings-row-label" style="font-size:14px;">Enable gradient</span>
              <div class="settings-row-desc">Градиент на фоне</div>
            </div>
            <label class="settings-toggle">
              <input type="checkbox" id="ext-gradient-switch">
              <span class="settings-toggle-slider"></span>
            </label>
          </div>

          <div id="ext-gradient-wrap" style="display:none;">
            <input type="color" id="ext-gradient-color" title="Gradient color"
              style="width:100%; height:32px; cursor:pointer; border:1px solid #444; border-radius:6px; background:#111; padding:2px; box-sizing:border-box;">
          </div>

          <input type="text" id="ext-url" placeholder="URL картинки фона"
              style="width:100%; padding:10px; background:#111; color:#fff; border:1px solid #444; border-radius:6px; font-size:13px; box-sizing:border-box;">
      </div>

      <div class="settings-row">
          <div class="settings-row-info">
              <span class="settings-row-label">Живые превью</span>
              <div class="settings-row-desc">Воспроизводить видео при наведении</div>
          </div>
          <label class="settings-toggle">
              <input type="checkbox" id="ext-preview-switch">
              <span class="settings-toggle-slider"></span>
          </label>
      </div>

      <div class="settings-row">
          <div class="settings-row-info">
              <span class="settings-row-label">Кнопка «Наверх»</span>
              <div class="settings-row-desc">Показать кнопку быстрого возврата</div>
          </div>
          <label class="settings-toggle">
              <input type="checkbox" id="ext-scroll-switch">
              <span class="settings-toggle-slider"></span>
          </label>
      </div>

      <button id="ext-reset-all" style="width:100%; margin-top:8px; padding:10px;">
          Сбросить дополнительные настройки
      </button>
    `;

    settingsContainer.appendChild(wrapper);
    setupEventListeners();
  };

  const setupEventListeners = () => {
    const swTheme = document.getElementById("ext-master-switch");
    const swVideo = document.getElementById("ext-preview-switch");
    const swScroll = document.getElementById("ext-scroll-switch");

    const group = document.getElementById("ext-controls-group");
    const col = document.getElementById("ext-color");
    const accent = document.getElementById("ext-accent");

    const swGrad = document.getElementById("ext-gradient-switch");
    const gradWrap = document.getElementById("ext-gradient-wrap");
    const gradColor = document.getElementById("ext-gradient-color");

    const img = document.getElementById("ext-url");

    const syncVisibility = () => {
      group.style.display = swTheme.checked ? "flex" : "none";
      gradWrap.style.display = (swTheme.checked && swGrad.checked) ? "block" : "none";
    };

    API.storage.local.get(["theme", "previews", "scroll"], (res) => {
      const themeData = { ...DEFAULTS.theme, ...(res.theme || {}) };
      const previewsData = { ...DEFAULTS.previews, ...(res.previews || {}) };
      const scrollData = { ...DEFAULTS.scroll, ...(res.scroll || {}) };

      swTheme.checked = !!themeData.enabled;
      swVideo.checked = !!previewsData.enabled;
      swScroll.checked = !!scrollData.enabled;

      col.value = themeData.bgColor || DEFAULTS.theme.bgColor;
      img.value = themeData.bgImage || "";
      accent.value = themeData.accentColor || DEFAULTS.theme.accentColor;

      swGrad.checked = !!themeData.gradientEnabled;
      gradColor.value = themeData.gradientColor || DEFAULTS.theme.gradientColor;

      syncVisibility();
      AppModules.applyTheme(themeData);
      AppModules.initVideoPreviews(!!previewsData.enabled);
      AppModules.initScrollTop(!!scrollData.enabled);
    });

    const save = () => {
      const themeData = {
        enabled: !!swTheme.checked,
        bgColor: col.value,
        bgImage: img.value,
        accentColor: accent.value,
        gradientEnabled: !!swGrad.checked,
        gradientColor: gradColor.value
      };

      const previewData = { enabled: !!swVideo.checked };
      const scrollData = { enabled: !!swScroll.checked };
      API.storage.local.set({ theme: themeData, previews: previewData, scroll: scrollData });

      syncVisibility();
      AppModules.applyTheme(themeData);
      AppModules.initVideoPreviews(!!swVideo.checked);
      AppModules.initScrollTop(!!swScroll.checked);
    };

    swTheme.onchange = save;
    swVideo.onchange = save;
    swScroll.onchange = save;

    col.oninput = save;
    accent.oninput = save;
    swGrad.onchange = save;
    gradColor.oninput = save;
    img.onchange = save;

    document.getElementById("ext-reset-all").onclick = () =>
      API.storage.local.clear(() => location.reload());
  };

  const observer = new MutationObserver(() => {
    if (document.getElementById("nsfw-consent-toggle")) injectInterface();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  API.storage.local.get(["theme", "previews", "scroll"], (res) => {
    const themeData = { ...DEFAULTS.theme, ...(res.theme || {}) };
    const previewsData = { ...DEFAULTS.previews, ...(res.previews || {}) };
    const scrollData = { ...DEFAULTS.scroll, ...(res.scroll || {}) };
    AppModules.applyTheme(themeData);

    if (previewsData.enabled) AppModules.initVideoPreviews(true);
    if (scrollData.enabled) AppModules.initScrollTop(true);
  });
})();