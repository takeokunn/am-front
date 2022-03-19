export function getLanguageDirection() {
    const rtlSupportedLanguages = ['ar'];
    const enableRtl = rtlSupportedLanguages.includes(document.documentElement.lang);
    if (enableRtl) {
        return 'rtl';
    }
    return 'ltr';
}
