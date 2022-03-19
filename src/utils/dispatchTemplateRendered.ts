import { TEMPLATE_RENDERED } from '../actions';
export function dispatchTemplateRendered(dispatch, template, duration) {
    var _a;
    if (!((_a = template.id) === null || _a === void 0 ? void 0 : _a.includes('ChromeTemplate'))) {
        dispatch({
            type: TEMPLATE_RENDERED,
            payload: {
                template,
                detail: duration,
            },
        });
    }
}
