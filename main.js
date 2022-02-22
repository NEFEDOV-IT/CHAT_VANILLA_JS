import { UI_ELEMENTS, API } from './view.js'
import { popupClose, closePopupEsc } from './popup.js'
import { setCookie, getCookie } from './cookie.js'
import { apiSend } from "./api.js";

popupClose()

const state = {
    ERROR_EMAIL: 'Введите корректный e-mail',
    ERROR_DATA: 'Запрос не удался, попробуйте ещё раз',
    ERROR_KEY: 'Введите корректный ключ',
    ERROR_KEY_EMAIL: 'Ключ не соответствует Email, попробуйте пройти авторизацию ещё раз'
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
    } else {
        closePopupEsc()
        sendEmail(address)
    }
}

function sendEmail(mailAddress) {
    const isValid = UI_ELEMENTS.POPUP_AUTHORIZATION.input.classList.contains('error')
    const json = JSON.stringify({email: mailAddress})

    if (isValid) {
        UI_ELEMENTS.POPUP_AUTHORIZATION.form.reset()
        UI_ELEMENTS.POPUP_AUTHORIZATION.input.classList.remove('error')
    }

    apiSend(API.URL, 'POST', API.HEADERS_POST, json, closeAddVerificationPopup, state.ERROR_DATA)
}

function closeAddVerificationPopup() {
    UI_ELEMENTS.POPUP_AUTHORIZATION.form.reset()
    UI_ELEMENTS.POPUP_AUTHORIZATION.window.classList.remove('open')
    UI_ELEMENTS.POPUP_VERIFICATION.window.classList.add('open')
    return closePopupEsc()
}

UI_ELEMENTS.POPUP_VERIFICATION.button.addEventListener('click', () => {
    setCookie('token', UI_ELEMENTS.POPUP_VERIFICATION.input.value)
    sendKey()
})

function sendKey() {
    const token = getCookie('token')
    const isValid = UI_ELEMENTS.POPUP_VERIFICATION.input.classList.contains('error')
    const newUser = JSON.stringify({name: 'new User'})
    const input = UI_ELEMENTS.POPUP_VERIFICATION.input
    const HEADERS_PATCH = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }

    if (isValid) {
        UI_ELEMENTS.POPUP_VERIFICATION.form.reset()
        UI_ELEMENTS.POPUP_VERIFICATION.input.classList.remove('error')
    }

    apiSend(API.URL, 'PATCH', HEADERS_PATCH, newUser, closeVerificationPopup, state.ERROR_KEY, input)
}

function closeVerificationPopup() {
    UI_ELEMENTS.POPUP_VERIFICATION.form.reset()
    UI_ELEMENTS.POPUP_VERIFICATION.window.classList.remove('open')
}

UI_ELEMENTS.CHAT.preferences.addEventListener('click', (e) => {
    e.preventDefault()
    UI_ELEMENTS.POPUP_NICK_NAME.window.classList.add('open')
    closePopupEsc()
})

UI_ELEMENTS.POPUP_NICK_NAME.button.addEventListener('click', () => {
    const nickName = UI_ELEMENTS.POPUP_NICK_NAME.input.value
    const token = getCookie('token')
    const json = JSON.stringify({name: nickName})
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }

    apiSend(API.URL, 'PATCH', headers, json, closePopupNickName, state.ERROR_KEY)
})

function closePopupNickName() {
    return UI_ELEMENTS.POPUP_NICK_NAME.window.classList.remove('open')
}

const socket = new WebSocket(`${API.URL_SOCKET}${getCookie('token')}`)

socket.onmessage = function(event) {
    const data = JSON.parse(event.data)
    const nickName = data.user.name

    if (data.user.email !== 'eliaz_one@mail.ru') {
        showMessageUser(data.text, nickName)
    }
}

function sendMessage(messageChat) {
    socket.send(JSON.stringify({
        text: `${messageChat}`,
    }))
}

function showMessageUser(data, nickName) {
    const textUserChat = UI_ELEMENTS.CHAT.templateUser.content.querySelector('.chat__text-user')
    const timeUserChat = UI_ELEMENTS.CHAT.templateUser.content.querySelector('.chat__time-user')

    textUserChat.textContent = `${nickName}: ${data}`
    timeUserChat.textContent = timeConverter(new Date())
    const sendUserMessage = UI_ELEMENTS.CHAT.templateUser.content.cloneNode(true)
    UI_ELEMENTS.CHAT.window.prepend(sendUserMessage)
}

UI_ELEMENTS.CHAT.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageChat = document.querySelector('.chat__form-input').value
    sendMessage(messageChat)
    showMessage(messageChat)
    UI_ELEMENTS.CHAT.form.reset()
})

function showMessage(message) {
    if (!message.trim()) return UI_ELEMENTS.CHAT.form.reset()
    const textChat = UI_ELEMENTS.CHAT.template.content.querySelector('.chat__my-message .chat__text')
    const timeChatMessage = UI_ELEMENTS.CHAT.template.content.querySelector('.chat__my-message .chat__time')

    textChat.textContent = `Я: ${message}`
    timeChatMessage.textContent = timeConverter(new Date())

    const sendMessage = UI_ELEMENTS.CHAT.template.content.cloneNode(true)
    UI_ELEMENTS.CHAT.window.prepend(sendMessage)
}

function timeConverter(data) {
    const TIME_DATA = new Date(data)
    let hour = TIME_DATA.getHours()
    let min = TIME_DATA.getMinutes()
    min = (min < 10) ? '0' + min : min
    hour = (hour < 10) ? '0' + hour : hour
    return hour + ':' + min
}
