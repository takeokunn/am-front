import { __rest } from "tslib";
import { BATCH_REMOVE_BY_VALUE, BATCH_SET, CLEAR_STORAGE, REMOVE_KEY, SET_STORAGE, BATCH_REMOVE_KEY, BATCH_SET_UNIQUE, } from '../actions/Storage';
const initialState = {};
const reducer = {
    [CLEAR_STORAGE]: (state, action) => {
        const { group } = action.payload;
        return Object.assign(Object.assign({}, state), { [group]: {} });
    },
    [SET_STORAGE]: (state, action) => {
        const { group, key, value } = action.payload;
        const newState = Object.assign(Object.assign({}, state), { [group]: Object.assign(Object.assign({}, (state[group] || {})), { [key]: typeof value === 'string' && value.startsWith('{"') ? JSON.parse(value) : value }) });
        if (key !== '_all') {
            delete newState[group]._all;
        }
        return newState;
    },
    [REMOVE_KEY]: (state, action) => {
        const _a = state[action.payload.group], _b = action.payload.key, omit = _a[_b], group = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return Object.assign(Object.assign({}, state), { [action.payload.group]: group });
    },
    [BATCH_REMOVE_BY_VALUE]: (state, action) => {
        const set = new Set(action.payload.values);
        const group = Object.assign({}, state[action.payload.group]);
        for (const key in group) {
            if (set.has(group[key])) {
                delete group[key];
            }
        }
        return Object.assign(Object.assign({}, state), { [action.payload.group]: group });
    },
    [BATCH_REMOVE_KEY]: (state, action) => {
        const set = new Set(action.payload.keys);
        const group = Object.assign({}, state[action.payload.group]);
        for (const key in group) {
            if (set.has(key)) {
                delete group[key];
            }
        }
        return Object.assign(Object.assign({}, state), { [action.payload.group]: group });
    },
    [BATCH_SET]: (state, action) => {
        const { group, keys, values } = action.payload;
        const newState = Object.assign(Object.assign({}, state), { [group]: Object.assign(Object.assign({}, (state[group] || {})), { _all: true }) });
        keys.forEach((k, index) => {
            newState[group][keys[index]] = values[index];
        });
        return newState;
    },
    [BATCH_SET_UNIQUE]: (state, action) => {
        const { uniqueKey, uniqueValue, otherValue } = action.payload;
        const group = Object.assign({}, state[action.payload.group]);
        Object.keys(group).forEach((key) => {
            group[key] = otherValue;
        });
        group[uniqueKey] = uniqueValue;
        return Object.assign(Object.assign({}, state), { [action.payload.group]: group });
    },
};
export function StorageReducer(state = initialState, action) {
    if (reducer[action.type]) {
        return reducer[action.type](state, action);
    }
    return state;
}
