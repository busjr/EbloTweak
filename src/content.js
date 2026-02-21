const injectInterface = () => {
    if (document.getElementById('ext-custom-settings')) return;

    const targetInput = document.getElementById('nsfw-consent-toggle');
    if (!targetInput) return;
    const targetRow = targetInput.closest('.settings-toggle')?.parentElement;

    const wrapper = document.createElement('div');
    wrapper.id = 'ext-custom-settings';
    // wrapper.style.cssText = 'margin-top: 15px; border-top: 1px solid #333; padding-top: 15px;';

    wrapper.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span class="settings-row-label">Кастомная тема</span>
            <label class="settings-toggle"><input type="checkbox" id="ext-master-switch"><span class="settings-toggle-slider"></span></label>
        </div>
        <div id="ext-controls-group" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="color" id="ext-color" title="Цвет фона" style="width: 100%; height: 30px; cursor: pointer; border: none; border-radius: 4px; background: none; box-sizing: border-box;">
            <input type="text" id="ext-url" placeholder="URL картинки фона" style="width: 100%; padding: 8px; background: #111; color: #fff; border: 1px solid #444; border-radius: 4px; font-size: 12px; box-sizing: border-box;">
            <button id="ext-reset-all" style="width: 100%; padding: 8px; background: #444; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; box-sizing: border-box;">Сбросить всё</button>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; margin-top: 15px; border-top: 1px solid #333; padding-top: 15px;">
            <div class="settings-row-info">
                <span class="settings-row-label">Живые превью</span>
                <span class="settings-row-desc">Видео при наведении</span>
            </div>
            <label class="settings-toggle"><input type="checkbox" id="ext-preview-switch"><span class="settings-toggle-slider"></span></label>
        </div>
    `;

    targetRow.after(wrapper);
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