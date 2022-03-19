import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SUB_NAV_TEMPLATE } from '../types/templates/subNav';
import { dispatchSkyfireMethods, globals } from '../utils';
import { getDeeplink } from '../utils/getDeeplink';
import * as menuStyles from '../views/Menu.scss';
export default function SubNavbar({ template }) {
    const { innerTemplate, subNavMenuItems } = template;
    const dispatch = useDispatch();
    const handleSelected = useCallback((onItemSelected, event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        dispatchSkyfireMethods(dispatch, template, onItemSelected);
    }, [dispatch, template]);
    const handleMenuItemClick = useCallback((menuItem, event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        if (!isActive(menuItem)) {
            handleSelected(menuItem.primaryLink.onItemSelected);
        }
    }, [dispatch, template]);
    const { shouldShowSearchSuggestions } = useSelector((state) => state.SearchSuggestions);
    const isActive = (menuItem) => { var _a; return globals.location.pathname === getDeeplink((_a = menuItem === null || menuItem === void 0 ? void 0 : menuItem.primaryLink) === null || _a === void 0 ? void 0 : _a.deeplink); };
    const renderSubNavItem = (menuItem, idx) => (React.createElement("li", { id: `subnavMenuItem${idx + 1}`, className: [
            menuStyles.menubarMenuItem,
            isActive(menuItem) ? menuStyles.selected : '',
        ].join(' '), onClick: handleMenuItemClick.bind(this, menuItem) },
        React.createElement("div", { className: isActive(menuItem) ? menuStyles.hidden : '' },
            React.createElement("music-link", { kind: "secondary", href: getDeeplink(menuItem.primaryLink.deeplink) }, menuItem.text)),
        React.createElement("div", { className: isActive(menuItem) ? '' : menuStyles.hidden }, menuItem.text)));
    if ((innerTemplate === null || innerTemplate === void 0 ? void 0 : innerTemplate.interface) === SUB_NAV_TEMPLATE && !shouldShowSearchSuggestions) {
        return (React.createElement(Fragment, null,
            !innerTemplate.shouldHideSubNav && (React.createElement("div", { className: [menuStyles.menubar, menuStyles.fixedPosition].join(' '), id: "subnav" },
                React.createElement("ul", { className: menuStyles.menubarMenuItems }, subNavMenuItems.map(renderSubNavItem)))),
            React.createElement("div", { id: "verticalSubnav", className: menuStyles.menubarVertical }, !innerTemplate.shouldHideSubNav &&
                isActive(subNavMenuItems[0]) &&
                subNavMenuItems
                    .filter((item) => item.isItemVisibleVertical)
                    .map((menuItem, index) => {
                    var _a;
                    return (React.createElement("music-list-item", { id: `verticalSubnavMenuItem${index + 1}`, className: "hydrated indent", size: "medium", "has-border": true, "primary-text": menuItem.text, "show-chevron": true, onClick: handleSelected.bind(this, (_a = menuItem.primaryLink) === null || _a === void 0 ? void 0 : _a.onItemSelected) }));
                }))));
    }
    return null;
}
