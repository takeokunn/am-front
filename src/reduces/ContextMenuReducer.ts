import { CLOSE_CONTEXT_MENU, OPEN_CONTEXT_MENU, ADD_ITEMS_TO_CONTEXT_MENU_WIDGET, } from '../actions/ContextMenu';
const initialState = {
    buttonId: '',
    openedWithKeyboard: false,
    open: false,
    options: [],
    xOffset: 0,
    yOffset: 0,
    refinement: false,
    header: '',
    label: '',
    showSignInButton: false,
    hover: false,
};
const reducer = {
    [OPEN_CONTEXT_MENU]: (state, action) => {
        var _a;
        return (Object.assign(Object.assign(Object.assign({}, state), action.payload), { open: true, hover: ((_a = action.payload) === null || _a === void 0 ? void 0 : _a.hover) === true }));
    },
    [CLOSE_CONTEXT_MENU]: (state, action) => (Object.assign(Object.assign({}, state), { open: false })),
    [ADD_ITEMS_TO_CONTEXT_MENU_WIDGET]: (state, action) => {
        const { widget } = state;
        if (!widget)
            return state;
        const newWidget = Object.assign(Object.assign({}, widget), { items: [...widget.items, ...action.payload.items], onEndOfWidget: action.payload.onEndOfWidget });
        return Object.assign(Object.assign({}, state), { widget: newWidget });
    },
};
export function ContextMenuReducer(state = initialState, action) {
    if (reducer[action.type]) {
        return reducer[action.type](state, action);
    }
    return state;
}
