import debounce from 'debounce';
export function bindHandler(fn, context, ...args) {
    return debounce(fn.bind(context, ...args), 500, true);
}
