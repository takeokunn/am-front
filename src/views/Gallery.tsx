import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import BackgroundImage from '../components/BackgroundImage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RefinementHeader from '../components/RefinementHeader';
import SearchHeader from '../components/SearchHeader';
import WidgetList from '../components/widgets/WidgetList';
import { dispatchSkyfireMethods, dispatchTemplateRendered } from '../utils';
import * as Styles from './View.scss';
export default function Gallery(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { widgets, header, id, searchHeader, refinementHeader, updatedAt, onEndOfWidgetsReached, isEnumerated, image, } = props.template;
    const key = [id, updatedAt].join('-');
    useEffect(() => { var _a; return (_a = window === null || window === void 0 ? void 0 : window.scrollTo) === null || _a === void 0 ? void 0 : _a.call(window, 0, 0); }, []);
    const onEndOfList = useCallback(() => {
        dispatchSkyfireMethods(dispatch, props.template, onEndOfWidgetsReached);
    }, [dispatch, props.template, onEndOfWidgetsReached]);
    return (React.createElement("div", { className: Styles.viewContent },
        React.createElement(BackgroundImage, { src: image }),
        refinementHeader && (React.createElement(RefinementHeader, { text: refinementHeader.text, refinementOptions: refinementHeader.refinementOptions, isActive: refinementHeader.isActive, isDisabled: refinementHeader.isDisabled, isOpened: refinementHeader.isOpened })),
        header && (React.createElement("div", { className: Styles.header },
            React.createElement("h1", { className: "music-headline-2" }, header))),
        searchHeader && React.createElement(SearchHeader, Object.assign({}, searchHeader, { template: props.template })),
        (widgets === null || widgets === void 0 ? void 0 : widgets.length) ? (React.createElement("music-container", { id: id, key: key, onrendered: widgetsRendered },
            React.createElement(WidgetList, { list: widgets, handleSelected: handleSelected, onEndOfList: (onEndOfWidgetsReached === null || onEndOfWidgetsReached === void 0 ? void 0 : onEndOfWidgetsReached.length) > 0 ? onEndOfList : undefined, isEnumerated: isEnumerated }))) : (React.createElement(LoadingSpinner, null))));
    function handleSelected(onItemSelected) {
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }
    function widgetsRendered(event) {
        if (event.target.id === props.template.id) {
            dispatchTemplateRendered(dispatch, props.template, event.detail);
            dispatchSkyfireMethods(dispatch, props.template, props.template.onViewed);
        }
    }
}
