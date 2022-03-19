export const EXECUTE_METHOD = 'EXECUTE_METHOD';
export function executeMethod(method) {
    return {
        payload: formatMethod(method),
        type: EXECUTE_METHOD,
    };
}
export const EXECUTE_METHODS = 'EXECUTE_METHODS';
export function executeMethods(methods) {
    return {
        payload: methods.map(formatMethod),
        type: EXECUTE_METHODS,
    };
}
function formatMethod(method) {
    return {
        type: method.interface,
        payload: method,
    };
}
