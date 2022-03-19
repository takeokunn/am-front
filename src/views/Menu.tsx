import withStyles from 'isomorphic-style-loader/withStyles';
import { PODCAST_MENU_INTERFACES } from 'dm-podcast-web-player';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RefinementHeader from '../components/RefinementHeader';
import Widget from '../components/widgets';
import { dispatchSkyfireMethods, dispatchTemplateRendered } from '../utils';
import * as menuStyles from './Menu.scss';
import Message from './Message';
import { WINDOW_SIZE_ENUM } from '../types/IWindowSize';
import { getDeeplink } from '../utils/getDeeplink';
class Menu extends Component {
    constructor() {
        super(...arguments);
        this.handleSelected = (onItemSelected, event) => {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            const { dispatch, template } = this.props;
            dispatchSkyfireMethods(dispatch, template, onItemSelected);
        };
        this.handleSubnavClick = (onItemSelected, isSelected, event) => {
            if (isSelected) {
                return;
            }
            this.handleSelected(onItemSelected, event);
        };
        this.widgetsRendered = (event) => {
            const { dispatch, template } = this.props;
            if (event.target.id === template.id) {
                dispatchTemplateRendered(dispatch, template, event.detail);
                dispatchSkyfireMethods(dispatch, template, template.onViewed);
            }
        };
    }
    componentDidMount() {
        var _a;
        (_a = window === null || window === void 0 ? void 0 : window.scrollTo) === null || _a === void 0 ? void 0 : _a.call(window, 0, 0);
    }
    render() {
        const { widgets, menuItems, isMenuVisibleVertical, id, updatedAt, headerLabel, headerText, button, emptyTemplateImage, emptyTemplateText, emptyTemplateTitle, refinementHeader, shouldRenderSubNav, } = this.props.template;
        const { windowWidth } = this.props;
        const key = [id, updatedAt].join('-');
        const onButtonClick = button ? () => this.handleSelected(button.onItemSelected) : null;
        const renderSubNavItem = (menuItem, idx) => (React.createElement("li", { id: `subnavMenuItem${idx + 1}`, className: [
                menuStyles.menubarMenuItem,
                menuItem.isSelected ? menuStyles.selected : '',
            ].join(' '), onClick: this.handleSubnavClick.bind(this, menuItem.primaryLink.onItemSelected, menuItem.isSelected) },
            React.createElement("div", { className: menuItem.isSelected ? menuStyles.hidden : '' },
                React.createElement("music-link", { kind: "secondary", href: getDeeplink(menuItem.primaryLink.deeplink) }, menuItem.text)),
            React.createElement("div", { className: menuItem.isSelected ? '' : menuStyles.hidden }, menuItem.text)));
        const emptyMessageTemplate = {
            header: emptyTemplateTitle,
            message: emptyTemplateText,
            image: emptyTemplateImage,
        };
        return (React.createElement("div", { className: menuStyles.appContainer },
            React.createElement("div", { className: [menuStyles.menubar, menuStyles.fixedPosition].join(' '), id: "subnav" },
                React.createElement("ul", { className: menuStyles.menubarMenuItems }, menuItems.map(renderSubNavItem))),
            React.createElement("div", { className: menuStyles.menuViewContent },
                React.createElement("div", { id: "verticalSubnav", className: menuStyles.menubarVertical }, isMenuVisibleVertical &&
                    menuItems
                        .filter((item) => item.isItemVisibleVertical)
                        .map((menuItem, index) => (React.createElement("music-list-item", { id: `verticalSubnavMenuItem${index + 1}`, size: "medium", "has-border": true, "primary-text": menuItem.text, "show-chevron": windowWidth > WINDOW_SIZE_ENUM.XL, onClick: this.handleSelected.bind(this, menuItem.primaryLink.onItemSelected) })))),
                refinementHeader && (React.createElement(RefinementHeader, { text: refinementHeader.text, refinementOptions: refinementHeader.refinementOptions, isActive: refinementHeader.isActive, isDisabled: refinementHeader.isDisabled, isOpened: refinementHeader.isOpened })),
                (headerLabel || headerText || button) && (React.createElement("div", { className: !refinementHeader
                        ? [menuStyles.topMargin, menuStyles.headers].join(' ')
                        : menuStyles.headers },
                    headerLabel && React.createElement("div", { className: "label-text" }, headerLabel),
                    headerText && React.createElement("div", { className: "music-headline-2" }, headerText),
                    button && (React.createElement("div", { className: menuStyles.buttons },
                        React.createElement("music-button", { "icon-name": button.icon, size: "medium", onmusicActivate: onButtonClick }, button.text))))),
                React.createElement("div", { className: !refinementHeader && !headerLabel && !headerText && !button
                        ? [menuStyles.topMargin, menuStyles.containerDiv].join(' ')
                        : menuStyles.containerDiv }, widgets.length > 0 ||
                    emptyTemplateTitle ||
                    emptyTemplateText ||
                    emptyTemplateImage ? (React.createElement("music-container", { id: id, key: key, onrendered: this.widgetsRendered }, widgets.find((widget) => {
                    var _a;
                    return ((_a = widget.items) === null || _a === void 0 ? void 0 : _a.length) > 0 ||
                        Object.values(PODCAST_MENU_INTERFACES).includes(widget.interface);
                }) ? (widgets.map((widget) => (React.createElement(Widget, { data: widget, handleSelected: this.handleSelected })))) : (React.createElement("div", { className: menuStyles.messageContainer },
                    React.createElement(Message, { template: emptyMessageTemplate }))))) : (React.createElement(LoadingSpinner, null))))));
    }
}
function mapStateToProps(state) {
    return {
        windowWidth: state.BrowserState.windowWidth,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}
export default withStyles(menuStyles)(connect(mapStateToProps, mapDispatchToProps)(Menu));
