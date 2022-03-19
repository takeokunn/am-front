export const SET_AUTHENTICATION_METHOD = 'SetAuthenticationMethod';
export const SET_CSRF = 'SetCSRF';
export const UPDATE_DISPLAY_LANGUAGE = 'UPDATE_DISPLAY_LANGUAGE';
export const SET_DISPLAY_LANGUAGE = 'SET_DISPLAY_LANGUAGE';
export const SET_VIDEO_PLAYER_TOKEN = 'VideoPlayerAuthenticationInterface.v1_0.SetVideoPlayerTokenMethod';
export function setAuthentication({ accessToken, expiresAt, }) {
    return {
        type: SET_AUTHENTICATION_METHOD,
        payload: {
            accessToken,
            expiresAt,
        },
    };
}
