import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import ContextMenuOverlay from '../components/ContextMenuOverlay';
import { SplashScreen } from '../components/SplashScreen';
import NotificationToast from '../components/NotificationToast';
import Tooltip from '../components/Tooltip';
import NotificationRibbon from '../components/NotificationRibbon';
import Transport from '../components/Transport';
import Template from '../Contexts/Template';
import { DIALOG_TEMPLATE } from '../types/templates/dialog';
import { NOW_PLAYING_TEMPLATE } from '../types/templates/nowPlaying';
import { VIDEO_NOW_PLAYING_TEMPLATE, } from '../types/templates/videoNowPlaying';
import MultiSelectBar from './MultiSelectBar';
import * as Styles from './TemplateContainer.scss';
import VideoNowPlaying from './VideoNowPlaying';
import View from './View';
export default function TemplateContainer() {
    useStyles(Styles);
    const { isForMusicExperience } = useSelector((state) => state.Media);
    const { currentTemplate, overlayTemplates } = useSelector((state) => state.TemplateStack);
    const { displayLanguageId } = useSelector((state) => state.Authentication);
    const { preventUserSelect } = useSelector((state) => state.InteractionState);
    const hasOverlay = overlayTemplates.length > 0;
    const videoNPVTemplate = overlayTemplates.find((template) => template.interface === VIDEO_NOW_PLAYING_TEMPLATE);
    const isAudioNPVShowing = hasOverlay &&
        !!overlayTemplates.find((template) => template.interface === NOW_PLAYING_TEMPLATE);
    const isVideoNPVShowing = hasOverlay && !!videoNPVTemplate;
    const isMusicExperienceShowing = hasOverlay && !!isForMusicExperience;
    const isNPVShowing = isAudioNPVShowing || isVideoNPVShowing || isMusicExperienceShowing;
    const isDialogShowing = hasOverlay && !!overlayTemplates.find((template) => template.interface === DIALOG_TEMPLATE);
    const backgroundClass = isNPVShowing ? Styles.hidden : hasOverlay ? Styles.blurContent : '';
    const viewContainerClass = [backgroundClass, Styles.viewContainer].join(' ');
    return (React.createElement("music-app", { class: ['hydrated', preventUserSelect ? Styles.selectDisabled : null].join(' ') },
        React.createElement(Template.Provider, { value: currentTemplate },
            currentTemplate && getSEOHead(currentTemplate, displayLanguageId),
            React.createElement("div", null, hasOverlay && overlayTemplates[0].interface !== VIDEO_NOW_PLAYING_TEMPLATE && (React.createElement(View, { template: overlayTemplates[0] }))),
            React.createElement(VideoNowPlaying, { template: videoNPVTemplate }),
            React.createElement("div", { className: viewContainerClass }, currentTemplate ? React.createElement(View, { template: currentTemplate }) : React.createElement(SplashScreen, null)),
            React.createElement(NotificationToast, { isNowPlaying: isNPVShowing, template: currentTemplate }),
            React.createElement(Tooltip, { isNowPlaying: isNPVShowing, template: currentTemplate }),
            React.createElement(NotificationRibbon, { isNowPlaying: isNPVShowing, template: currentTemplate }),
            React.createElement(Transport, { isAudioNowPlaying: isAudioNPVShowing, isVideoNowPlaying: isVideoNPVShowing, isMusicExperienceNowPlaying: isMusicExperienceShowing, isDialogShowing: isDialogShowing }),
            !hasOverlay ? React.createElement(MultiSelectBar, null) : null,
            React.createElement(ContextMenuOverlay, null))));
}
// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
function removeUndefined(obj) {
    Object.keys(obj).forEach(
    // eslint-disable-next-line no-param-reassign
    (key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
}
function getSEOHead(template, displayLanguageId) {
    var _a, _b, _c;
    const seoHead = ((_b = (_a = template === null || template === void 0 ? void 0 : template.innerTemplate) === null || _a === void 0 ? void 0 : _a.templateData) === null || _b === void 0 ? void 0 : _b.seoHead) || ((_c = template === null || template === void 0 ? void 0 : template.templateData) === null || _c === void 0 ? void 0 : _c.seoHead);
    if (seoHead) {
        // Remove interface and null fields from objects in script, meta, and link arrays
        const scripts = seoHead.script.map(({ innerHTML }) => removeUndefined({ innerHTML, type: 'application/ld+json' }));
        const metas = seoHead.meta.map(({ name, property, content }) => removeUndefined({ name, property, content }));
        const links = seoHead.link.map(({ rel, href, hreflang }) => removeUndefined({ rel, href, hreflang }));
        return (React.createElement(Helmet, { title: seoHead.title, meta: metas, link: links, script: scripts, lang: displayLanguageId }));
    }
    return null;
}
