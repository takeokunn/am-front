export function getCurrentTemplateDeeplink(TemplateStack) {
    var _a, _b, _c, _d;
    const { overlayTemplates } = TemplateStack;
    const { currentTemplate } = TemplateStack;
    return (((_c = (_b = (_a = overlayTemplates[0]) === null || _a === void 0 ? void 0 : _a.innerTemplate) === null || _b === void 0 ? void 0 : _b.templateData) === null || _c === void 0 ? void 0 : _c.deeplink) ||
        ((_d = currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate.templateData) === null || _d === void 0 ? void 0 : _d.deeplink) ||
        '');
}
