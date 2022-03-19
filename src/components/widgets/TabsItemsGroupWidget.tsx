import useStyles from 'isomorphic-style-loader/useStyles';
import React, { Fragment, useEffect, useState } from 'react';
import DescriptiveShowcase from './DescriptiveShowcase';
import * as menuStyles from '../../views/Menu.scss';
import * as trackStyles from '../../views/Track.scss';
export default function TabsItemsGroupWidget(props) {
    const items = props.data.items.filter((item) => item.showcase.items.length > 0);
    useStyles(menuStyles, trackStyles);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const showcaseList = items.map((item) => item.showcase);
    const tabList = items.map((item) => item.tab);
    useEffect(() => {
        if (activeTabIndex === tabList.length) {
            setActiveTabIndex(activeTabIndex - 1 >= 0 ? activeTabIndex - 1 : 0);
        }
    }, [items.length]);
    const switchTab = (index) => {
        if (activeTabIndex !== index) {
            setActiveTabIndex(index);
        }
    };
    const renderTabs = (tab, index) => (React.createElement("li", { id: `${tab.text}`, className: [
            menuStyles.menubarMenuItem,
            activeTabIndex === index ? menuStyles.selected : '',
        ].join(' ') },
        React.createElement("div", { className: activeTabIndex === index ? menuStyles.hidden : '' },
            React.createElement("music-link", { kind: "secondary", onClick: switchTab.bind(this, index) }, tab.text)),
        React.createElement("div", { className: activeTabIndex === index ? '' : menuStyles.hidden }, tab.text)));
    const renderTrackList = (showcase, index) => activeTabIndex === index && (React.createElement(DescriptiveShowcase, { data: showcase, handleSelected: props.handleSelected, key: showcase.header, alwaysShowButtonForHorizontalItem: true, shouldUpdateTrackPosition: true, currTemplate: props.currTemplate }));
    return (React.createElement(Fragment, null,
        React.createElement("div", { className: menuStyles.menubar, id: "tabsItemsGroupWidgetNavBar" },
            React.createElement("ul", { className: menuStyles.menubarMenuItems }, tabList.map(renderTabs))),
        React.createElement("div", { id: "verticalTabsItemsGroupWidgetNavBar", className: menuStyles.hidden }, tabList.map((menuItem, index) => (React.createElement("music-list-item", { id: `verticalTabsItemsGroupWidgetNavBarItem${index + 1}`, className: "hydrated indent", size: "medium", "has-border": true, "primary-text": menuItem.text, "show-chevron": true, onClick: switchTab.bind(this, index) })))),
        React.createElement("div", { className: trackStyles.trackContainer }, showcaseList.map(renderTrackList))));
}
