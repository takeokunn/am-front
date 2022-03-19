/**
 * Open links in an external browser.
 * @param url
 * @param mashApp
 */
export const openInExternalBrowser = (url, mashApp) => {
    if (mashApp) {
        mashApp.openInExternalBrowser({
            url,
        });
    }
};
