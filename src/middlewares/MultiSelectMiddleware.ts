import { SHIFT_CLICK } from '../actions';
import { dispatchSkyfireMethods } from '../utils';
let previousSelectedIndex = 0;
export const MultiSelectMiddleware = (store) => (next) => async (action) => {
    var _a;
    if (action.type === SHIFT_CLICK) {
        const { template, index } = action.payload;
        if (action.payload.shiftKeyPressed) {
            const { MULTISELECT } = store.getState().Storage;
            if (MULTISELECT && Object.keys(MULTISELECT).length > 0) {
                // @ts-ignore
                const widget = (_a = template === null || template === void 0 ? void 0 : template.innerTemplate) === null || _a === void 0 ? void 0 : _a.widgets[0];
                const items = (widget === null || widget === void 0 ? void 0 : widget.items) || [];
                // Check if the selected index is already selected
                if (MULTISELECT[items[index].onCheckboxSelected.storageKey]) {
                    // We now need to unselect all rows not between
                    // the currentIndex and the previouslySelectedIndex
                    const set = new Set();
                    for (let i = Math.min(index, previousSelectedIndex); i <= Math.max(index, previousSelectedIndex); i++) {
                        const item = items[i];
                        if (MULTISELECT[item.onCheckboxSelected.storageKey] &&
                            item.onCheckboxSelected) {
                            set.add(item.onCheckboxSelected.storageKey);
                        }
                    }
                    items.forEach((item) => {
                        if (!set.has(item.onCheckboxSelected.storageKey)) {
                            dispatchSkyfireMethods(store.dispatch, template, item.onCheckboxSelected.states[MULTISELECT[item.onCheckboxSelected.storageKey]]);
                        }
                    });
                }
                else {
                    // Select all items between the currentIndex and the previouslySelectedIndex
                    for (let i = Math.min(index, previousSelectedIndex); i <= Math.max(index, previousSelectedIndex); i++) {
                        const item = items[i];
                        if (!MULTISELECT[item.onCheckboxSelected.storageKey] &&
                            item.onCheckboxSelected) {
                            dispatchSkyfireMethods(store.dispatch, template, item.onCheckboxSelected.defaultValue);
                        }
                    }
                }
            }
        }
        else {
            dispatchSkyfireMethods(store.dispatch, template, action.payload.methods);
        }
        previousSelectedIndex = index;
    }
    next(action);
};
