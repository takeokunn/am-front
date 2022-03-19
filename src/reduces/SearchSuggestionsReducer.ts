import { BIND_TEMPLATE, CREATE_AND_BIND_TEMPLATE, CREATE_TEMPLATE, REMOVE_SEARCH_SUGGESTIONS, UPDATE_SEARCH_BOX, UPDATE_SEARCH_SUGGESTIONS, UPDATE_SEARCH_TERM, } from '../actions';
const initialState = {
    isSearchBoxFocused: false,
    isSearchBoxEmpty: true,
    shouldShowSearchSuggestions: false,
    searchSuggestionsData: undefined,
    searchTerm: { text: '', forceUpdateTime: 0 },
    searchBoxInput: '',
};
export function SearchSuggestionsReducer(state = initialState, action) {
    var _a, _b, _c, _d;
    // @ts-ignore
    const currentDeeplink = ((_c = (_b = (_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.template) === null || _b === void 0 ? void 0 : _b.templateData) === null || _c === void 0 ? void 0 : _c.deeplink) || '';
    const findUrlRegex = /\/search\/?$/;
    const searchUrlRegex = /\/search\/([^;\/?:@=&]+)/;
    switch (action.type) {
        case CREATE_TEMPLATE:
        case CREATE_AND_BIND_TEMPLATE:
            return Object.assign(Object.assign({}, state), { isSearchBoxEmpty: true, shouldShowSearchSuggestions: false });
        case BIND_TEMPLATE:
            if (!currentDeeplink.match(searchUrlRegex)) {
                return Object.assign(Object.assign({}, state), { searchTerm: { text: '', forceUpdateTime: Date.now() } });
            }
            return state;
        case UPDATE_SEARCH_SUGGESTIONS: {
            const newState = Object.assign(Object.assign({}, state), { isSearchBoxEmpty: false, shouldShowSearchSuggestions: true });
            if (((_d = action.payload.items) === null || _d === void 0 ? void 0 : _d.length) !== 0) {
                newState.searchSuggestionsData = {
                    title: action.payload.title,
                    items: action.payload.items,
                    keyword: action.payload.keyword,
                    noSuggestionsString: action.payload.noSuggestionsString,
                };
            }
            return newState;
        }
        case REMOVE_SEARCH_SUGGESTIONS:
            return Object.assign(Object.assign({}, state), { isSearchBoxEmpty: true, shouldShowSearchSuggestions: false, searchSuggestionsData: undefined });
        case UPDATE_SEARCH_BOX:
            return Object.assign(Object.assign({}, state), action.payload);
        case UPDATE_SEARCH_TERM:
            return Object.assign(Object.assign({}, state), action.payload);
        default:
            return state;
    }
}
