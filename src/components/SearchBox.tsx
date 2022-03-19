import debounce from 'debounce';
import withStyles from 'isomorphic-style-loader/withStyles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UAParser } from 'ua-parser-js';
import { CREATE_TEMPLATE, enqueueSkyfireMethod, REMOVE_SEARCH_SUGGESTIONS, UPDATE_SEARCH_BOX, UPDATE_SEARCH_TERM, } from '../actions';
import { GALLERY_TEMPLATE } from '../types/templates/gallery';
import { globals } from '../utils';
import * as Styles from './SearchBox.scss';
const ua = new UAParser(navigator.userAgent);
const browser = ua.getBrowser();
class SearchBox extends Component {
    constructor(props) {
        var _a;
        super(props);
        // This regexp should cover both find and search cases
        this.isFindOrSearchPage = () => this.props.deeplink.match(/\/search\/?/);
        this.isFindPage = () => this.props.deeplink.match(/\/search$/);
        // This regexp should cover both find, search cases and child pages
        // (stations, playlists, new releases, charts and sports)
        this.isFindOrSearchOrChildPage = () => this.props.deeplink.match(/(\/search\/?|\/popular\/?$|\/new\/?$|\/stations\/?$|\/playlists\/?$|\/sports\/?$)/);
        this.dispatchEnqueueSkyfireMethod = (method) => {
            this.props.dispatch(enqueueSkyfireMethod({
                queue: method.queue,
                method: Object.assign(Object.assign({}, method), { owner: this.props.templateId }),
            }));
        };
        this.searchHandler = (onQueryEntered) => {
            // Cancel the debounce
            this.updateGlobalOnQueryChangeDebounced.clear();
            const { value } = this.input;
            if (value.trim()) {
                this.props.dispatch({
                    type: UPDATE_SEARCH_TERM,
                    payload: { searchTerm: { text: value, forceUpdateTime: Date.now() } },
                });
                onQueryEntered.forEach(this.dispatchEnqueueSkyfireMethod);
                // Forcing re-render in collapsed state instead of .blur()
                this.props.dispatch({
                    type: UPDATE_SEARCH_BOX,
                    payload: { isSearchBoxFocused: false },
                });
            }
        };
        this.handleSearchElementsOnBlur = (event) => {
            var _a;
            if (!((_a = this.container) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
                setTimeout(() => {
                    this.props.dispatch({
                        type: UPDATE_SEARCH_BOX,
                        payload: { isSearchBoxFocused: false },
                    });
                }, 250);
                if (event.relatedTarget && event.relatedTarget !== this.input) {
                    this.fixInputBlur();
                }
            }
        };
        this.handleSearchElementsOnFocus = (event) => {
            var _a;
            if (!((_a = this.container) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
                this.props.dispatch({
                    type: UPDATE_SEARCH_BOX,
                    payload: { isSearchBoxFocused: true },
                });
            }
        };
        this.handleCancelButtonClick = () => {
            this.props.dispatch({
                type: UPDATE_SEARCH_BOX,
                payload: { isSearchBoxFocused: false },
            });
            this.props.dispatch({
                type: REMOVE_SEARCH_SUGGESTIONS,
                payload: {},
            });
        };
        // TODO: this should init with the searched keyword, if customer lands on search page
        this.state = {
            inputValue: this.props.searchSuggestionsData
                ? this.props.searchSuggestionsData.keyword
                : this.props.searchTerm.text || '',
        };
        this.updateGlobalOnQueryChangeDebounced = debounce(this.updateGlobalOnQueryChange.bind(this), globals.amznMusic.ssr ? 200 : ((_a = this.props.searchItem) === null || _a === void 0 ? void 0 : _a.debounceMilliSeconds) || 200);
    }
    calculateClassName(hasInput, isSearchBoxFocused) {
        const classNames = [Styles.searchBoxContainer];
        if (hasInput) {
            classNames.push(Styles.hasInput);
        }
        if (isSearchBoxFocused) {
            classNames.push(Styles.isFocused);
        }
        return classNames.join(' ');
    }
    handleSearchButtonClick(onQueryEntered) {
        if (this.input.value) {
            this.searchHandler(onQueryEntered);
            this.fixInputBlur();
        }
    }
    handleInputClick(onInputSelected, onEmptyInputSelected, event) {
        event.preventDefault();
        // invoke onInputSelected (send metrics)
        onInputSelected.forEach(this.dispatchEnqueueSkyfireMethod);
        this.props.dispatch({
            type: UPDATE_SEARCH_BOX,
            payload: { isSearchBoxFocused: true },
        });
        const value = this.state.inputValue.trim();
        // if search box is clear, invoke onEmptyInputSelected
        // (display find landing page & search history)
        if (this.isFindPage()) {
            // if it's the find page
            if (!value) {
                onEmptyInputSelected.forEach(this.dispatchEnqueueSkyfireMethod);
            }
        }
        else {
            // if it's outside the find page,
            // we need to complete this call in order to get to /search
            onEmptyInputSelected.forEach(this.dispatchEnqueueSkyfireMethod);
        }
    }
    handleInputChange(onQueryChanged, onQueryCleared, event) {
        this.updateLocalOnQueryChange(event);
        this.updateGlobalOnQueryChangeDebounced(onQueryChanged, onQueryCleared, event);
    }
    updateLocalOnQueryChange(event) {
        this.props.dispatch({
            type: UPDATE_SEARCH_BOX,
            payload: { isSearchBoxFocused: true, searchBoxInput: event.target.value },
        });
        this.setState({ inputValue: event.target.value });
    }
    updateGlobalOnQueryChange(onQueryChanged, onQueryCleared, event) {
        const { value } = event.target;
        if (!value.trim()) {
            // this handles the case when typing only space in search bar
            // we show find page if deeplink url is not find page yet
            // we should always remove search suggestions
            this.props.dispatch({ type: REMOVE_SEARCH_SUGGESTIONS });
            if (!this.isFindOrSearchPage()) {
                this.props.dispatch({
                    type: UPDATE_SEARCH_TERM,
                    payload: { searchTerm: { text: '', forceUpdateTime: Date.now() } },
                });
                onQueryCleared
                    .map((method) => (Object.assign(Object.assign({}, method), { keyword: value })))
                    .forEach(this.dispatchEnqueueSkyfireMethod);
            }
        }
        else {
            onQueryChanged
                .map((method) => (Object.assign(Object.assign({}, method), { keyword: value })))
                .forEach(this.dispatchEnqueueSkyfireMethod);
        }
    }
    handleKeyUp(onQueryEntered, event) {
        event.preventDefault();
        if (event.key === 'Enter') {
            this.searchHandler(onQueryEntered);
            this.fixInputBlur();
        }
    }
    handleClearButtonClick(onQueryCleared, event) {
        event.preventDefault();
        onQueryCleared.forEach(this.dispatchEnqueueSkyfireMethod);
        this.props.dispatch({
            type: UPDATE_SEARCH_TERM,
            payload: { searchTerm: { text: '', forceUpdateTime: Date.now() } },
        });
        this.props.dispatch({
            type: UPDATE_SEARCH_BOX,
            payload: { isSearchBoxFocused: true },
        });
    }
    handleSearchBoxButtonClick(onEmptyInputSelected, event) {
        event.preventDefault();
        // if search box is empty, display suggestions
        if (!this.state.inputValue.trim()) {
            onEmptyInputSelected.forEach(this.dispatchEnqueueSkyfireMethod);
        }
        this.props.dispatch({
            type: UPDATE_SEARCH_BOX,
            payload: { isSearchBoxFocused: true },
        });
    }
    preventDefaultOnSubmit(event) {
        event.preventDefault();
    }
    componentDidMount() {
        if (this.props.isSearchBoxFocused) {
            this.input.focus();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.searchTerm !== prevProps.searchTerm &&
            this.props.searchTerm.text !== this.state.inputValue.trim()) {
            this.setState({ inputValue: this.props.searchTerm.text });
        }
    }
    fixInputBlur() {
        // Fix issue with keypress in IE11, Edge. Set focus to inputShadow control,
        // removing input cursor from search box
        if (browser.name === 'IE' || browser.name === 'Edge') {
            this.inputShadow.focus();
        }
        else {
            this.input.blur();
        }
    }
    render() {
        var _a;
        const { onQueryCleared, onInputSelected, onEmptyInputSelected, onQueryChanged, onQueryEntered, placeholder, cancelButtonText, } = this.props.searchItem;
        const { isSearchBoxFocused } = this.props;
        const hasInput = Boolean(this.state.inputValue);
        let clearIcon;
        if (isSearchBoxFocused && hasInput) {
            clearIcon = (React.createElement("music-button", { "icon-name": "cancelInline", "icon-only": true, size: "medium", variant: "primary", onMouseDown: this.handleClearButtonClick.bind(this, onQueryCleared), ariaLabelText: "Clear Text" }));
        }
        const hasGalleryTemplate = onEmptyInputSelected.length &&
            onEmptyInputSelected[0].interface === CREATE_TEMPLATE &&
            ((_a = onEmptyInputSelected[0].template) === null || _a === void 0 ? void 0 : _a.interface) === GALLERY_TEMPLATE;
        const galleryTemplate = hasGalleryTemplate
            ? onEmptyInputSelected[0].template
            : undefined;
        return (React.createElement("div", { className: this.calculateClassName(hasInput, isSearchBoxFocused), ref: (node) => {
                this.container = node;
            } },
            React.createElement("div", null,
                React.createElement("form", { action: "#", autoComplete: "off", onSubmit: this.preventDefaultOnSubmit },
                    React.createElement("input", { id: "navbarSearchInput", className: Styles.searchInput, placeholder: placeholder, onChange: this.handleInputChange.bind(this, onQueryChanged, onQueryCleared), onClick: this.handleInputClick.bind(this, onInputSelected, onEmptyInputSelected), onBlur: this.handleSearchElementsOnBlur, onKeyUp: this.handleKeyUp.bind(this, onQueryEntered), onFocus: this.handleSearchElementsOnFocus, ref: (node) => {
                            this.input = node;
                        }, value: this.state.inputValue, type: "search", role: "searchbox" }),
                    React.createElement("input", { id: "navbarSearchInputShadow", className: Styles.searchInputShadow, ref: (node) => {
                            this.inputShadow = node;
                        }, type: "search" })),
                React.createElement("div", { className: Styles.iconGroup },
                    clearIcon,
                    React.createElement("music-button", { id: "navbarSearchInputButton", className: Styles.searchIcon, "icon-name": "search", "icon-only": true, variant: isSearchBoxFocused ? (hasInput ? 'solid' : 'glass') : 'secondary', size: "small", disabled: !hasInput, onFocus: this.handleSearchElementsOnFocus, onClick: this.handleSearchButtonClick.bind(this, onQueryEntered), ariaLabelText: "Start Search" }))),
            React.createElement("music-button", { id: "navbarSearchCancelButton", className: Styles.cancelButton, variant: "primary", size: "small", "icon-only": true, onClick: this.handleCancelButtonClick, onFocus: this.handleSearchElementsOnFocus, ariaLabelText: cancelButtonText }, cancelButtonText),
            React.createElement("music-button", { id: "navbarMenuItemSearch", href: galleryTemplate === null || galleryTemplate === void 0 ? void 0 : galleryTemplate.templateData.deeplink, className: Styles.searchButton, "icon-name": "search", variant: this.isFindOrSearchOrChildPage() ? 'accent' : 'primary', "icon-only": true, size: "medium", onClick: this.handleSearchBoxButtonClick.bind(this, onEmptyInputSelected), ariaLabelText: "Start Search" })));
    }
}
function mapStateToProps(state) {
    var _a, _b, _c, _d, _e;
    return {
        isSearchBoxFocused: state.SearchSuggestions.isSearchBoxFocused,
        deeplink: (_e = (_d = (_c = (_b = (_a = state === null || state === void 0 ? void 0 : state.TemplateStack) === null || _a === void 0 ? void 0 : _a.currentTemplate) === null || _b === void 0 ? void 0 : _b.innerTemplate) === null || _c === void 0 ? void 0 : _c.templateData) === null || _d === void 0 ? void 0 : _d.deeplink) !== null && _e !== void 0 ? _e : '',
        searchTerm: state.SearchSuggestions.searchTerm,
        searchSuggestionsData: state.SearchSuggestions.searchSuggestionsData,
        windowWidth: state.BrowserState.windowWidth,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}
export default withStyles(Styles)(connect(mapStateToProps, mapDispatchToProps)(SearchBox));
