import { UPDATE_RECOMMENDED_TRACK_POSITION } from '../actions';
const initialState = {};
export function PlaylistRecommendationsReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_RECOMMENDED_TRACK_POSITION:
            return Object.assign(Object.assign({}, state), { updatedTrackPosition: action.payload.updatedTrackPosition });
        default:
            return state;
    }
}
