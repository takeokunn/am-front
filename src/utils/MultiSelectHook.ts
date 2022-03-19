import { useSelector } from 'react-redux';
import { useObserver } from './ObserverHooks';
export function useRowSelectedState(isSelected, selectable) {
    const downloadSelectPopulated = useSelector((state) => state.Storage.DOWNLOAD_SELECT && Object.keys(state.Storage.DOWNLOAD_SELECT).length > 0);
    const downloadSelectIsActive = selectable !== null && downloadSelectPopulated;
    const selected = !!useObserver({ observer: isSelected });
    if (downloadSelectIsActive && isSelected) {
        return selected ? 'on' : 'off';
    }
    return undefined;
}
export function selectedRowCount() {
    return (state) => { var _a; return Object.keys((_a = state.Storage.DOWNLOAD_SELECT) !== null && _a !== void 0 ? _a : {}).filter((k) => !k.startsWith('_')).length; };
}
