import { UI_ELEMENTS, API } from './view.js'
import { popup } from './popup.js'

const state = {
    ERROR_EMAIL: 'Введите корректный e-mail',
    ERROR_DATA: "Запрос не удался",
}

popup()

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

UI_ELEMENTS.verificationButton.addEventListener('click', () => {
    UI_ELEMENTS.verification.classList.remove('open')
})

function sendEmail(mailAddress) {
    const isValid = UI_ELEMENTS.authorizationInput.classList.contains('error')
    const json = JSON.stringify({email: mailAddress})

    if (isValid) {
        UI_ELEMENTS.authorizationForm.reset()
        UI_ELEMENTS.authorizationInput.classList.remove('error')
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', API.URL)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    xhr.send(json)

    xhr.onload = function () {
        if (xhr.status !== 200) {
            alert(`Ошибка ${xhr.status}`)
        }

        UI_ELEMENTS.authorizationForm.reset()
        UI_ELEMENTS.authorization.classList.remove('open')
        UI_ELEMENTS.verification.classList.add('open')
        alert(`Готово, получили ${xhr.response.length} байт`)
    }

    xhr.onerror = function () {
        alert(state.ERROR_DATA)
    }
}
