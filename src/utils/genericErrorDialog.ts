function getContactUsUri(win = window) {
    const domain = win.location.hostname;
    const contactUsDomainMap = {
        'music.amazon.com': 'https://www.amazon.com/contact-us?ref=dm_web_err_contact_us',
        'music-gamma.amazon.com': 'https://www.amazon.com/contact-us?ref=dm_web_err_contact_us',
        'music-ca-iad.iad.proxy.amazon.com': 'https://www.amazon.ca/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.ca': 'https://www.amazon.ca/contact-us?ref=dm_web_err_contact_us',
        'music-in-dub.dub.proxy.amazon.com': 'https://www.amazon.in/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.in': 'https://www.amazon.in/contact-us?ref=dm_web_err_contact_us',
        'music-uk-dub.dub.proxy.amazon.com': 'https://www.amazon.co.uk/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.co.uk': 'https://www.amazon.co.uk/contact-us?ref=dm_web_err_contact_us',
        'music-au-pdx.pdx.proxy.amazon.com': 'https://www.amazon.com.au/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.com.au': 'https://www.amazon.com.au/contact-us?ref=dm_web_err_contact_us',
        'music-fr-dub.dub.proxy.amazon.com': 'https://www.amazon.fr/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.fr': 'https://www.amazon.fr/contact-us?ref=dm_web_err_contact_us',
        'music-de-dub.dub.proxy.amazon.com': 'https://www.amazon.de/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.de': 'https://www.amazon.de/contact-us?ref=dm_web_err_contact_us',
        'music-it-dub.dub.proxy.amazon.com': 'https://www.amazon.it/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.it': 'https://www.amazon.it/contact-us?ref=dm_web_err_contact_us',
        'music-es-dub.dub.proxy.amazon.com': 'https://www.amazon.es/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.es': 'https://www.amazon.es/contact-us?ref=dm_web_err_contact_us',
        'music-mx-iad.iad.proxy.amazon.com': 'https://www.amazon.com.mx/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.com.mx': 'https://www.amazon.com.mx/contact-us?ref=dm_web_err_contact_us',
        'music-br-preprod-iad.iad.proxy.amazon.com': 'https://www.amazon.com.br/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.com.br': 'https://www.amazon.com.br/contact-us?ref=dm_web_err_contact_us',
        'music-jp-pdx.pdx.proxy.amazon.com': 'https://www.amazon.co.jp/contact-us?ref=dm_web_err_contact_us',
        'music.amazon.co.jp': 'https://www.amazon.co.jp/contact-us?ref=dm_web_err_contact_us',
    };
    return (contactUsDomainMap[domain] || 'https://www.amazon.com/contact-us?ref=dm_web_err_contact_us');
}
function getMessage(win = window) {
    const domain = win.location.hostname;
    const domainToLanguageMap = {
        'music.amazon.com': 'English',
        'music-gamma.amazon.com': 'English',
        'music-ca-iad.iad.proxy.amazon.com': 'English',
        'music.amazon.ca': 'English',
        'music-in-dub.dub.proxy.amazon.com': 'English',
        'music.amazon.in': 'English',
        'music-uk-dub.dub.proxy.amazon.com': 'English',
        'music.amazon.co.uk': 'English',
        'music-au-pdx.pdx.proxy.amazon.com': 'English',
        'music.amazon.com.au': 'English',
        'music-fr-dub.dub.proxy.amazon.com': 'French',
        'music.amazon.fr': 'French',
        'music-de-dub.dub.proxy.amazon.com': 'German',
        'music.amazon.de': 'German',
        'music-it-dub.dub.proxy.amazon.com': 'Italian',
        'music.amazon.it': 'Italian',
        'music-es-dub.dub.proxy.amazon.com': 'Spanish',
        'music.amazon.es': 'Spanish',
        'music-mx-iad.iad.proxy.amazon.com': 'Spanish',
        'music.amazon.com.mx': 'Spanish',
        'music-br-preprod-iad.iad.proxy.amazon.com': 'Portugese',
        'music.amazon.com.br': 'Portugese',
        'music-jp-pdx.pdx.proxy.amazon.com': 'Japanese',
        'music.amazon.co.jp': 'Japanese',
    };
    const language = domainToLanguageMap[domain] || 'English';
    switch (language) {
        case 'Spanish': {
            return {
                header: 'Perdón, algo salió mal',
                body: 'Es posible que el servicio no esté disponible o que sus credenciales de autenticación no sean válidas. Vuelva a intentarlo más tarde o póngase en contacto con el Servicio de atención al cliente.',
                buttons: [
                    {
                        interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogPrimaryButtonElement',
                        text: 'Contáctanos',
                        primaryLink: {
                            interface: 'Web.PageInterface.v1_0.LinkElement',
                            deeplink: null,
                            onItemSelected: [
                                {
                                    interface: 'ExternalUriInterface.v1_0.NavigateToExternalUriMethod',
                                    uri: getContactUsUri(win),
                                    openInNewWindow: true,
                                    queue: {
                                        interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
                                        id: 'TEMPLATE',
                                    },
                                    forced: false,
                                },
                            ],
                        },
                    },
                ],
            };
        }
        case 'French': {
            return {
                header: "Désolé, quelque chose s'est mal passé",
                body: "Le service peut être indisponible ou vos informations d'authentification peuvent être invalides. Veuillez réessayer plus tard ou contacter le service client.",
                buttons: [
                    {
                        interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogPrimaryButtonElement',
                        text: 'Nous contacter',
                        primaryLink: {
                            interface: 'Web.PageInterface.v1_0.LinkElement',
                            deeplink: null,
                            onItemSelected: [
                                {
                                    interface: 'ExternalUriInterface.v1_0.NavigateToExternalUriMethod',
                                    uri: getContactUsUri(win),
                                    openInNewWindow: true,
                                    queue: {
                                        interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
                                        id: 'TEMPLATE',
                                    },
                                    forced: false,
                                },
                            ],
                        },
                    },
                ],
            };
        }
        case 'Italian': {
            return {
                header: 'Scusa, qualcosa è andato storto',
                body: 'Il servizio potrebbe non essere disponibile o le tue credenziali di autenticazione potrebbero non essere valide. Riprova più tardi o contatta il servizio clienti.',
                buttons: [
                    {
                        interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogPrimaryButtonElement',
                        text: 'Contattaci',
                        primaryLink: {
                            interface: 'Web.PageInterface.v1_0.LinkElement',
                            deeplink: null,
                            onItemSelected: [
                                {
                                    interface: 'ExternalUriInterface.v1_0.NavigateToExternalUriMethod',
                                    uri: getContactUsUri(win),
                                    openInNewWindow: true,
                                    queue: {
                                        interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
                                        id: 'TEMPLATE',
                                    },
                                    forced: false,
                                },
                            ],
                        },
                    },
                ],
            };
        }
        case 'German': {
            return {
                header: 'Entschuldigung, etwas ist schief gelaufen',
                body: 'Der Dienst ist möglicherweise nicht verfügbar oder Ihre Authentifizierungsdaten sind möglicherweise ungültig. Bitte versuchen Sie es später erneut oder wenden Sie sich an den Kundendienst.',
                buttons: [
                    {
                        interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogPrimaryButtonElement',
                        text: 'Kontakt',
                        primaryLink: {
                            interface: 'Web.PageInterface.v1_0.LinkElement',
                            deeplink: null,
                            onItemSelected: [
                                {
                                    interface: 'ExternalUriInterface.v1_0.NavigateToExternalUriMethod',
                                    uri: getContactUsUri(win),
                                    openInNewWindow: true,
                                    queue: {
                                        interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
                                        id: 'TEMPLATE',
                                    },
                                    forced: false,
                                },
                            ],
                        },
                    },
                ],
            };
        }
        case 'Portugese': {
            return {
                header: 'Desculpe, algo deu errado',
                body: 'O serviço pode estar indisponível ou suas credenciais de autenticação podem ser inválidas. Tente novamente mais tarde ou entre em contato com o Atendimento ao Cliente.',
                buttons: [
                    {
                        interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogPrimaryButtonElement',
                        text: 'Entrar em contato conosco',
                        primaryLink: {
                            interface: 'Web.PageInterface.v1_0.LinkElement',
                            deeplink: null,
                            onItemSelected: [
                                {
                                    interface: 'ExternalUriInterface.v1_0.NavigateToExternalUriMethod',
                                    uri: getContactUsUri(win),
                                    openInNewWindow: true,
                                    queue: {
                                        interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
                                        id: 'TEMPLATE',
                                    },
                                    forced: false,
                                },
                            ],
                        },
                    },
                ],
            };
        }
        case 'Japanese': {
            return {
                header: '何かがうまくいかなかった',
                body: 'サービスが利用できないか、認証資格情報が無効である可能性があります。 後で再試行するか、カスタマーサービスにお問い合わせください。',
                buttons: [
                    {
                        interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogPrimaryButtonElement',
                        text: 'お問い合わせ',
                        primaryLink: {
                            interface: 'Web.PageInterface.v1_0.LinkElement',
                            deeplink: null,
                            onItemSelected: [
                                {
                                    interface: 'ExternalUriInterface.v1_0.NavigateToExternalUriMethod',
                                    uri: getContactUsUri(win),
                                    openInNewWindow: true,
                                    queue: {
                                        interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
                                        id: 'TEMPLATE',
                                    },
                                    forced: false,
                                },
                            ],
                        },
                    },
                ],
            };
        }
        case 'English':
        default: {
            return {
                header: 'Sorry, something went wrong',
                body: 'The service may be unavailable or your authentication credentials may be invalid. Please try again later, or contact Customer Service.',
                buttons: [
                    {
                        interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogPrimaryButtonElement',
                        text: 'Contact Us',
                        primaryLink: {
                            interface: 'Web.PageInterface.v1_0.LinkElement',
                            deeplink: null,
                            onItemSelected: [
                                {
                                    interface: 'ExternalUriInterface.v1_0.NavigateToExternalUriMethod',
                                    uri: getContactUsUri(win),
                                    openInNewWindow: true,
                                    queue: {
                                        interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
                                        id: 'TEMPLATE',
                                    },
                                    forced: false,
                                },
                            ],
                        },
                    },
                ],
            };
        }
    }
}
export function getGenericErrorDialogMethod(win = window) {
    const message = getMessage(win);
    return {
        forced: false,
        interface: 'TemplateListInterface.v1_0.CreateAndBindTemplateMethod',
        queue: {
            interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
            id: 'TEMPLATE',
        },
        screenMode: 'standard',
        template: {
            body: message.body,
            buttons: message.buttons,
            header: message.header,
            imageAltText: null,
            interface: 'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.DialogTemplate',
            launchMode: 'standard',
            onBound: [],
            onCreated: [],
            onViewed: [],
        },
    };
}
