// дефолт настройки
const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
    theme: {
        enabled: false,
        bgColor: "#202020",
        bgImage: "",
        accentColor: "#789d2a",
        gradientEnabled: false,
        gradientColor: "#4a4a4a"
    },
    previews: { enabled: false },
    scroll: { enabled: false },
    charCounter: { enabled: false }
};