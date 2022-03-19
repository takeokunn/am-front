import { BIND_TEMPLATE, CREATE_AND_BIND_TEMPLATE, CREATE_TEMPLATE, enqueueSkyfireMethod, HAS_NOT_SOFT_REFRESHED, HAS_SOFT_REFRESHED, INVALIDATE_TEMPLATE, SOFT_REFRESH_TEMPLATES, unparkSkyfireMethod, URL_CHANGE, } from '../actions';
import { dispatchSkyfireMethods, globals, initSkyfire, rewriteDeeplink } from '../utils';
import { getDeeplink } from '../utils/getDeeplink';
export const SkyfireTemplateMiddleware = (store) => (next) => (action) => {
    var _a, _b, _c, _d, _e;
    switch (action.type) {
        case CREATE_TEMPLATE:
        case CREATE_AND_BIND_TEMPLATE:
            // TODO refactor this
            // eslint-disable-next-line no-param-reassign
            action.payload.template.id = generateTemplateId(action.payload.template);
            if (action.payload.template.templateData) {
                const { coldStart } = store.getState().TemplateStack;
                if (coldStart) {
                    updateTemplateInBrowserHistory(action.payload.template, coldStart);
                }
                else {
                    pushTemplateToBrowserHistory(action.payload.template, coldStart);
                }
            }
            next(action); // Need to let this action go through here so the template is in the stack
            // when the oncreated methods attempt to execute
            if (action.type === CREATE_TEMPLATE && action.payload.template.onCreated) {
                queueMethods(store.dispatch, action.payload.template.onCreated, action.payload.template.id);
            }
            if (action.type === CREATE_AND_BIND_TEMPLATE && action.payload.template.onBound) {
                queueMethods(store.dispatch, action.payload.template.onBound, action.payload.template.id);
            }
            break;
        case BIND_TEMPLATE: {
            const templateStackState = store.getState().TemplateStack;
            if (!((_b = (_a = templateStackState === null || templateStackState === void 0 ? void 0 : templateStackState.currentTemplate) === null || _a === void 0 ? void 0 : _a.templateData) === null || _b === void 0 ? void 0 : _b.deeplink) &&
                !((_e = (_d = (_c = templateStackState === null || templateStackState === void 0 ? void 0 : templateStackState.currentTemplate) === null || _c === void 0 ? void 0 : _c.innerTemplate) === null || _d === void 0 ? void 0 : _d.templateData) === null || _e === void 0 ? void 0 : _e.deeplink) &&
                !templateStackState.coldStart) {
                pushTemplateToBrowserHistory(action.payload.template, templateStackState.coldStart);
            }
            else {
                updateTemplateInBrowserHistory(action.payload.template, templateStackState.coldStart);
            }
            // TODO refactor this
            // eslint-disable-next-line no-param-reassign
            action.payload.template.id = action.payload.owner;
            store.dispatch({ type: HAS_NOT_SOFT_REFRESHED });
            next(action);
            if (action.payload.template.onBound) {
                queueMethods(store.dispatch, action.payload.template.onBound, action.payload.template.id);
            }
            break;
        }
        case URL_CHANGE: {
            const newTemplate = store.getState().TemplateStack.urlMap[action.payload.newUrl];
            if (!newTemplate) {
                globals.location.reload();
                return;
            }
            if (newTemplate.id) {
                const parkedMethods = store.getState().SkyfireMethodQueue.parkedMethods[newTemplate.id];
                next(action);
                if (parkedMethods) {
                    store.dispatch(unparkSkyfireMethod(newTemplate.id));
                    parkedMethods.forEach((method) => store.dispatch(enqueueSkyfireMethod({ queue: method.queue, method })));
                }
                if (newTemplate.invalidatedAt) {
                    dispatchSkyfireMethods(store.dispatch, newTemplate, newTemplate.onCreated);
                }
            }
            break;
        }
        case INVALIDATE_TEMPLATE: {
            next(action);
            const templateStack = store.getState().TemplateStack;
            const { currentTemplate } = templateStack;
            if (currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate.innerTemplate) {
                initSkyfire(store, currentTemplate.innerTemplate.id, true);
            }
            break;
        }
        case SOFT_REFRESH_TEMPLATES: {
            next(action);
            const templateStackRefresh = store.getState().TemplateStack;
            const currentTemplateRefresh = templateStackRefresh.currentTemplate;
            if (currentTemplateRefresh === null || currentTemplateRefresh === void 0 ? void 0 : currentTemplateRefresh.innerTemplate) {
                store.dispatch({ type: HAS_SOFT_REFRESHED });
                initSkyfire(store, currentTemplateRefresh.innerTemplate.id, true);
            }
            break;
        }
        default:
            next(action);
    }
};
function queueMethods(dispatch, methods, owner) {
    methods.forEach((method) => {
        dispatch(enqueueSkyfireMethod({ queue: method.queue, method: Object.assign(Object.assign({}, method), { owner }) }));
    });
}
const idCounter = {};
// https://github.com/lodash/lodash/blob/master/uniqueId.js
function generateTemplateId(template) {
    const prefix = `${template.interface}_`;
    if (!idCounter[prefix]) {
        idCounter[prefix] = 0;
    }
    const id = ++idCounter[prefix];
    return `${prefix}${id}`;
}
function pushTemplateToBrowserHistory(template, coldStart = false) {
    var _a;
    if ((_a = template.templateData) === null || _a === void 0 ? void 0 : _a.deeplink) {
        const { location } = globals;
        if (getDeeplink(template.templateData.deeplink) === location.pathname) {
            return;
        }
        globals.history.pushState({}, '', rewriteDeeplink(template.templateData.deeplink, coldStart));
    }
}
function updateTemplateInBrowserHistory(template, coldStart = false) {
    var _a;
    if ((_a = template.templateData) === null || _a === void 0 ? void 0 : _a.deeplink) {
        const { location } = globals;
        if (getDeeplink(template.templateData.deeplink) === location.pathname) {
            return;
        }
        globals.history.replaceState({}, '', rewriteDeeplink(template.templateData.deeplink, coldStart));
    }
}
