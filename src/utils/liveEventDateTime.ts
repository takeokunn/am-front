import { isMobileUserAgent } from './platform';
import { reportError } from '../components/ErrorBoundary';
const FALLBACK_LOCALE = 'en-US';
const FALLBACK_TIMEZONE = 'America/Los_Angeles';
export const getICalURL = (icalFormattedStartDate, icalFormattedEndDate, summary, description) => {
    let calendarUrl = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `URL:${document.URL}`,
        `DTSTART:${icalFormattedStartDate}`,
        `DTEND:${icalFormattedEndDate}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${document.URL}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\n');
    if (isMobileUserAgent()) {
        calendarUrl = encodeURI(`data:text/calendar;charset=utf8,${calendarUrl}`);
    }
    return calendarUrl;
};
export const getLocalizedEventTime = (date, formattedLocaleString, timeZone, Authentication) => {
    try {
        return date.toLocaleTimeString(formattedLocaleString, {
            timeZone,
            timeZoneName: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        reportError(e, Authentication);
        return date.toLocaleTimeString(FALLBACK_LOCALE, {
            timeZone: FALLBACK_TIMEZONE,
            timeZoneName: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
};
export const getLocalizedEventDate = (date, formattedLocaleString, timeZone, Authentication) => {
    try {
        return date.toLocaleDateString(formattedLocaleString, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone,
        });
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        reportError(e, Authentication);
        return date.toLocaleDateString(FALLBACK_LOCALE, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: FALLBACK_TIMEZONE,
        });
    }
};
