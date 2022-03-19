import { useSelector } from 'react-redux';
export function useObserver(element) {
    var _a, _b, _c;
    const Storage = useSelector((state) => state.Storage);
    const observer = element === null || element === void 0 ? void 0 : element.observer;
    if (!observer) {
        return element;
    }
    const storedState = Storage[observer.storageGroup] && Storage[observer.storageGroup][observer.storageKey];
    const currentState = storedState === undefined ? observer.defaultState : storedState;
    return (_c = (_b = (_a = observer === null || observer === void 0 ? void 0 : observer.states) === null || _a === void 0 ? void 0 : _a[currentState]) !== null && _b !== void 0 ? _b : currentState) !== null && _c !== void 0 ? _c : observer.defaultValue;
}
export function useObservers(elements) {
    const Storage = useSelector((state) => state.Storage);
    const observers = elements.map((element) => element === null || element === void 0 ? void 0 : element.observer);
    const filteredObservers = observers.filter((value) => value !== undefined);
    if (filteredObservers.length === 0) {
        return elements;
    }
    return observers.map((observer, idx) => {
        var _a, _b, _c;
        if (!observer) {
            return elements[idx];
        }
        const storedState = Storage[observer.storageGroup] && Storage[observer.storageGroup][observer.storageKey];
        const currentState = storedState === undefined ? observer.defaultState : storedState;
        return (_c = (_b = (_a = observer === null || observer === void 0 ? void 0 : observer.states) === null || _a === void 0 ? void 0 : _a[currentState]) !== null && _b !== void 0 ? _b : currentState) !== null && _c !== void 0 ? _c : observer.defaultValue;
    });
}
