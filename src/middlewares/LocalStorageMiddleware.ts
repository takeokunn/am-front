import { SET_ON_APPLICATION_STARTED } from '../types/interactions/ISkyfireSetOnApplicationStartedMethod';
import { SET_ACTIVITY_STATE_METHOD, ACTIVITY_STORAGE_KEY, } from '../types/interactions/ISkyfireSetActivityFeedState';
import { getParameterByName, globals } from '../utils';
export const LocalStorageMiddleware = (store) => (next) => async (action) => {
    next(action);
    switch (action.type) {
        case SET_ON_APPLICATION_STARTED: {
            const { deviceId } = store.getState().Authentication;
            const env = getParameterByName('skyfireEnv', globals.location.href);
            const key = `${deviceId}_${env}_onStart`;
            globals.localStorage.setItem(key, JSON.stringify(action.payload.onApplicationStarted));
            break;
        }
        case SET_ACTIVITY_STATE_METHOD: {
            const candidateFeedIdList = action.payload.feedItemIds;
            if (!(candidateFeedIdList === null || candidateFeedIdList === void 0 ? void 0 : candidateFeedIdList.length)) {
                // This codepath never be executed in the current iteration
                break;
            }
            const listOfFeedIds = globals.localStorage.getItem(ACTIVITY_STORAGE_KEY);
            const setOfFeedIds = listOfFeedIds ? new Set(JSON.parse(listOfFeedIds)) : new Set([]);
            const candidateFeedIdSet = new Set(candidateFeedIdList || []);
            const unionFeedIds = new Set([...setOfFeedIds, ...candidateFeedIdSet]);
            if (unionFeedIds.size !== setOfFeedIds.size) {
                globals.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([...unionFeedIds]));
            }
            break;
        }
        default:
            break;
    }
};
