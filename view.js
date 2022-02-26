export const UI_ELEMENTS = {
    CHAT: {
        login: document.querySelector('.chat__preferences-login'),
        form: document.querySelector('.chat__form'),
        window: document.querySelector('.chat__window'),
        template: document.querySelector('.template'),
        templateUser: document.querySelector('.template__user'),
        preferences: document.querySelector('.popup-preferences'),
        logout: document.querySelector('.chat__logout'),
    },
    POPUP_NICK_NAME: {
        form: document.querySelector('.popup__nickname-form'),
        input: document.querySelector('.popup__input-nickName'),
        button: document.querySelector('.button__nickname'),
        window: document.querySelector('.popup__nickname'),
    },
    POPUP_AUTHORIZATION: {
        form: document.querySelector('.popup__authorization-form'),
        window: document.querySelector('.popup__authorization'),
        input: document.querySelector('#authorization'),
        button: document.querySelector('.popup__authorization-button'),
    },
    POPUP_VERIFICATION: {
        button: document.querySelector('.popup__verification-button'),
        window: document.querySelector('.popup__verification'),
        input: document.querySelector('#verificationInput'),
        form: document.querySelector('.popup__verification-form')
    },
}

export const API = {
    URL: 'https://chat1-341409.oa.r.appspot.com/api/user',
    URL_GET: 'https://chat1-341409.oa.r.appspot.com/api/messages/',
    URL_ME: 'https://chat1-341409.oa.r.appspot.com/api/user/me',
    URL_SOCKET: 'wss://chat1-341409.oa.r.appspot.com/websockets?',
    HEADERS_POST: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
}

