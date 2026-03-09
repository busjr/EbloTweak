window.AppModules = window.AppModules || {};

window.AppModules.applyTheme = (data) => {
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
};

