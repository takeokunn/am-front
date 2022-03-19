import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PodcastFollowsShoveler, PodcastLibraryPlaylist, PodcastLibraryRecents, PodcastLibraryShows, PodcastBookmarksShoveler, PODCAST_BOOKMARKS_SHOVELER_WIDGET, PODCAST_FOLLOWS_SHOVELER_WIDGET, PODCAST_LIBRARY_PLAYLIST_WIDGET, PODCAST_LIBRARY_RECENTS_WIDGET, PODCAST_LIBRARY_SHOWS_WIDGET, } from 'dm-podcast-web-player';
import { TABS_ITEMS_GROUP_WIDGET } from '../../types/templates/widgets/ISkyfireTabsItemsGroupWidgetElement';
import TabsItemsGroupWidget from './TabsItemsGroupWidget';
import { dispatchSkyfireMethods, globals } from '../../utils';
import { DESCRIPTIVE_LISTING } from '../../types/templates/widgets/ISkyfireDescriptiveListing';
import { DESCRIPTIVE_SHOVELER } from '../../types/templates/widgets/ISkyfireDescriptiveShoveler';
import { DESCRIPTIVE_SHOWCASE } from '../../types/templates/widgets/ISkyfireDescriptiveShowcase';
import { DESCRIPTIVE_TABLE_WIDGET } from '../../types/templates/widgets/ISkyfireDescriptiveTableWidget';
import { EVENT_HEADER } from '../../types/templates/widgets/ISkyfireEventHeaderWidget';
import { FEATURED_BANNER } from '../../types/templates/widgets/ISkyfireFeaturedBanner';
import { FEATURED_PLAY } from '../../types/templates/widgets/ISkyfireFeaturedPlay';
import { PODCAST_FEATURED_PLAY } from '../../types/templates/widgets/ISkyfirePodcastFeaturedPlay';
import { FEATURED_SHOVELER } from '../../types/templates/widgets/ISkyfireFeaturedShoveler';
import { FLEXIBLE_TEXT_WIDGET } from '../../types/templates/widgets/ISkyfireFlexibleTextWidget';
import { LINK_NAVIGATOR_WIDGET } from '../../types/templates/widgets/ISkyfireLinkNavigatorWidget';
import { MESSAGE_WIDGET } from '../../types/templates/widgets/ISkyfireMessageWidget';
import { PILL_NAVIGATOR_WIDGET } from '../../types/templates/widgets/ISkyfirePillNavigatorWidget';
import { RETAIL_HEADER } from '../../types/templates/widgets/ISkyfireRetailHeaderWidget';
import { SECTION } from '../../types/templates/widgets/ISkyfireSectionWidget';
import { THUMBNAIL_NAVIGATOR_WIDGET } from '../../types/templates/widgets/ISkyfireThumbnailNavigatorWidget';
import { VISUAL_LISTING } from '../../types/templates/widgets/ISkyfireVisualListing';
import { VISUAL_SHOVELER, } from '../../types/templates/widgets/ISkyfireVisualShoveler';
import { VISUAL_SHOWCASE } from '../../types/templates/widgets/ISkyfireVisualShowcase';
import { VISUAL_TABLE_WIDGET } from '../../types/templates/widgets/ISkyfireVisualTableWidget';
import DescriptiveListing from './DescriptiveListing';
import DescriptiveShoveler from './DescriptiveShoveler';
import DescriptiveShowcase from './DescriptiveShowcase';
import DescriptiveTableWidget from './DescriptiveTableWidget';
import EventHeader from '../EventHeader';
import FeaturedBanner from './FeaturedBanner';
import FeaturedPlay from './FeaturedPlay';
import PodcastFeaturedPlay from './PodcastFeaturedPlay';
import FeaturedShoveler from './FeaturedShoveler';
import FlexibleTextWidget from './FlexibleTextWidget';
import LinkNavigatorWidget from './LinkNavigatorWidget';
import MessageWidget from './MessageWidget';
import PillNavigatorWidget from './PillNavigatorWidget';
import RetailHeader from '../RetailHeader';
import ThumbnailNavigatorWidget from './ThumbnailNavigatorWidget';
import VisualListing from './VisualListing';
import VisualShoveler from './VisualShoveler';
import VisualTableWidget from './VisualTableWidget';
import Template from '../../Contexts/Template';
import Section from '../Section';
export default function Widget(props) {
    var _a, _b, _c;
    const dispatch = useDispatch();
    const currTemplate = useContext(Template);
    const widgets = (_a = currTemplate === null || currTemplate === void 0 ? void 0 : currTemplate.innerTemplate) === null || _a === void 0 ? void 0 : _a.widgets;
    const topWidget = widgets && widgets.length > 0 ? widgets[0] : undefined;
    const [topWidgetItemCount, setTopWidgetItemCount] = useState(topWidget && 'items' in topWidget && topWidget.items instanceof Array
        ? topWidget.items.length
        : 0);
    const isInitialRender = useRef(true);
    const onViewed = useCallback(() => {
        const onViewedMethods = props.data.onViewed;
        if (currTemplate && (onViewedMethods === null || onViewedMethods === void 0 ? void 0 : onViewedMethods.length) > 0) {
            dispatchSkyfireMethods(dispatch, currTemplate, onViewedMethods);
        }
    }, [widgets]);
    const uiContentViewOnViewEnabled = (_c = (_b = globals.amznMusic) === null || _b === void 0 ? void 0 : _b.appConfig) === null || _c === void 0 ? void 0 : _c.uiContentViewOnViewEnabled;
    useEffect(() => {
        var _a;
        if (uiContentViewOnViewEnabled)
            return;
        if (isInitialRender.current) {
            onViewed();
            isInitialRender.current = false;
            return;
        }
        const newTopWidget = ((_a = currTemplate === null || currTemplate === void 0 ? void 0 : currTemplate.innerTemplate) === null || _a === void 0 ? void 0 : _a.widgets) && currTemplate.innerTemplate.widgets.length > 0
            ? currTemplate.innerTemplate.widgets[0]
            : undefined;
        // Dispatch onViewed methods when top widget is updated with new items,
        // to support pagination view metrics
        if ((newTopWidget === null || newTopWidget === void 0 ? void 0 : newTopWidget.items) && newTopWidget.items.length > topWidgetItemCount) {
            onViewed();
            setTopWidgetItemCount(newTopWidget.items.length);
        }
    }, [widgets]);
    const getWidget = () => {
        switch (props.data.interface) {
            case VISUAL_SHOVELER:
            case VISUAL_SHOWCASE:
                return (React.createElement(VisualShoveler, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, onViewed: onViewed }));
            case DESCRIPTIVE_SHOVELER:
                return (React.createElement(DescriptiveShoveler, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, onViewed: onViewed }));
            case FEATURED_SHOVELER:
                return (React.createElement(FeaturedShoveler, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, onViewed: onViewed }));
            case DESCRIPTIVE_TABLE_WIDGET:
                return (React.createElement(DescriptiveTableWidget, { data: props.data, handleSelected: props.handleSelected, onViewed: onViewed }));
            case VISUAL_TABLE_WIDGET:
                return (React.createElement(VisualTableWidget, { data: props.data, handleSelected: props.handleSelected, onViewed: onViewed }));
            case LINK_NAVIGATOR_WIDGET:
                return (React.createElement(LinkNavigatorWidget, { items: props.data.items, header: props.data.header, handleSelected: props.handleSelected, onViewed: onViewed }));
            case THUMBNAIL_NAVIGATOR_WIDGET:
                return (React.createElement(ThumbnailNavigatorWidget, { header: props.data.header, items: props.data.items, handleSelected: props.handleSelected, onViewed: onViewed }));
            case VISUAL_LISTING:
                return (React.createElement(VisualListing, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, isEnumerated: props.isEnumerated, onViewed: onViewed }));
            case DESCRIPTIVE_SHOWCASE:
                return (React.createElement(DescriptiveShowcase, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, onViewed: onViewed }));
            case DESCRIPTIVE_LISTING:
                return (React.createElement(DescriptiveListing, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, isEnumerated: props.isEnumerated, onViewed: onViewed }));
            case TABS_ITEMS_GROUP_WIDGET:
                return (React.createElement(TabsItemsGroupWidget, { data: props.data, handleSelected: props.handleSelected, onViewed: onViewed, currTemplate: currTemplate }));
            case MESSAGE_WIDGET:
                return (React.createElement(MessageWidget, { data: props.data, handleSelected: props.handleSelected, key: props.data.message, onViewed: onViewed }));
            case FLEXIBLE_TEXT_WIDGET:
                return React.createElement(FlexibleTextWidget, { items: props.data.items, onViewed: onViewed });
            case FEATURED_BANNER:
                return (React.createElement(FeaturedBanner, { data: props.data, key: props.data.imageAltText, onViewed: onViewed }));
            case FEATURED_PLAY:
                return (React.createElement(FeaturedPlay, { data: props.data, key: props.data.header, handleSelected: props.handleSelected, onViewed: onViewed }));
            case PILL_NAVIGATOR_WIDGET:
                return (React.createElement(PillNavigatorWidget, { data: props.data, handleSelected: props.handleSelected, onViewed: onViewed }));
            case PODCAST_LIBRARY_SHOWS_WIDGET:
                return (React.createElement(PodcastLibraryShows, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, onViewed: onViewed }));
            case PODCAST_LIBRARY_RECENTS_WIDGET:
                return (React.createElement(PodcastLibraryRecents, { data: props.data, handleSelected: props.handleSelected, key: props.data.header, onViewed: onViewed }));
            case PODCAST_LIBRARY_PLAYLIST_WIDGET:
                return (React.createElement(PodcastLibraryPlaylist, { data: props.data, handleSelected: props.handleSelected, onViewed: onViewed }));
            case PODCAST_BOOKMARKS_SHOVELER_WIDGET:
                return (React.createElement(PodcastBookmarksShoveler, { data: props.data, handleSelected: props.handleSelected, onViewed: onViewed }));
            case PODCAST_FOLLOWS_SHOVELER_WIDGET:
                return (React.createElement(PodcastFollowsShoveler, { data: props.data, handleSelected: props.handleSelected, onViewed: onViewed }));
            case PODCAST_FEATURED_PLAY:
                return (React.createElement(PodcastFeaturedPlay, { data: props.data, key: props.data.header, handleSelected: props.handleSelected, onViewed: onViewed }));
            case EVENT_HEADER:
                return React.createElement(EventHeader, { data: props.data, onViewed: onViewed });
            case RETAIL_HEADER:
                return React.createElement(RetailHeader, { data: props.data, onViewed: onViewed });
            case SECTION:
                return React.createElement(Section, { data: props.data, onViewed: onViewed });
            default:
                // @ts-ignore
                return React.createElement("p", null,
                    "Attempted to render unknown widget: ",
                    props.data.interface);
        }
    };
    const onrendered = () => {
        if (props.rendered) {
            props.rendered();
        }
    };
    return React.createElement("music-container", { onrendered: onrendered }, getWidget());
}
