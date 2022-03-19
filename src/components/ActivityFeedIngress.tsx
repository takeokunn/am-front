import React from 'react';
import { useSelector } from 'react-redux';
import ContextMenuButton from './ContextMenuButton';
import { globals } from '../utils';
import { ACTIVITY_STORAGE_KEY } from '../types/interactions/ISkyfireSetActivityFeedState';
const getActivityFeedItems = () => {
    var _a;
    const item = globals.localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return item ? (_a = JSON.parse(item)) !== null && _a !== void 0 ? _a : [] : [];
};
function shouldComponentUpdate(prevProps, nextProps) {
    return prevProps.windowWidth !== nextProps.windowWidth;
}
function ActivityFeedIngress(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { feedItemIds } = useSelector((state) => state.ActivityFeed);
    const { template } = props;
    const options = [];
    const name = (_b = (_a = template.settingsSections) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.header;
    const tier = (_d = (_c = template.settingsSections) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.label;
    const activityFeedAriaLabelText = template.activityFeedAltText;
    const showSignInButton = (_f = (_e = template.settingsSections) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.showSignInButton;
    const { signInButtonText } = template;
    const activityFeedItems = ((_g = props.template.activityFeed) === null || _g === void 0 ? void 0 : _g.items) || [];
    const activityFeedItemIds = activityFeedItems.map(({ uuid }) => uuid);
    const seenItemSet = new Set(getActivityFeedItems());
    const showIndicator = !!activityFeedItemIds.find((id) => !seenItemSet.has(id));
    return (React.createElement(ContextMenuButton, { id: "activityFeed", options: options, widget: template.activityFeed, header: name, label: tier, variant: "secondary", isRefinement: false, size: "medium", showSignInButton: showSignInButton, signInButtonText: signInButtonText, onItemSelected: (_h = template.activityFeed) === null || _h === void 0 ? void 0 : _h.onViewed, iconName: showIndicator ? 'notificationsdot' : 'notifications', ariaLabelText: activityFeedAriaLabelText }));
}
export default React.memo(ActivityFeedIngress, shouldComponentUpdate);
