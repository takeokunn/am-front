export function getSkyfireAuthentication(authentication) {
    return `{
        "interface": "ClientAuthenticationInterface.v1_0.ClientTokenElement",
        "accessToken": "${authentication.accessToken}"
    }`.replace(/\s/g, '');
}
