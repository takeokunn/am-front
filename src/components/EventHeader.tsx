import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Countdown, { zeroPad } from 'react-countdown';
import * as dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import * as Styles from './EventHeader.scss';
import { dispatchSkyfireMethods, preventDefault } from '../utils';
import Template from '../Contexts/Template';
import { getICalURL, getLocalizedEventDate, getLocalizedEventTime, } from '../utils/liveEventDateTime';
import { isMobileUserAgent } from '../utils/platform';
import { useInView } from '../utils/useItemsInView';
import { globals, useSourceCasing } from '../utils/globals';
const getLiveEventState = (startDate, endDate) => {
    dayjs.extend(isBetween);
    const now = dayjs();
    if (now.isBetween(startDate, new Date(endDate.getTime() + 30 * 60000))) {
        return 'live';
    }
    return now.isBefore(startDate) ? 'upcoming' : 'offline';
};
const getPrimaryText = (startDate, Authentication) => {
    const tz = globals.timezone;
    const formattedLocaleString = Authentication.displayLanguageId.replace('_', '-');
    return `${getLocalizedEventDate(startDate, formattedLocaleString, tz, Authentication)} ∙ ${getLocalizedEventTime(startDate, formattedLocaleString, tz, Authentication)}`;
};
const getDurationText = (startDate, endDate, durationUnitText) => {
    dayjs.extend(utc);
    dayjs.extend(duration);
    const eventDuration = Math.floor(dayjs.duration(dayjs(endDate).diff(startDate)).asHours());
    return `${eventDuration} ${durationUnitText}`;
};
const countdownRenderer = ({ days, hours, minutes, seconds }) => {
    const countDown = `${zeroPad(days)} : ${zeroPad(hours)} : ${zeroPad(minutes)} : ${zeroPad(seconds)}`;
    return React.createElement("span", null, countDown);
};
const getBtnsForLiveEventState = (liveEventState, btns) => btns.filter((btn) => liveEventState === 'live' ? btn.icon !== 'calendaradd' : btn.icon === 'calendaradd');
export default function EventHeader(props) {
    const { primaryText: headline, secondaryText, tertiaryText, postEventText, calendarDescription, durationUnitText, image, liveImage, label, buttons, iconButtons, startTime, endTime, } = props.data;
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const callbackRef = useInView(props.onViewed);
    const dispatch = useDispatch();
    const template = useContext(Template);
    const { Authentication } = useSelector((state) => state);
    const [liveEventState, setLiveEventState] = useState(getLiveEventState(startDate, endDate));
    const liveEventBtns = getBtnsForLiveEventState(liveEventState, buttons);
    const onClick = useCallback((onItemSelected, event) => {
        if (template) {
            dispatchSkyfireMethods(dispatch, template, onItemSelected);
        }
    }, [dispatch, template]);
    const onCalendarClick = () => {
        dayjs.extend(utc);
        const icalFormattedStartDate = dayjs(startDate)
            .utc()
            .format('YYYYMMDDTHHmmssZ')
            .replace('+00:00', 'Z');
        const icalFormattedEndDate = dayjs(endDate)
            .utc()
            .format('YYYYMMDDTHHmmssZ')
            .replace('+00:00', 'Z');
        const formattedCalendarDescription = [document.URL, calendarDescription]
            .join('\n\n')
            .replace(/\n/g, '\\n');
        const url = getICalURL(icalFormattedStartDate, icalFormattedEndDate, headline, formattedCalendarDescription);
        if (!isMobileUserAgent()) {
            const filename = `${headline}.ics`;
            const blob = new Blob([url], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else {
            window.open(url, '_blank');
        }
    };
    useStyles(Styles);
    return (React.createElement("div", { className: Styles.eventHeaderContainer },
        React.createElement("div", { className: Styles.eventDetailPageOverlay }),
        React.createElement("music-detail-header", { ref: callbackRef, key: headline, style: {
                contain: 'layout',
                marginTop: '24px',
            }, label: label, headline: headline, "primary-text": liveEventState === 'offline'
                ? postEventText
                : `${getPrimaryText(startDate, Authentication)} ∙ ${getDurationText(startDate, endDate, durationUnitText)}`, "primary-text-href": null, onmusicPrimaryTextActivate: null, "secondary-text": liveEventState === 'offline' ? null : secondaryText, "secondary-text-href": null, onmusicSecondaryTextActivate: null, onClick: preventDefault, useSourceCasing: useSourceCasing() }),
        React.createElement("div", { className: Styles.eventHeaderDetailContainer },
            React.createElement("div", { className: [
                    Styles.imageContainer,
                    liveEventState === 'offline' ? Styles.offline : '',
                ].join(' ') },
                React.createElement("music-image", { src: liveEventState === 'live' ? liveImage : image, alt: headline })),
            liveEventState === 'upcoming' && (React.createElement("div", null,
                React.createElement("div", { className: Styles.countdownContainer },
                    React.createElement("span", null,
                        React.createElement("p", null, tertiaryText)),
                    React.createElement(Countdown, { date: startDate, intervalDelay: 0, precision: 4, renderer: countdownRenderer, onComplete: () => setLiveEventState('live') })),
                React.createElement("div", { className: Styles.calendarCtaContainer },
                    liveEventBtns.map((btn, index) => (React.createElement("music-button", { key: btn.icon, slot: "buttons", variant: "glass", "icon-name": btn.icon, onClick: () => {
                            onCalendarClick();
                            onClick(btn.onItemSelected);
                        } }, btn.text))),
                    iconButtons.map((btn) => (React.createElement("music-button", { key: btn.icon, "icon-name": btn.icon, slot: "buttons", "icon-only": true, variant: "glass", size: "small", onClick: onClick.bind(this, btn.onItemSelected) })))))),
            liveEventState === 'live' && (React.createElement("div", { className: Styles.ctaContainer },
                liveEventBtns.map((btn, index) => (React.createElement("music-button", { key: btn.icon, slot: "buttons", variant: index % 2 === 0 ? 'solid' : 'outline', onClick: onClick.bind(this, btn.onItemSelected), href: btn.href }, btn.text))),
                React.createElement("div", { className: Styles.iconsContainer }, iconButtons.map((btn) => (React.createElement("music-button", { key: btn.icon, iconName: btn.icon, slot: "buttons", iconOnly: true, variant: "glass", size: "small", onClick: onClick.bind(this, btn.onItemSelected) })))))))));
}
