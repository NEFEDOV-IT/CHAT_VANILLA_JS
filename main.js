import { UI_ELEMENTS, API } from './view.js'
import { popup } from './popup.js'
import { setCookie, getCookie } from './cookie.js'

const state = {
    ERROR_EMAIL: 'Введите корректный e-mail',
    ERROR_DATA: 'Запрос не удался, попробуйте ещё раз',
    ERROR_KEY: 'Введите корректный ключ',
}

popup()

UI_ELEMENTS.authorizationForm.addEventListener('submit', (e) => {
    e.preventDefault()
})

UI_ELEMENTS.authorizationButton.addEventListener('click', () => {
    const mailAddress = UI_ELEMENTS.authorizationInput.value
    validateEmail(mailAddress)
})

function validateEmail(address) {
    const reg = /^([A-Za-z\d_\-.])+@([A-Za-z\d_\-.])+\.([A-Za-z]{2,4})$/
    if (!reg.test(address)) {
        UI_ELEMENTS.authorizationForm.reset()
        UI_ELEMENTS.authorizationInput.classList.add('error')
        return alert(state.ERROR_EMAIL)
    } else sendEmail(address)
}

function sendEmail(mailAddress) {
    const isValid = UI_ELEMENTS.authorizationInput.classList.contains('error')
    const json = JSON.stringify({email: mailAddress})

    if (isValid) {
        UI_ELEMENTS.authorizationForm.reset()
        UI_ELEMENTS.authorizationInput.classList.remove('error')
    }

    fetch(API.URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: json
    })
    .then(response => response.json())
    .then(verification)
    .catch(() => alert(state.ERROR_DATA))
}

function verification() {
    UI_ELEMENTS.authorization.classList.remove('open')
    UI_ELEMENTS.verification.classList.add('open')
}

UI_ELEMENTS.verificationButton.addEventListener('click', () => {
    setCookie('token', UI_ELEMENTS.verificationInput.value)
    UI_ELEMENTS.verification.classList.remove('open')
    UI_ELEMENTS.nickNameFormChat.classList.add('open')
})

UI_ELEMENTS.nickNameButton.addEventListener('click', (e) => {
    e.preventDefault()
    const token = getCookie('token')
    const nickName = UI_ELEMENTS.nickNameInput.value
    sendNickName(nickName, token)
})

function sendNickName(nickName, token) {
    const isValid = UI_ELEMENTS.nickNameInput.classList.contains('error')

    if (isValid) {
        UI_ELEMENTS.nickNameInput.reset()
        UI_ELEMENTS.nickNameInput.classList.remove('error')
    }

    fetch(API.URL, {
        method: 'PATH',
        headers: {
            'Accept': 'application/json;',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 'name': nickName })
    })
    .then(response => response.json())
    .then(() => {
        UI_ELEMENTS.nickNameFormChat.classList.remove('open')
    })
    .catch(() => {
        UI_ELEMENTS.nickNameInput.classList.add('error')
        alert(state.ERROR_KEY)
    })
}

UI_ELEMENTS.formChat.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageChat = document.querySelector('.chat__form-input').value
    showMessage(messageChat)
})

function showMessage(message) {
    if (!message.trim()) return UI_ELEMENTS.formChat.reset()

    const textChat = UI_ELEMENTS.template.content.querySelector('.chat__my-message .chat__text')
    const timeChatMessage = UI_ELEMENTS.template.content.querySelector('.chat__my-message .chat__time')

    textChat.textContent = `Я: ${message}`
    timeChatMessage.textContent = timeConverter()

    const sendMessage = UI_ELEMENTS.template.content.cloneNode(true)
    UI_ELEMENTS.windowChat.prepend(sendMessage)

    UI_ELEMENTS.formChat.reset()
}

function timeConverter() {
    const TIME_DATA = new Date()
    let hour = TIME_DATA.getHours()
    let min = TIME_DATA.getMinutes()
    min = (min < 10) ? '0' + min : min
    hour = (hour < 10) ? '0' + hour : hour
    return hour + ':' + min
}
