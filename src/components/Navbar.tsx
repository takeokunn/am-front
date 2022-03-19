import withStyles from 'isomorphic-style-loader/withStyles';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ContextMenuButton from '../components/ContextMenuButton';
import SearchBox from '../components/SearchBox';
import { WINDOW_SIZE_ENUM } from '../types/IWindowSize';
import { MENU_DROPDOWN_TEMPLATE, } from '../types/templates/chrome/ISkyfireChromeTemplateMenuDropdown';
import { MENU_ITEM_TEMPLATE, } from '../types/templates/chrome/ISkyfireChromeTemplateMenuItem';
import { MENU_TEMPLATE } from '../types/templates/menu';
import { SUB_NAV_TEMPLATE } from '../types/templates/subNav';
import { dispatchSkyfireMethods, globals } from '../utils';
import ActivityFeedIngress from './ActivityFeedIngress';
import * as Styles from './Navbar.scss';
import NavBarSettings from './NavBarSettings';
import { getDeeplink } from '../utils/getDeeplink';
import { isDesktop } from '../utils/platform';
import { isRetailPlayerRequest } from '../utils/retailPlayerHelper';
import Button from './widgets/items/Button';
class Navbar extends Component {
    constructor() {
        super(...arguments);
        this.handleSelected = (onItemSelected, event) => {
            var _a, _b, _c;
            (_b = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_c = event === null || event === void 0 ? void 0 : event.preventDefault) === null || _c === void 0 ? void 0 : _c.call(event);
            const { dispatch, template } = this.props;
            dispatchSkyfireMethods(dispatch, template, onItemSelected);
        };
        this.getMenuItem = (template, item, idx, menuItems) => {
            const { windowWidth, isSearchBoxFocused } = this.props;
            const threeButtons = (menuItems === null || menuItems === void 0 ? void 0 : menuItems.length) >= 3;
            const stackedButtonBreakPoint = threeButtons ? WINDOW_SIZE_ENUM.XL3 : WINDOW_SIZE_ENUM.XL2;
            const isStackedButton = !threeButtons && windowWidth <= stackedButtonBreakPoint;
            const iconOnly = isSearchBoxFocused || threeButtons
                ? windowWidth < WINDOW_SIZE_ENUM.XL3
                : windowWidth < WINDOW_SIZE_ENUM.LG;
            if (item.interface === MENU_ITEM_TEMPLATE) {
                const menuItem = item;
                const isActive = this.isActive(template, getDeeplink(menuItem.primaryLink.deeplink));
                return (React.createElement("li", null,
                    React.createElement("music-button", { id: this.getMenuItemId(idx), className: threeButtons ? Styles.textIconButton3 : Styles.textIconButton, "icon-name": menuItem.icon, variant: isActive ? 'accent' : 'primary', onmusicActivate: this.updateOnMusicActiveForMenuItem(template, menuItem, isActive), size: isStackedButton || iconOnly ? 'medium' : 'large', href: getDeeplink(menuItem.primaryLink.deeplink), stacked: isStackedButton, iconOnly: iconOnly, ariaLabelText: menuItem.altText }, menuItem.altText),
                    React.createElement("music-button", { id: this.getMenuItemId(idx), className: threeButtons ? Styles.noTextIconButton3 : Styles.noTextIconButton, "icon-name": menuItem.icon, variant: isActive ? 'accent' : 'primary', onmusicActivate: this.updateOnMusicActiveForMenuItem(template, menuItem, isActive), size: "medium", href: getDeeplink(menuItem.primaryLink.deeplink), iconOnly: true }, menuItem.altText)));
            }
            if (item.interface === MENU_DROPDOWN_TEMPLATE) {
                const menuDropdown = item;
                const isActive = menuDropdown.items.some((dropdownItem) => this.isActive(template, getDeeplink(dropdownItem.primaryLink.deeplink)));
                const options = menuDropdown.items.map((dropdownItem) => {
                    const isSelected = this.isSelected(dropdownItem, isActive);
                    return {
                        text: dropdownItem.text,
                        isActive: isSelected,
                        onItemSelected: dropdownItem.primaryLink.onItemSelected,
                        link: dropdownItem.primaryLink,
                    };
                });
                return (React.createElement("li", null,
                    React.createElement(ContextMenuButton, { id: this.getMenuItemId(idx), options: options, hover: isDesktop(window), variant: isActive ? 'accent' : 'primary', isRefinement: false, size: iconOnly ? 'medium' : 'large', iconName: menuDropdown.icon, postFixIconName: "caretdown", text: iconOnly ? '' : menuDropdown.text, ariaLabelText: menuDropdown.text })));
            }
            return null;
        };
    }
    render() {
        return (React.createElement("nav", { className: Styles.navbar, id: "music-navbar" }, this.renderNavbarContent()));
    }
    renderNavbarContent() {
        const { id, menuItems, searchBox, logoAltText, logoDeeplink, logoImage, logoImageSmall, logoOnItemSelected, innerTemplate, navbarActionButton, } = this.props.template;
        const { isSearchBoxFocused, windowWidth } = this.props;
        if (isSearchBoxFocused && windowWidth <= WINDOW_SIZE_ENUM.LG) {
            return React.createElement(SearchBox, { searchItem: searchBox, templateId: id });
        }
        return (React.createElement(Fragment, null,
            React.createElement("ul", { className: Styles.navbarNavigationItems },
                React.createElement("li", { className: Styles.navbarLogoContainer },
                    React.createElement("a", { id: "navbarMusicLogo", href: getDeeplink(logoDeeplink), onClick: this.handleSelected.bind(this, logoOnItemSelected) },
                        React.createElement("img", { className: Styles.navbarLogoSmall, src: logoImageSmall, alt: logoAltText, crossOrigin: "anonymous" }),
                        React.createElement("img", { className: Styles.navbarLogo, src: logoImage, alt: logoAltText }))),
                menuItems.map(this.getMenuItem.bind(this, innerTemplate)),
                React.createElement(SearchBox, { searchItem: searchBox, templateId: id }),
                navbarActionButton && windowWidth >= WINDOW_SIZE_ENUM.XL2 && (React.createElement("li", { className: Styles.navbarActionButton },
                    React.createElement(Button, { data: navbarActionButton, handleSelected: this.handleSelected, slot: "buttons", variant: "glass", size: "medium" }))),
                React.createElement(ActivityFeedButton, { styles: Styles, template: this.props.template, windowWidth: this.props.windowWidth }),
                React.createElement(AccountButton, { styles: Styles, template: this.props.template, windowWidth: windowWidth, iconOnly: windowWidth < WINDOW_SIZE_ENUM.MD }))));
    }
    isActive(template, itemPath) {
        if (!itemPath) {
            return false;
        }
        let menuItemPaths;
        if (template.interface === MENU_TEMPLATE) {
            const { menuItems } = template;
            menuItemPaths = menuItems.map((item) => getDeeplink(item.primaryLink.deeplink));
        }
        else if (template.interface === SUB_NAV_TEMPLATE) {
            // Get subnav items from Chrome Template, not the inner template
            const { subNavMenuItems } = this.props.template;
            menuItemPaths = subNavMenuItems.map((item) => { var _a; return getDeeplink((_a = item.primaryLink) === null || _a === void 0 ? void 0 : _a.deeplink); });
        }
        else {
            menuItemPaths = [globals.location.pathname];
        }
        return menuItemPaths.some((menuItemPath) => menuItemPath === itemPath);
    }
    updateOnMusicActiveForMenuItem(template, menuItem, isActive) {
        if (template.interface === SUB_NAV_TEMPLATE &&
            template.shouldHideSubNav) {
            return this.handleSelected.bind(this, menuItem.primaryLink.onItemSelected);
        }
        return this.handleSelected.bind(this, isActive ? [] : menuItem.primaryLink.onItemSelected);
    }
    isSelected(dropdownItem, isActive) {
        const currentPath = globals.location.pathname;
        const activePaths = (dropdownItem === null || dropdownItem === void 0 ? void 0 : dropdownItem.activePaths) || [];
        const result = isActive && activePaths.some((activePath) => currentPath.startsWith(activePath));
        return result;
    }
    getMenuItemId(idx) {
        return `navbarMenuItem${idx + 1}`;
    }
}
const AccountButton = ({ styles, template, windowWidth, iconOnly }) => (React.createElement("li", { role: template.activityFeed ? 'multiIngress' : undefined, key: "accountButton", className: styles.accountButton }, template.showSignInButton ? (React.createElement("music-button", { "icon-only": iconOnly, "icon-name": iconOnly ? 'profile' : undefined, size: iconOnly ? 'small' : undefined, variant: "solid", href: isRetailPlayerRequest(globals.location.hostname)
        ? '/music/player/forceSignIn'
        : '/forceSignIn?useHorizonte=true', id: "signInButton", title: "Sign in button", ariaLabelText: template.signInButtonText }, template.signInButtonText)) : (React.createElement(NavBarSettings, { template: template, windowWidth: windowWidth }))));
const ActivityFeedButton = ({ styles, template, windowWidth }) => !template.activityFeed ? null : (React.createElement("li", { role: "multiIngress", key: "activityFeed", className: styles.activityFeed },
    React.createElement(ActivityFeedIngress, { template: template, windowWidth: windowWidth })));
function mapStateToProps(state) {
    return {
        isSearchBoxFocused: state.SearchSuggestions.isSearchBoxFocused,
        windowWidth: state.BrowserState.windowWidth,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}
export default withStyles(Styles)(connect(mapStateToProps, mapDispatchToProps)(Navbar));
