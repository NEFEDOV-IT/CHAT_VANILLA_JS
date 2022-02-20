import { UI_ELEMENTS, API } from './view.js'
import { popupClose, closePopupEsc } from './popup.js'
import { setCookie, getCookie } from './cookie.js'
import { apiSend} from "./api.js";

popupClose()

const state = {
    ERROR_EMAIL: 'Введите корректный e-mail',
    ERROR_DATA: 'Запрос не удался, попробуйте ещё раз',
    ERROR_KEY: 'Введите корректный ключ',
}

UI_ELEMENTS.CHAT.login.addEventListener('click', () => {
    UI_ELEMENTS.POPUP_AUTHORIZATION.window.classList.add('open')
    closePopupEsc()
})

UI_ELEMENTS.POPUP_AUTHORIZATION.form.addEventListener('submit', (e) => {
    e.preventDefault()
})

UI_ELEMENTS.POPUP_AUTHORIZATION.button.addEventListener('click', () => {
    const mailAddress = UI_ELEMENTS.POPUP_AUTHORIZATION.input.value
    validateEmail(mailAddress)
})

function validateEmail(address) {
    const reg = /^([A-Za-z\d_\-.])+@([A-Za-z\d_\-.])+\.([A-Za-z]{2,4})$/
    if (!reg.test(address)) {
        UI_ELEMENTS.POPUP_AUTHORIZATION.form.reset()
        UI_ELEMENTS.POPUP_AUTHORIZATION.input.classList.add('error')
        return alert(state.ERROR_EMAIL)
    } else sendEmail(address)
}

function sendEmail(mailAddress) {
    const isValid = UI_ELEMENTS.POPUP_AUTHORIZATION.input.classList.contains('error')
    const json = JSON.stringify({email: mailAddress})

    if (isValid) {
        UI_ELEMENTS.POPUP_AUTHORIZATION.form.reset()
        UI_ELEMENTS.POPUP_AUTHORIZATION.input.classList.remove('error')
    }

    apiSend(API.URL, 'POST', API.HEADERS_POST, json, state.ERROR_DATA)

    UI_ELEMENTS.POPUP_AUTHORIZATION.form.reset()
    UI_ELEMENTS.POPUP_AUTHORIZATION.window.classList.remove('open')
    UI_ELEMENTS.POPUP_VERIFICATION.window.classList.add('open')
    closePopupEsc()
}

UI_ELEMENTS.POPUP_VERIFICATION.button.addEventListener('click', () => {
    setCookie('token', UI_ELEMENTS.POPUP_VERIFICATION.input.value)
    sendKey()
})

function sendKey() {
    const token = getCookie('token')
    const isValid = UI_ELEMENTS.POPUP_VERIFICATION.input.classList.contains('error')
    const newUser = JSON.stringify({name: 'new User'})
    const HEADERS_PATCH = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }

    if (isValid) {
        UI_ELEMENTS.POPUP_VERIFICATION.form.reset()
        UI_ELEMENTS.POPUP_VERIFICATION.input.classList.remove('error')
    }

    apiSend(API.URL, 'PATCH', HEADERS_PATCH, newUser, state.ERROR_KEY)

    UI_ELEMENTS.POPUP_VERIFICATION.form.reset()
    UI_ELEMENTS.POPUP_VERIFICATION.window.classList.remove('open')
}

UI_ELEMENTS.CHAT.preferences.addEventListener('click', () => {
    UI_ELEMENTS.POPUP_NICK_NAME.window.classList.add('open')
    closePopupEsc()
})

UI_ELEMENTS.POPUP_NICK_NAME.button.addEventListener('click', () => {
    const nickName = UI_ELEMENTS.POPUP_NICK_NAME.input.value
    sendNickName(nickName)
})

function sendNickName(nickName) {
    const token = getCookie('token')

    fetch(API.URL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name: nickName})
    })
        .then(response => response.json())
        .then(() => {
            UI_ELEMENTS.POPUP_NICK_NAME.window.classList.remove('open')
        })
        .catch(() => {
            alert(state.ERROR_KEY)
        })
}

if(getCookie('token')) {
    function infoUser() {
        const token = getCookie('token')

        const URL = 'https://chat1-341409.oa.r.appspot.com/api/user/me'
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(console.log)
            .catch(() => {
                alert(state.ERROR_KEY)
            })
    }

    infoUser()
}



UI_ELEMENTS.CHAT.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageChat = document.querySelector('.chat__form-input').value
    showMessage(messageChat)
})

function showMessage(message) {
    if (!message.trim()) return UI_ELEMENTS.CHAT.form.reset()

    const textChat = UI_ELEMENTS.CHAT.template.content.querySelector('.chat__my-message .chat__text')
    const timeChatMessage = UI_ELEMENTS.CHAT.template.content.querySelector('.chat__my-message .chat__time')

    textChat.textContent = `Я: ${message}`
    timeChatMessage.textContent = timeConverter()

    const sendMessage = UI_ELEMENTS.CHAT.template.content.cloneNode(true)
    UI_ELEMENTS.CHAT.window.prepend(sendMessage)

    UI_ELEMENTS.CHAT.form.reset()
}

function timeConverter() {
    const TIME_DATA = new Date()
    let hour = TIME_DATA.getHours()
    let min = TIME_DATA.getMinutes()
    min = (min < 10) ? '0' + min : min
    hour = (hour < 10) ? '0' + hour : hour
    return hour + ':' + min
}
