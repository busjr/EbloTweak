const injectInterface = () => {
    if (document.getElementById('ext-custom-settings')) return;

    const targetInput = document.getElementById('nsfw-consent-toggle');
    if (!targetInput) return;

    // Берём строку настройки
    const targetRow = targetInput.closest('.settings-row')
        || targetInput.closest('.settings-toggle')?.parentElement;

    if (!targetRow) return;

    // Контейнер всех настроек
    const settingsContainer = targetRow.parentElement;
    if (!settingsContainer) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'ext-custom-settings';

    wrapper.innerHTML = `
    <div style="font-size:12px; color:#888; margin: 20px 0 8px 0; text-transform:uppercase; letter-spacing: 0.5px;">
        EbloTweak Дополнения
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

    <div id="ext-controls-group" style="display:flex; flex-direction:column; gap:10px; padding: 12px 0; border-bottom: 1px solid #ffffff11;">
        <input type="color" id="ext-color" title="Цвет фона"
            style="width:100%; height:32px; cursor:pointer; border:1px solid #444; border-radius:6px; background:#111; padding:2px; box-sizing:border-box;">

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

    <button id="ext-reset-all"
        style="width:100%; margin-top:8px; padding:10px;">
        Сбросить дополнительные настройки
    </button>
`;

    settingsContainer.appendChild(wrapper);
    setupEventListeners();
};

const setupEventListeners = () => {
    const swTheme = document.getElementById('ext-master-switch');
    const swVideo = document.getElementById('ext-preview-switch');
    const col = document.getElementById('ext-color');
    const img = document.getElementById('ext-url');

    api.storage.local.get(['theme', 'previews'], (res) => {
        const themeData = res.theme || DEFAULTS.theme;
        swTheme.checked = themeData.enabled;
        swVideo.checked = res.previews?.enabled || false;
        col.value = themeData.bgColor || '#202020';
        img.value = themeData.bgImage || '';
        AppModules.applyTheme(themeData);
        AppModules.initVideoPreviews(swVideo.checked);
    });

    const save = () => {
        const themeData = { enabled: swTheme.checked, bgColor: col.value, bgImage: img.value };
        const previewData = { enabled: swVideo.checked };
        api.storage.local.set({ theme: themeData, previews: previewData });
        AppModules.applyTheme(themeData);
        AppModules.initVideoPreviews(swVideo.checked);
    };

    swTheme.onchange = save;
    swVideo.onchange = save;
    col.oninput = save;
    img.onchange = save;
    document.getElementById('ext-reset-all').onclick = () => api.storage.local.clear(() => location.reload());
};

const observer = new MutationObserver(() => {
    if (document.getElementById('nsfw-consent-toggle')) injectInterface();
});
observer.observe(document.body, { childList: true, subtree: true });

api.storage.local.get(['theme', 'previews'], (res) => {
    if (res.theme?.enabled) AppModules.applyTheme(res.theme);
    if (res.previews?.enabled) AppModules.initVideoPreviews(true);
});