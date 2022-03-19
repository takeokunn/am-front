import useStyles from 'isomorphic-style-loader/useStyles';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { executeMethods, UPDATE_SEARCH_TERM } from '../actions';
import * as Styles from './SearchSuggestions.scss';
export default function SearchSuggestions(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { items, keyword, title, noSuggestionsString } = props.template;
    return (React.createElement("div", { id: "searchSuggestions", className: Styles.searchSuggestionList }, renderSuggestionsContent()));
    function handleSelected(onItemSelected, suggestedSearchTerm) {
        dispatch({
            type: UPDATE_SEARCH_TERM,
            payload: { searchTerm: { text: suggestedSearchTerm, forceUpdateTime: Date.now() } },
        });
        dispatch(executeMethods(onItemSelected.map((method) => (Object.assign({}, method)))));
    }
    function renderSuggestionsContent() {
        return (React.createElement(Fragment, null,
            React.createElement("h1", { className: Styles.searchSuggestionTitle }, title),
            items.map((item, index) => (React.createElement("div", { id: `searchSuggestion${index + 1}`, tabIndex: 0, "aria-label": item.text, className: Styles.searchSuggestionItem, onClick: handleSelected.bind(this, item.onItemSelected, item.text) }, decorateMatchedAndCompleted(item.text))))));
    }
    function renderNoSuggestions() {
        return React.createElement("p", { className: Styles.noSuggestionsText }, noSuggestionsString);
    }
    function decorateMatchedAndCompleted(searchSuggestion) {
        try {
            const decoratedSuggestions = searchSuggestion
                .split(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) // replace characters that cause invalid regular expression
                .map((autoCompletedTerm) => autoCompletedTerm
                ? [React.createElement("span", null, autoCompletedTerm), React.createElement("span", null, keyword.toLowerCase())]
                : [React.createElement("span", { className: Styles.matched }, keyword.toLowerCase())])
                .reduce((curElement, newElement) => [...curElement, ...newElement], []);
            return decoratedSuggestions.slice(0, -1);
        }
        catch (error) {
            return [React.createElement("span", null, searchSuggestion)];
        }
    }
}
