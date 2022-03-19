import { SHARE_URL } from '../actions';
import { globals } from '../utils';
import { MOBILE_DEVICES } from '../utils/deviceTypes';
// eslint-disable-next-line max-len
export const ShareMiddleware = (store) => (next) => async (action) => {
    var _a, _b;
    next(action);
    if (action.type !== SHARE_URL) {
        return;
    }
    if (MOBILE_DEVICES.includes(globals.amznMusic.appConfig.deviceType)) {
        (_b = (_a = globals.navigator).share) === null || _b === void 0 ? void 0 : _b.call(_a, action.payload);
    }
    else {
        const el = document.createElement('textarea');
        el.value = action.payload.url;
        document.body.appendChild(el);
        el.select();
        el.setSelectionRange(0, 9999);
        document.execCommand('copy');
        document.body.removeChild(el);
    }
};
