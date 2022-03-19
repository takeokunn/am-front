const marketplaceIdToCurrencyOfPreference = {
    ATVPDKIKX0DER: 'USD',
    A1AM78C64UM0Y8: 'MXN',
    A2EUQ1WTGCTBG2: 'CAD',
    A2Q3Y263D00KWC: 'BRL',
    ART4WZ8MWBX2Y: 'USD',
    A1F83G8C2ARO7P: 'GBP',
    A1PA6795UKMFR9: 'EUR',
    A13V1IB3VIYZZH: 'EUR',
    A1RKKUPIHCS9HS: 'EUR',
    APJ6JRA9NG5V4: 'EUR',
    A21TJRUUN4KGV: 'INR',
    A3K6Y4MI8GDYMT: 'USD',
    A1VC38T7YXB528: 'JPY',
    A39IBJ37TRP1C6: 'AUD',
    A15PK738MTQHSO: 'USD',
};
export function getDefaultCurrency(marketplaceId) {
    return marketplaceIdToCurrencyOfPreference[marketplaceId] || 'USD';
}
