import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import SubNavbar from '../components/SubNavbar';
import { SplashScreen } from '../components/SplashScreen';
import { dispatchSkyfireMethods } from '../utils';
import * as chromeStyles from './Chrome.scss';
import SearchSuggestions from './SearchSuggestions';
import View from './View';
export default function Chrome(props) {
    useStyles(chromeStyles);
    const dispatch = useDispatch();
    const { searchBoxInput, searchSuggestionsData, shouldShowSearchSuggestions } = useSelector((state) => state.SearchSuggestions);
    const { innerTemplate, searchBox } = props.template;
    const { timestamp } = useSelector((state) => state.InteractionState);
    const { hasSoftRefreshed } = useSelector((state) => state.SoftRefresh, shallowEqual);
    useEffect(() => {
        dispatchSkyfireMethods(dispatch, props.template, props.template.onInteraction);
    }, [timestamp]);
    // Add scroll to the window once we've loaded the splash screen
    // so scrollbars don't appear on top of splash
    useEffect(() => {
        const rootElement = document.documentElement;
        rootElement.style['overflow-y'] = (innerTemplate === null || innerTemplate === void 0 ? void 0 : innerTemplate.interface) ? 'scroll' : 'auto';
    }, [innerTemplate]);
    return (React.createElement("div", { className: chromeStyles.container }, (innerTemplate === null || innerTemplate === void 0 ? void 0 : innerTemplate.interface) ? (React.createElement("div", { className: chromeStyles.innerTemplate },
        React.createElement(Navbar, { template: props.template, searchBox: searchBox }),
        React.createElement(SubNavbar, { template: props.template }),
        getView())) : hasSoftRefreshed ? (React.createElement(LoadingSpinner, null)) : (React.createElement(SplashScreen, null))));
    function getView() {
        if (shouldShowSearchSuggestions && searchSuggestionsData && Boolean(searchBoxInput)) {
            return React.createElement(SearchSuggestions, { template: searchSuggestionsData });
        }
        return React.createElement(View, { template: innerTemplate });
    }
}
