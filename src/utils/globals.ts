import * as dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
// eslint-disable-next-line import/no-mutable-exports
let globals;
export function createGlobals() {
    const win = window;
    const doc = window === null || window === void 0 ? void 0 : window.document;
    const location = win === null || win === void 0 ? void 0 : win.location;
    const localStorage = win === null || win === void 0 ? void 0 : win.localStorage;
    const navigator = win === null || win === void 0 ? void 0 : win.navigator;
    const MediaMetadata = win === null || win === void 0 ? void 0 : win.MediaMetadata;
    const fetchNative = (win === null || win === void 0 ? void 0 : win.fetch) && (win === null || win === void 0 ? void 0 : win.fetch.bind(win));
    const history = win === null || win === void 0 ? void 0 : win.history;
    const amznMusic = win === null || win === void 0 ? void 0 : win.amznMusic;
    const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = (win === null || win === void 0 ? void 0 : win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) &&
        (win === null || win === void 0 ? void 0 : win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__.bind(win));
    const performance = win === null || win === void 0 ? void 0 : win.performance;
    const setLocation = (uri) => {
        // @ts-ignore
        win === null || win === void 0 ? void 0 : win.location = uri;
    };
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const tz = dayjs.tz.guess();
    globals = {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
        amznMusic,
        document: doc,
        fetch: fetchNative,
        history,
        localStorage,
        location,
        MediaMetadata,
        navigator,
        performance,
        setLocation,
        window: win,
        timezone: tz,
    };
    return globals;
}
createGlobals();
export const useSourceCasing = () => {
    var _a, _b;
    return globals.location.href.includes('music.amazon.co.jp') ||
        globals.location.href.includes('music-jp-pdx') ||
        ((_b = (_a = globals.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.musicTerritory) === 'JP';
};
export { globals };
