import { DOWNLOAD_FROM_URL, NAVIGATE_TO_URL } from '../actions';
import { globals } from '../utils';
import { UPSELL_ON_PLAYBACK_ERROR_DEVICES } from '../utils/deviceTypes';
import { openInExternalBrowser } from '../mash/mash-app';
export const NavigationMiddleware = (store) => (next) => (action) => {
    next(action);
    if (action.type === NAVIGATE_TO_URL) {
        if (action.payload.openInNewWindow) {
            if (UPSELL_ON_PLAYBACK_ERROR_DEVICES.includes(globals.amznMusic.appConfig.deviceType)) {
                if (typeof window.P !== 'undefined') {
                    window.P.when('mash').execute((mashApp) => {
                        openInExternalBrowser(action.payload.uri, mashApp);
                    });
                }
            }
            else {
                window.open(action.payload.uri, '_blank', 'rel=noreferrer, toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes');
            }
        }
        else {
            globals.setLocation(action.payload.uri);
        }
    }
    if (action.type === DOWNLOAD_FROM_URL) {
        // This block of code is terrible, but as far as I can
        // tell this is the only cross browser way to initiate downloads for
        // cross-origin resources. If something better comes along please use that.
        // This code was adapted from the Legacy Web Player (removed some jQuery and metrics stuff).
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.className = 'downloadIframe';
        document.body.appendChild(iframe);
        iframe.src = action.payload.uri;
        setTimeout(() => {
            iframe.remove();
        }, 5000);
    }
};
