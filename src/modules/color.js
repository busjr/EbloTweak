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
