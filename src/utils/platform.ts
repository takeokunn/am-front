import { globals } from './globals';
const uaMobileDeviceTypes = [
    'iPhone',
    'iPad',
    'iPod',
    'Android',
    'Kindle',
    'Silk',
    'Windows Phone',
];
const matchMedia = (win, query) => win.matchMedia ? win.matchMedia(query).matches : false;
export const checkTouch = (win) => matchMedia(win, '(any-pointer:coarse)');
export const isDesktop = (win) => !checkTouch(win);
export const isMobileUserAgent = () => {
    for (const device of uaMobileDeviceTypes) {
        if (globals.navigator.userAgent.includes(device)) {
            return true;
        }
    }
    return false;
};
