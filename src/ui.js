window.buildCustomSettingsUI = (state, onSave) => {
  if (document.getElementById("ext-custom-settings")) return;

  const target = document.getElementById("nsfw-consent-toggle");
  const parent = target?.closest(".settings-row")?.parentElement;
  if (!parent) return;

  const wrapper = document.createElement("div");
  wrapper.id = "ext-custom-settings";

  const manifestData = chrome.runtime.getManifest();
  const version = manifestData.version;
  wrapper.innerHTML = `
      <div style="font-size:12px; color:#888; margin: 20px 0 8px 0; text-transform:uppercase; letter-spacing: 0.5px;">
          EbloTweak Дополнения v${version}
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
      <div class="settings-row">
          <div class="settings-row-info">
              <span class="settings-row-label">Счетчик символов</span>
              <div class="settings-row-desc">Показывать количество знаков в постах</div>
          </div>
          <label class="settings-toggle">
              <input type="checkbox" id="ext-char-switch">
              <span class="settings-toggle-slider"></span>
          </label>
      </div>
      <button id="ext-reset-all" style="width:100%; margin-top:8px; padding:10px;">
          Сбросить дополнительные настройки
      </button>`;

  parent.appendChild(wrapper);

  const ui = {
    swTheme: document.getElementById("ext-master-switch"), 
    swVideo: document.getElementById("ext-preview-switch"), 
    swScroll: document.getElementById("ext-scroll-switch"),
    swChar: document.getElementById("ext-char-switch"),
    group: document.getElementById("ext-controls-group"), 
    col: document.getElementById("ext-color"), 
    accent: document.getElementById("ext-accent"),
    swGrad: document.getElementById("ext-gradient-switch"), 
    gradWrap: document.getElementById("ext-gradient-wrap"), 
    gradColor: document.getElementById("ext-gradient-color"),
    img: document.getElementById("ext-url")
  };

  const sync = () => {
    ui.group.style.display = ui.swTheme.checked ? "flex" : "none";
    ui.gradWrap.style.display = (ui.swTheme.checked && ui.swGrad.checked) ? "block" : "none";
  };

  ui.swTheme.checked = !!state.theme.enabled;
  ui.swVideo.checked = !!state.previews.enabled;
  ui.swScroll.checked = !!state.scroll.enabled;
  ui.swChar.checked = !!state.charCounter.enabled;
  ui.col.value = state.theme.bgColor;
  ui.accent.value = state.theme.accentColor;
  ui.swGrad.checked = !!state.theme.gradientEnabled;
  ui.gradColor.value = state.theme.gradientColor;
  ui.img.value = state.theme.bgImage;
  sync();

  const save = () => {
    sync();
    onSave({
      theme: { 
        enabled: ui.swTheme.checked, 
        bgColor: ui.col.value, 
        bgImage: ui.img.value, 
        accentColor: ui.accent.value, 
        gradientEnabled: ui.swGrad.checked, 
        gradientColor: ui.gradColor.value 
      },
      previews: { enabled: ui.swVideo.checked },
      scroll: { enabled: ui.swScroll.checked },
      charCounter: { enabled: ui.swChar.checked }
    });
  };

  wrapper.querySelectorAll("input").forEach(i => i.onchange = i.oninput = save);
  document.getElementById("ext-reset-all").onclick = () => API.storage.local.clear(() => location.reload());
};