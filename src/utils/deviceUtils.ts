import { UAParser } from 'ua-parser-js';
import { globals } from './globals';
import { MSHOP } from './deviceTypes';
export function isIOSmshop() {
    const ua = new UAParser(globals.navigator.userAgent);
    const os = ua.getOS();
    return ((os.name === 'iOS' || os.name === 'Mac OS') &&
        // to check for iphones/ipads which has more maxTouchPoints
        globals.navigator.maxTouchPoints > 2 &&
        MSHOP.includes(globals.amznMusic.appConfig.deviceType));
}
