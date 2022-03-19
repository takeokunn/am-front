import { BIND_TEMPLATE, CREATE_AND_BIND_TEMPLATE, CREATE_TEMPLATE, PARK_SKYFIRE_METHOD, TEMPLATE_RENDERED, URL_CHANGE, } from '../actions';
import Performance from '../utils/performance';
import { reportPagePerformance } from '../utils/reportClientMetrics';
const getTemplateId = (action) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return ((_c = (_b = (_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.template) === null || _b === void 0 ? void 0 : _b.innerTemplate) === null || _c === void 0 ? void 0 : _c.id) ||
        ((_e = (_d = action === null || action === void 0 ? void 0 : action.payload) === null || _d === void 0 ? void 0 : _d.template) === null || _e === void 0 ? void 0 : _e.id) ||
        ((_j = (_h = (_g = (_f = action === null || action === void 0 ? void 0 : action.payload) === null || _f === void 0 ? void 0 : _f.method) === null || _g === void 0 ? void 0 : _g.template) === null || _h === void 0 ? void 0 : _h.innerTemplate) === null || _j === void 0 ? void 0 : _j.id);
};
const getDeeplink = (action) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return ((_d = (_c = (_b = (_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.template) === null || _b === void 0 ? void 0 : _b.innerTemplate) === null || _c === void 0 ? void 0 : _c.templateData) === null || _d === void 0 ? void 0 : _d.deeplink) ||
        ((_g = (_f = (_e = action === null || action === void 0 ? void 0 : action.payload) === null || _e === void 0 ? void 0 : _e.template) === null || _f === void 0 ? void 0 : _f.templateData) === null || _g === void 0 ? void 0 : _g.deeplink);
};
export const PagePerformanceMiddleware = (store) => (next) => (action) => {
    next(action);
    const templateId = getTemplateId(action);
    const deeplink = getDeeplink(action) || '';
    switch (action.type) {
        case CREATE_TEMPLATE:
            if (templateId) {
                Performance.mark(`request:${templateId}`);
                Performance.mark(`create:${templateId}`);
            }
            break;
        case CREATE_AND_BIND_TEMPLATE:
            if (templateId) {
                // Same logic as CREATE_TEMPLATE
                Performance.mark(`request:${templateId}`);
                // Same logic as BIND_TEMPLATE
                Performance.mark(`request:done:${templateId}`);
                Performance.mark(`render:${templateId}`);
                Performance.mark(`createAndBind:${templateId}`);
            }
            break;
        case BIND_TEMPLATE:
            if (templateId) {
                Performance.mark(`request:done:${templateId}`);
                Performance.mark(`render:${templateId}`);
                Performance.mark(`bind:${templateId}`);
            }
            break;
        case PARK_SKYFIRE_METHOD:
            if (templateId) {
                Performance.clearMarks(`request:${templateId}`);
                Performance.clearMarks(`request:done:${templateId}`);
                Performance.clearMarks(`render:${templateId}`);
                Performance.clearMarks(`create:${templateId}`);
                Performance.clearMarks(`bind:${templateId}`);
                Performance.clearMarks(`createAndBind:${templateId}`);
            }
            break;
        case TEMPLATE_RENDERED:
            if (templateId) {
                if (Performance.hasMark(`render:${templateId}`)) {
                    const id = templateId.split('_').pop();
                    Performance.measure(`page:${id}`, `request:${templateId}`);
                    Performance.measure(`render:${id}`, `render:${templateId}`);
                    Performance.measure(`request:${id}`, `request:${templateId}`, `request:done:${templateId}`);
                    const pageEntry = Performance.getEntriesByName(`page:${id}`).pop();
                    const renderEntry = Performance.getEntriesByName(`render:${id}`).pop();
                    const requestEntry = Performance.getEntriesByName(`request:${id}`).pop();
                    if (renderEntry !== undefined && pageEntry !== undefined) {
                        window.sessionStorage.setItem(templateId, String(Math.round(pageEntry.duration)));
                    }
                    if (pageEntry && renderEntry && requestEntry) {
                        const summary = {
                            page: pageEntry,
                            render: renderEntry,
                            request: requestEntry,
                        };
                        Performance.reportPageLatency(summary, deeplink, store.getState().Authentication);
                        Performance.clearMeasures();
                    }
                }
                else {
                    window.sessionStorage.setItem(templateId, '0');
                }
                // Report to client metrics lambda
                if (Performance.hasMark(`create:${templateId}`) ||
                    Performance.hasMark(`createAndBind:${templateId}`)) {
                    const id = templateId.split('_').pop();
                    const isCreateAndBind = Performance.hasMark(`createAndBind:${templateId}`);
                    if (isCreateAndBind) {
                        Performance.measure(`total:${id}`, `createAndBind:${templateId}`);
                    }
                    else {
                        Performance.measure(`create:${id}`, `create:${templateId}`, `bind:${templateId}`);
                        Performance.measure(`bind:${id}`, `bind:${templateId}`);
                        Performance.measure(`total:${id}`, `create:${templateId}`);
                    }
                    const pageEntry = Performance.getEntriesByName(`total:${id}`).pop();
                    const requestEntry = Performance.getEntriesByName(`create:${id}`).pop();
                    const renderEntry = Performance.getEntriesByName(`bind:${id}`).pop();
                    if (pageEntry) {
                        const summary = {
                            pageDuration: pageEntry.duration,
                            requestDuration: requestEntry === null || requestEntry === void 0 ? void 0 : requestEntry.duration,
                            renderDuration: renderEntry === null || renderEntry === void 0 ? void 0 : renderEntry.duration,
                        };
                        reportPagePerformance(store.getState().Authentication, deeplink, isCreateAndBind, summary);
                    }
                    Performance.clearMarks(`create:${templateId}`);
                    Performance.clearMarks(`bind:${templateId}`);
                    Performance.clearMarks(`createAndBind:${templateId}`);
                    Performance.clearMeasures();
                }
            }
            break;
        case URL_CHANGE:
            Performance.clearMarks();
            Performance.clearMeasures();
            break;
        default:
            break;
    }
};
