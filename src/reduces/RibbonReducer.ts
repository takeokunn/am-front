import { CLOSE_NOTIFICATION, getTimeoutMilliseconds, SHOW_NOTIFICATION, } from '../actions/Notification';
import { NOTIFICATION_RIBBON_TEMPLATE } from '../types/templates/notification';
export function RibbonReducer(state = { ribbon: null }, action) {
    var _a;
    switch (action.type) {
        case SHOW_NOTIFICATION:
            if (action.payload.notification.interface === NOTIFICATION_RIBBON_TEMPLATE) {
                const ribbon = action.payload.notification;
                ribbon.timeoutMilliseconds = getTimeoutMilliseconds(ribbon.timeoutSeconds);
                return { ribbon };
            }
            return state;
        case CLOSE_NOTIFICATION:
            // @ts-ignore
            if (((_a = state.ribbon) === null || _a === void 0 ? void 0 : _a.id) === action.payload.id) {
                return { ribbon: null };
            }
            return state;
        default:
            return state;
    }
}
