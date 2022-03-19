import React, { Component } from 'react';
import ContextMenuButton from './ContextMenuButton';
class NavBarSettings extends Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.template.settingsSections !== nextProps.template.settingsSections ||
            this.props.windowWidth !== nextProps.windowWidth);
    }
    render() {
        var _a, _b, _c, _d, _e, _f;
        const { template } = this.props;
        if (!template.settingsSections || template.settingsSections.length <= 0) {
            return null;
        }
        const options = []
            .concat(
        // @ts-ignore
        ...(template.settingsSections || []).map((section) => section.items))
            .map((option) => (Object.assign(Object.assign({}, option), { link: option.primaryLink })));
        const name = (_b = (_a = template === null || template === void 0 ? void 0 : template.settingsSections) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.header;
        const tier = (_d = (_c = template === null || template === void 0 ? void 0 : template.settingsSections) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.label;
        const showSignInButton = (_f = (_e = template === null || template === void 0 ? void 0 : template.settingsSections) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.showSignInButton;
        const { signInButtonText } = template;
        const iconName = template === null || template === void 0 ? void 0 : template.settingsIcon;
        const variant = iconName === 'profile' ? 'glass' : 'primary';
        const iconSize = iconName === 'profile' ? 'small' : 'medium';
        return (React.createElement(ContextMenuButton, { id: "accountSetting", options: options, variant: variant, isRefinement: false, size: iconSize, iconName: iconName, header: name, label: tier, showSignInButton: showSignInButton, signInButtonText: signInButtonText, ariaLabelText: "Account Setting Menu" }));
    }
}
export default NavBarSettings;
