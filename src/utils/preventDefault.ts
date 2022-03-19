export function preventDefault(e) {
    e.preventDefault();
    e.srcElement.blur();
}
