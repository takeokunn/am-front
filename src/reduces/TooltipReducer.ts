import { CLOSE_NOTIFICATION, getTimeoutMilliseconds, SHOW_NOTIFICATION, } from '../actions/Notification';
import { NOTIFICATION_TOOLTIP_TEMPLATE, } from '../types/templates/notification';
export function TooltipReducer(state = { tooltip: null }, action) {
    var _a;
    switch (action.type) {
        case SHOW_NOTIFICATION:
            if (action.payload.notification.interface === NOTIFICATION_TOOLTIP_TEMPLATE) {
                const tooltip = action.payload.notification;
                tooltip.timeoutMilliseconds = getTimeoutMilliseconds(tooltip.timeoutSeconds);
                return { tooltip };
            }
            return state;
        case CLOSE_NOTIFICATION:
            // @ts-ignore
            if (((_a = state.tooltip) === null || _a === void 0 ? void 0 : _a.id) === action.payload.id) {
                return { tooltip: null };
            }
            return state;
        default:
            return state;
    }
}
