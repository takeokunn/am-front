const MAX_TIMEOUT_24_DAYS = 2147483647;
export const SHOW_NOTIFICATION = 'Web.TemplatesInterface.v1_0.Touch.ChromeTemplateInterface.ShowNotificationMethod';
export const CLOSE_NOTIFICATION = 'Web.TemplatesInterface.v1_0.Touch.ChromeTemplateInterface.CloseNotificationMethod';
export const getTimeoutMilliseconds = (seconds) => Math.min(MAX_TIMEOUT_24_DAYS, seconds * 1000);
