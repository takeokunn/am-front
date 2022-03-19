import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { dispatchSkyfireMethods } from '../utils';
import * as Styles from './SearchHeader.scss';
const SPACER = ' ';
export default function SearchHeader(props) {
    const dispatch = useDispatch();
    const handleClick = useCallback((item) => (event) => {
        var _a;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        dispatchSkyfireMethods(dispatch, props.template, (_a = item.action) === null || _a === void 0 ? void 0 : _a.onItemSelected);
    }, [dispatch, props.template]);
    useStyles(Styles);
    return (React.createElement("div", { className: "grid-left-right-spacings" }, props.actions.map((item, index) => {
        var _a;
        const classNames = index === 0
            ? Styles.searchSpellCorrectionResult
            : Styles.searchSpellCorrectionLink;
        const element = item.action != null ? (React.createElement("music-link", { className: classNames, href: (_a = item.action) === null || _a === void 0 ? void 0 : _a.deeplink, onClick: handleClick(item) }, item.actionLabel)) : (React.createElement("div", { className: Styles.searchSpellCorrectionText },
            React.createElement("span", null, item.actionLabel)));
        const prefix = item.prefix ? item.prefix + SPACER : null;
        const suffix = item.suffix ? SPACER + item.suffix : null;
        if (index === 0) {
            return (React.createElement("h2", { className: Styles.searchSpellCorrection },
                prefix,
                element,
                suffix));
        }
        return (React.createElement("div", { className: Styles.searchSpellCorrection },
            prefix,
            element,
            suffix));
    })));
}
