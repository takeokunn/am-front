import { cleanDeeplink, globals } from '../utils';
import { reportFlexEvent } from './reportFlexEvent';
function mark(name) {
    var _a, _b;
    (_b = (_a = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _a === void 0 ? void 0 : _a.mark) === null || _b === void 0 ? void 0 : _b.call(_a, name);
}
function getEntriesByName(name) {
    var _a, _b;
    return (_b = (_a = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _a === void 0 ? void 0 : _a.getEntriesByName) === null || _b === void 0 ? void 0 : _b.call(_a, name);
}
function measure(name, startMark, endMark) {
    var _a, _b, _c, _d, _e, _f;
    if (((_b = (_a = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _a === void 0 ? void 0 : _a.getEntriesByName) === null || _b === void 0 ? void 0 : _b.call(_a, startMark).length) > 0) {
        if (endMark) {
            (_d = (_c = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _c === void 0 ? void 0 : _c.measure) === null || _d === void 0 ? void 0 : _d.call(_c, name, startMark, endMark);
        }
        else {
            (_f = (_e = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _e === void 0 ? void 0 : _e.measure) === null || _f === void 0 ? void 0 : _f.call(_e, name, startMark);
        }
    }
}
function hasMark(name) {
    var _a, _b;
    if (!globals.performance) {
        return false;
    }
    return ((_b = (_a = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _a === void 0 ? void 0 : _a.getEntriesByName) === null || _b === void 0 ? void 0 : _b.call(_a, name).length) > 0;
}
function clearMarks(name) {
    var _a, _b;
    return (_b = (_a = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _a === void 0 ? void 0 : _a.clearMarks) === null || _b === void 0 ? void 0 : _b.call(_a, name);
}
function clearMeasures(name) {
    var _a, _b;
    return (_b = (_a = globals === null || globals === void 0 ? void 0 : globals.performance) === null || _a === void 0 ? void 0 : _a.clearMeasures) === null || _b === void 0 ? void 0 : _b.call(_a, name);
}
async function reportPageLatency(entries, deeplink, auth) {
    const { UAParser } = await import(/* webpackChunkName: "metrics" */ 'ua-parser-js');
    const ua = new UAParser(globals.navigator.userAgent);
    return reportFlexEvent('WebPlayerPageLatency', [
        [cleanDeeplink(deeplink), ua.getOS().name, ua.getBrowser().name, ua.getBrowser().major],
        [entries.page.duration, entries.render.duration, entries.request.duration],
    ], auth);
}
export default {
    mark,
    measure,
    hasMark,
    getEntriesByName,
    clearMeasures,
    clearMarks,
    reportPageLatency,
};
