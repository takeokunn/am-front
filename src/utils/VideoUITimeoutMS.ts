/**
 * Provides timeout values in milliseconds for different cases. These timeout values
 * represent how long the UI should display before hiding.
 */
// TODO: need to remove below lines after UX verification
const getTimeoutFromUrlParam = (key) => {
    var _a;
    const searchedValue = (_a = (URLSearchParams && new URLSearchParams(location.search).get(key))) === null || _a === void 0 ? void 0 : _a.match(/^(\d+(.\d+)?)sec$/);
    return searchedValue && searchedValue.length >= 2 && +searchedValue[1] * 1000;
};
const debugControlTimeout = getTimeoutFromUrlParam('debugControlTimeout');
const debugHoverTimeout = getTimeoutFromUrlParam('debugHoverTimeout');
// eslint-disable-next-line no-shadow
var VideoUITimeoutMS;
(function (VideoUITimeoutMS) {
    /**
     * The amount of time to keep the UI locked while hovering over an element
     * before hiding the UI again.
     */
    VideoUITimeoutMS[VideoUITimeoutMS["Hover4s"] = debugHoverTimeout || 4000] = "Hover4s";
    /**
     * The amount of time to keep the UI locked on click to toggle the play state
     * before hiding the UI again.
     */
    VideoUITimeoutMS[VideoUITimeoutMS["ClickToToggle"] = 3000] = "ClickToToggle";
    /**
     * The standard amount of time to lock the UI for before hiding it.
     */
    VideoUITimeoutMS[VideoUITimeoutMS["Standard"] = debugControlTimeout || 1500] = "Standard";
})(VideoUITimeoutMS || (VideoUITimeoutMS = {}));
export default VideoUITimeoutMS;
