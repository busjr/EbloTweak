const API = typeof browser !== "undefined" ? browser : chrome;

const apply = (res) => {
  const data = {
    theme: { ...DEFAULTS.theme, ...(res.theme || {}) },
    previews: { ...DEFAULTS.previews, ...(res.previews || {}) },
    charCounter: { ...DEFAULTS.charCounter, ...(res.charCounter || {}) }
  };
  AppModules.applyTheme(data.theme);
  AppModules.initVideoPreviews(data.previews.enabled);
  AppModules.initCharCounter(data.charCounter.enabled);
  
  return data;
};

API.storage.local.get(null, (res) => {
  let state = apply(res);

  const observer = new MutationObserver(() => {
    const target = document.getElementById("nsfw-consent-toggle");
    if (!document.getElementById("ext-custom-settings")) {
      window.buildCustomSettingsUI(state, (updated) => {
        state = updated;
        API.storage.local.set(updated, () => apply(updated));
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
});