// дефолт настройки
const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
    theme: {
        enabled: false,
        bgColor: '#202020',
        bgImage: ''
    },
    layout: {
        hideSidebar: false,
        compactMode: false
    }
};