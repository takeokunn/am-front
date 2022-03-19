import { PodcastCompactDetail, PodcastDetail, PODCAST_COMPACT_DETAIL_TEMPLATE, PODCAST_DETAIL_TEMPLATE, } from 'dm-podcast-web-player';
import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import podcastStyles from 'dm-podcast-web-player/dist/index.css';
import { CHROME_TEMPLATE } from '../types/templates/chrome';
import { DETAIL_TEMPLATE } from '../types/templates/detail';
import { DIALOG_TEMPLATE } from '../types/templates/dialog';
import { FEEDBACK_DIALOG_TEMPLATE, } from '../types/templates/feedbackDialog';
import { GALLERY_TEMPLATE, SEARCH_TEMPLATE, } from '../types/templates/gallery';
import { MENU_TEMPLATE } from '../types/templates/menu';
import { MESSAGE_TEMPLATE } from '../types/templates/message';
import { NOW_PLAYING_TEMPLATE } from '../types/templates/nowPlaying';
import { SUB_NAV_TEMPLATE } from '../types/templates/subNav';
import Chrome from './Chrome';
import Detail from './Detail';
import Dialog from './Dialog';
import FeedbackDialog from './FeedbackDialog';
import Gallery from './Gallery';
import Menu from './Menu';
import Message from './Message';
import NowPlaying from './NowPlaying';
import SubNav from './SubNav';
function View(props) {
    var _a;
    switch ((_a = props.template) === null || _a === void 0 ? void 0 : _a.interface) {
        case CHROME_TEMPLATE:
            return React.createElement(Chrome, { template: props.template });
        case PODCAST_COMPACT_DETAIL_TEMPLATE:
            return (React.createElement(PodcastCompactDetail, { template: props.template }));
        case PODCAST_DETAIL_TEMPLATE:
            return React.createElement(PodcastDetail, { template: props.template });
        case GALLERY_TEMPLATE:
        case SEARCH_TEMPLATE:
            // Search is a Gallery with a special search correction "header"
            // Consider separating them if Search is differentiated further
            return React.createElement(Gallery, { template: props.template });
        case DETAIL_TEMPLATE:
            return React.createElement(Detail, { template: props.template });
        case MESSAGE_TEMPLATE:
            return React.createElement(Message, { template: props.template });
        case DIALOG_TEMPLATE:
            return React.createElement(Dialog, { template: props.template });
        case NOW_PLAYING_TEMPLATE:
            return React.createElement(NowPlaying, { template: props.template });
        case MENU_TEMPLATE:
            return React.createElement(Menu, { template: props.template });
        case SUB_NAV_TEMPLATE:
            return React.createElement(SubNav, { template: props.template });
        case FEEDBACK_DIALOG_TEMPLATE:
            return React.createElement(FeedbackDialog, { template: props.template });
        default:
            return React.createElement("div", null, "Attempted to render an unrecognized template.");
    }
}
export default withStyles(podcastStyles)(View);
