import { ADD_ITEMS_TO_WIDGET_BY_ID, ADD_DESCRIPTIVE_ROW_ITEMS_TO_WIDGET, ADD_HORIZONTAL_ITEMS_TO_WIDGET, ADD_VERTICAL_ITEMS_TO_WIDGET, ADD_VISUAL_ROW_ITEMS_TO_WIDGET, ADD_WIDGETS_TO_TEMPLATE, BIND_TEMPLATE, CREATE_AND_BIND_TEMPLATE, CREATE_TEMPLATE, INVALIDATE_TEMPLATE, REMOVE_ROW_ITEM_FROM_WIDGET, REMOVE_TEMPLATE, REORDER_TRACK, TEMPLATE_RENDERED, URL_CHANGE, REPLACE_ROW_ITEM_FROM_LAST_WIDGET, CLEAR_OVERLAY_TEMPLATES, ADD_VISUAL_ROW_ITEMS_TO_WIDGET_START, } from '../actions';
import { CLEAR, CLEAR_VIDEO, PLAYBACK_NOT_SUPPORTED } from '../actions/Playback';
import { DIALOG_TEMPLATE } from '../types/templates/dialog';
import { FEEDBACK_DIALOG_TEMPLATE } from '../types/templates/feedbackDialog';
import { NOW_PLAYING_TEMPLATE } from '../types/templates/nowPlaying';
import { VIDEO_NOW_PLAYING_TEMPLATE } from '../types/templates/videoNowPlaying';
import { TABS_ITEMS_GROUP_WIDGET } from '../types/templates/widgets/ISkyfireTabsItemsGroupWidgetElement';
import { getDeeplink } from '../utils/getDeeplink';
function array_move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}
const initialState = {
    currentTemplate: undefined,
    urlMap: {},
    overlayTemplates: [],
    coldStart: true,
    activeTabIndex: 0,
};
export function TemplateStackReducer(state = initialState, action) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
    switch (action.type) {
        case TEMPLATE_RENDERED:
            if (!((_a = action.payload.template.id) === null || _a === void 0 ? void 0 : _a.includes('ChromeTemplate')) && state.coldStart) {
                return Object.assign(Object.assign({}, state), { coldStart: false });
            }
            return state;
        case CREATE_TEMPLATE:
        case CREATE_AND_BIND_TEMPLATE:
            if (isOverlayTemplate(action.payload.template)) {
                return createOverlayTemplate(state, action.payload.template);
            }
            if (action.payload.screenMode === 'templateShard') {
                return replaceInnerTemplate(state, action.payload.template);
            }
            return updateCurrentTemplate(state, action.payload.template);
        case BIND_TEMPLATE:
            if (isOverlayTemplate(action.payload.template)) {
                return updateOverlayTemplate(state, action.payload.template, action.payload.owner);
            }
            if (((_b = state.currentTemplate) === null || _b === void 0 ? void 0 : _b.id) === action.payload.owner) {
                return updateCurrentTemplate(state, action.payload.template);
            }
            if (action.payload.owner === ((_d = (_c = state.currentTemplate) === null || _c === void 0 ? void 0 : _c.innerTemplate) === null || _d === void 0 ? void 0 : _d.id)) {
                return updateInnerTemplate(state, action.payload.template);
            }
            // update unrendered template
            return Object.assign(Object.assign({}, state), { urlMap: updateUrlMap(state.urlMap, action.payload.template) });
        case REMOVE_TEMPLATE:
            if (state.overlayTemplates.length) {
                return Object.assign(Object.assign({}, state), { overlayTemplates: state.overlayTemplates.filter((template) => template.id !== action.payload.owner) });
            }
            return state;
        case URL_CHANGE: {
            // Prevent store from pushing same template twice in case we get a URL_CHANGE
            // incorrectly for the same URL that we are currently on.
            // Please see https://sim.amazon.com/issues/DMWebPlayer-19205 for details
            const currentDeeplink = ((_g = (_f = (_e = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _e === void 0 ? void 0 : _e.innerTemplate) === null || _f === void 0 ? void 0 : _f.templateData) === null || _g === void 0 ? void 0 : _g.deeplink) ||
                ((_j = (_h = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _h === void 0 ? void 0 : _h.templateData) === null || _j === void 0 ? void 0 : _j.deeplink);
            if (action.payload.newUrl === getDeeplink(currentDeeplink)) {
                return state;
            }
            const newTemplate = state.urlMap[action.payload.newUrl];
            return replaceInnerTemplate(state, newTemplate);
        }
        case INVALIDATE_TEMPLATE: {
            const invalidatedAt = Date.now();
            const urls = {};
            for (const key in state.urlMap) {
                if (state.urlMap.hasOwnProperty(key)) {
                    const template = state.urlMap[key];
                    urls[key] = Object.assign(Object.assign({}, template), { invalidatedAt });
                }
            }
            return Object.assign(Object.assign(Object.assign({}, state), { overlayTemplates: [] }), { urlMap: urls });
        }
        case PLAYBACK_NOT_SUPPORTED:
        case CLEAR:
            return Object.assign(Object.assign({}, state), { overlayTemplates: state.overlayTemplates.filter((template) => template.interface !== NOW_PLAYING_TEMPLATE) });
        case CLEAR_VIDEO:
            return Object.assign(Object.assign({}, state), { overlayTemplates: state.overlayTemplates.filter((template) => template.interface !== VIDEO_NOW_PLAYING_TEMPLATE) });
        case CLEAR_OVERLAY_TEMPLATES:
            return Object.assign(Object.assign({}, state), { overlayTemplates: [] });
        case ADD_WIDGETS_TO_TEMPLATE:
            if ((_k = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _k === void 0 ? void 0 : _k.innerTemplate) {
                const templateWidgets = [
                    ...(((_m = (_l = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _l === void 0 ? void 0 : _l.innerTemplate) === null || _m === void 0 ? void 0 : _m.widgets) || []),
                    ...action.payload.items,
                ];
                const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
                    innerTemplate: Object.assign(Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), { widgets: templateWidgets }), { onEndOfWidgetsReached: action.payload.onEndOfWidget }),
                });
                return Object.assign(Object.assign({}, state), { currentTemplate });
            }
            return state;
        case ADD_VISUAL_ROW_ITEMS_TO_WIDGET_START:
            if ((_p = (_o = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _o === void 0 ? void 0 : _o.innerTemplate) === null || _p === void 0 ? void 0 : _p.widgets) {
                const templateWidgets = (_r = (_q = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _q === void 0 ? void 0 : _q.innerTemplate) === null || _r === void 0 ? void 0 : _r.widgets;
                const widgetToUpdate = Object.assign({}, templateWidgets[0]);
                widgetToUpdate.items = [].concat(action.payload.items, widgetToUpdate.items);
                widgetToUpdate.onViewed = action.payload.onViewed;
                const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
                    innerTemplate: Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), {
                        widgets: [widgetToUpdate, ...templateWidgets.slice(1)],
                    }),
                });
                return Object.assign(Object.assign({}, state), { currentTemplate });
            }
            return state;
        case ADD_VISUAL_ROW_ITEMS_TO_WIDGET:
        case ADD_DESCRIPTIVE_ROW_ITEMS_TO_WIDGET:
        case ADD_VERTICAL_ITEMS_TO_WIDGET:
        case ADD_HORIZONTAL_ITEMS_TO_WIDGET:
            if ((_t = (_s = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _s === void 0 ? void 0 : _s.innerTemplate) === null || _t === void 0 ? void 0 : _t.widgets) {
                const templateWidgets = (_v = (_u = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _u === void 0 ? void 0 : _u.innerTemplate) === null || _v === void 0 ? void 0 : _v.widgets;
                const widgetToUpdate = Object.assign({}, templateWidgets[0]);
                widgetToUpdate.items = widgetToUpdate.items.concat(action.payload.items);
                if ('onEndOfWidget' in widgetToUpdate) {
                    widgetToUpdate.onEndOfWidget = action.payload.onEndOfWidget;
                }
                widgetToUpdate.onViewed = action.payload.onViewed;
                const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
                    innerTemplate: Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), {
                        widgets: [widgetToUpdate, ...templateWidgets.slice(1)],
                    }),
                });
                return Object.assign(Object.assign({}, state), { currentTemplate });
            }
            return state;
        case ADD_ITEMS_TO_WIDGET_BY_ID:
            if ((_x = (_w = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _w === void 0 ? void 0 : _w.innerTemplate) === null || _x === void 0 ? void 0 : _x.widgets) {
                const templateWidgets = (_z = (_y = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _y === void 0 ? void 0 : _y.innerTemplate) === null || _z === void 0 ? void 0 : _z.widgets;
                const widgetToUpdateIndex = templateWidgets.findIndex((widget) => widget.uuid === action.payload.widgetId);
                if (widgetToUpdateIndex < 0) {
                    return state;
                }
                const widgetToUpdate = templateWidgets[widgetToUpdateIndex];
                widgetToUpdate.items = widgetToUpdate.items.concat(action.payload.items);
                if ('onEndOfWidget' in widgetToUpdate) {
                    widgetToUpdate.onEndOfWidget = action.payload.onEndOfWidget;
                }
                widgetToUpdate.onViewed = action.payload.onViewed;
                const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
                    innerTemplate: Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), {
                        widgets: [
                            ...templateWidgets.slice(0, widgetToUpdateIndex),
                            widgetToUpdate,
                            ...templateWidgets.slice(widgetToUpdateIndex + 1),
                        ],
                    }),
                });
                return Object.assign(Object.assign({}, state), { currentTemplate });
            }
            return state;
        case REORDER_TRACK:
            if (((_1 = (_0 = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _0 === void 0 ? void 0 : _0.innerTemplate) === null || _1 === void 0 ? void 0 : _1.widgets) &&
                !action.payload.isVisualPlayQueue) {
                const templateWidgets = (_3 = (_2 = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _2 === void 0 ? void 0 : _2.innerTemplate) === null || _3 === void 0 ? void 0 : _3.widgets;
                const widgetToUpdate = Object.assign({}, templateWidgets[0]);
                const items = [...widgetToUpdate.items];
                array_move(items, action.payload.trackIndex, action.payload.moveToIndex);
                widgetToUpdate.items = items;
                const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
                    innerTemplate: Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), {
                        widgets: [widgetToUpdate, ...templateWidgets.slice(1)],
                    }),
                });
                return Object.assign(Object.assign({}, state), { currentTemplate });
            }
            return state;
        case REMOVE_ROW_ITEM_FROM_WIDGET:
            if ((_4 = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _4 === void 0 ? void 0 : _4.innerTemplate) {
                // @ts-ignore
                const templateWidgets = (_6 = (_5 = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _5 === void 0 ? void 0 : _5.innerTemplate) === null || _6 === void 0 ? void 0 : _6.widgets;
                const widgetsToUpdate = [];
                for (const key in templateWidgets) {
                    if (templateWidgets.hasOwnProperty(key)) {
                        const templateWidget = templateWidgets[key];
                        const widgetUpdate = Object.assign(Object.assign({}, templateWidget), { items: templateWidget.items.filter((item) => item.id !== action.payload.id) });
                        widgetsToUpdate.push(widgetUpdate);
                    }
                }
                const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
                    innerTemplate: Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), { widgets: widgetsToUpdate }),
                });
                return Object.assign(Object.assign({}, state), { currentTemplate });
            }
            return state;
        case REPLACE_ROW_ITEM_FROM_LAST_WIDGET:
            if ((_8 = (_7 = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _7 === void 0 ? void 0 : _7.innerTemplate) === null || _8 === void 0 ? void 0 : _8.widgets) {
                const templateWidgets = (_10 = (_9 = state === null || state === void 0 ? void 0 : state.currentTemplate) === null || _9 === void 0 ? void 0 : _9.innerTemplate) === null || _10 === void 0 ? void 0 : _10.widgets;
                const widgetToUpdate = Object.assign({}, templateWidgets[templateWidgets.length - 1]);
                if (widgetToUpdate.interface === TABS_ITEMS_GROUP_WIDGET) {
                    for (let i = 0; i < widgetToUpdate.items.length; i++) {
                        const tabDescriptiveShowcaseWidget = widgetToUpdate.items[i];
                        const originalTracks = tabDescriptiveShowcaseWidget.showcase.items;
                        let updatedTracks = originalTracks;
                        // When there are less tracks than maxViewItemCount,
                        // remove all tracks which share the same track ID as payload.
                        if (tabDescriptiveShowcaseWidget.showcase.maxViewItemCount === undefined ||
                            originalTracks.length <=
                                tabDescriptiveShowcaseWidget.showcase.maxViewItemCount) {
                            updatedTracks = originalTracks.filter((track) => action.payload.id !== track.id);
                        }
                        else {
                            // When there are more tracks than maxViewItemCount,
                            // replace all tracks which share the same track ID as payload.
                            // We will use the last available track to replace the target one.
                            // This logic also works when there are duplicate tracks in the list.
                            let targetTrackPointer = 0;
                            let availableTrackPointer = originalTracks.length - 1;
                            while (targetTrackPointer < availableTrackPointer) {
                                if (action.payload.id === originalTracks[targetTrackPointer].id) {
                                    while (targetTrackPointer < availableTrackPointer &&
                                        action.payload.id ===
                                            originalTracks[availableTrackPointer].id) {
                                        availableTrackPointer--;
                                    }
                                    // No need to update when both pointers are at the same slot
                                    if (availableTrackPointer !== targetTrackPointer) {
                                        originalTracks[targetTrackPointer] =
                                            originalTracks[availableTrackPointer];
                                        targetTrackPointer++;
                                        availableTrackPointer--;
                                    }
                                }
                                else {
                                    targetTrackPointer++;
                                }
                            }
                            updatedTracks =
                                action.payload.id === originalTracks[availableTrackPointer].id
                                    ? originalTracks.slice(0, availableTrackPointer)
                                    : originalTracks.slice(0, availableTrackPointer + 1);
                        }
                        tabDescriptiveShowcaseWidget.showcase.items = updatedTracks;
                    }
                }
                const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
                    innerTemplate: Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), {
                        widgets: [
                            ...templateWidgets.slice(0, templateWidgets.length - 1),
                            widgetToUpdate,
                        ],
                    }),
                });
                return Object.assign(Object.assign({}, state), { currentTemplate });
            }
            return state;
        default:
            return state;
    }
}
function updateCurrentTemplate(state, newTemplate) {
    const urlMap = updateUrlMap(state.urlMap, newTemplate);
    return Object.assign(Object.assign(Object.assign({}, state), { urlMap }), {
        currentTemplate: Object.assign(Object.assign({}, newTemplate), { updatedAt: Date.now() }),
    });
}
function updateInnerTemplate(state, newTemplate) {
    if (!state.currentTemplate) {
        return state;
    }
    const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
        innerTemplate: Object.assign(Object.assign(Object.assign({}, state.currentTemplate.innerTemplate), newTemplate), { updatedAt: Date.now() }),
    });
    const urlMap = updateUrlMap(state.urlMap, newTemplate);
    return Object.assign(Object.assign({}, state), { currentTemplate, urlMap });
}
function replaceInnerTemplate(state, newTemplate) {
    if (!state.currentTemplate) {
        return state;
    }
    const previousTemplate = Object.assign({}, state.currentTemplate);
    const currentTemplate = Object.assign(Object.assign({}, state.currentTemplate), {
        innerTemplate: Object.assign(Object.assign({}, newTemplate), { updatedAt: Date.now() }),
    });
    const urlMap = updateUrlMap(state.urlMap, newTemplate);
    return Object.assign(Object.assign({}, state), { currentTemplate, previousTemplate, urlMap });
}
function updateUrlMap(urlMap, template) {
    let newUrlMap = urlMap;
    if (template === null || template === void 0 ? void 0 : template.templateData) {
        newUrlMap = Object.assign(Object.assign({}, newUrlMap), { [getDeeplink(template.templateData.deeplink) || '']: template });
    }
    return newUrlMap;
}
function isOverlayTemplate(template) {
    const overlayTemplates = [
        DIALOG_TEMPLATE,
        NOW_PLAYING_TEMPLATE,
        VIDEO_NOW_PLAYING_TEMPLATE,
        FEEDBACK_DIALOG_TEMPLATE,
    ];
    return overlayTemplates.includes(template.interface);
}
function createOverlayTemplate(state, newTemplate) {
    return Object.assign(Object.assign({}, state), { overlayTemplates: [newTemplate, ...state.overlayTemplates] });
}
function updateOverlayTemplate(state, newTemplate, templateId) {
    return Object.assign(Object.assign({}, state), { overlayTemplates: state.overlayTemplates.map((template) => {
            if (template.id === templateId) {
                return Object.assign(Object.assign({}, newTemplate), { updatedAt: Date.now() });
            }
            return template;
        }) });
}
