import { CLEAR_TERMINATION_TIMESTAMP, SET_TERMINATION_TIMESTAMP } from '../actions/Playback';
const initialState = {
    terminationTime: 0,
    previousTerminationTime: 0,
};
export function TerminationTimestampReducer(state = initialState, action) {
    switch (action.type) {
        case CLEAR_TERMINATION_TIMESTAMP:
            return initialState;
        case SET_TERMINATION_TIMESTAMP:
            return action.payload
                ? {
                    terminationTime: action.payload,
                    previousTerminationTime: state.terminationTime,
                }
                : state;
        default:
            return state;
    }
}
