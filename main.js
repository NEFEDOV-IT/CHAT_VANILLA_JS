import { UI_ELEMENTS, API } from './view.js'
import { popup } from './popup.js'

const state = {
    ERROR_EMAIL: 'Введите корректный e-mail',
    ERROR_DATA: 'Запрос не удался, попробуйте ещё раз',
    ERROR_KEY: 'Введите корректный ключ',
}

let token

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

function sendEmail(mailAddress) {
    const isValid = UI_ELEMENTS.authorizationInput.classList.contains('error')
    const json = JSON.stringify({email: mailAddress})

    if (isValid) {
        UI_ELEMENTS.authorizationForm.reset()
        UI_ELEMENTS.authorizationInput.classList.remove('error')
    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST", API.URL)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onerror = function() {
        alert(state.ERROR_DATA)
    }

    xhr.send(json)

    xhr.onload = verification

    // fetch(API.URL, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json;',
    //     },
    //     body: json
    // })
    // .then(response => response.json())
    // .then(verification)
    // .catch(() => alert(state.ERROR_DATA))
}

function verification() {
    UI_ELEMENTS.authorizationForm.reset()
    UI_ELEMENTS.authorization.classList.remove('open')
    UI_ELEMENTS.verification.classList.add('open')
}

UI_ELEMENTS.verificationButton.addEventListener('click', () => {
    token = document.cookie = UI_ELEMENTS.verificationInput.value
    sendVerificationKey(token)
})

function sendVerificationKey(token) {
    const isValid = UI_ELEMENTS.verificationInput.classList.contains('error')

    if (isValid) {
        UI_ELEMENTS.verificationInput.reset()
        UI_ELEMENTS.verificationInput.classList.remove('error')
    }

    let xhr = new XMLHttpRequest();

    xhr.open("PATH", API.URL)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.onerror = function() {
        alert(state.ERROR_KEY)
    }

    xhr.send()

    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert( 'Ошибка: ' + xhr.status);
            return
        }
        UI_ELEMENTS.verification.classList.remove('open')
        UI_ELEMENTS.nickNameFormChat.classList.add('open')
    }

    // fetch(API.URL, {
    //     method: 'PATH',
    //     headers: {
    //         'Accept': 'application/json;',
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({'name': 'nick'})
    // })
    // .then(response => response.json())
    // .then(() => {
    //     UI_ELEMENTS.verification.classList.remove('open')
    //     UI_ELEMENTS.nickNameFormChat.classList.add('open')
    // })
    // .catch(() => {
    //     token = ''
    //     UI_ELEMENTS.verificationInput.classList.add('error')
    //     alert(state.ERROR_KEY)
    // })
}

UI_ELEMENTS.nickNameButton.addEventListener('click', () => {
    const nickName = UI_ELEMENTS.nickNameInput.value
    sendNickName(nickName, token)
})

function sendNickName(nickName, token) {
    const isValid = UI_ELEMENTS.nickNameInput.classList.contains('error')

    if (isValid) {
        UI_ELEMENTS.nickNameInput.reset()
        UI_ELEMENTS.nickNameInput.classList.remove('error')
    }

    let xhr = new XMLHttpRequest();

    xhr.open("PATH", API.URL)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.onerror = function() {
        alert('ПЕЧАЛЬ/БЕДА')
    }

    xhr.send(JSON.stringify({ name: nickName }))

    xhr.onload(() => {
        alert('ВСЕ ПОЛУЧИЛОСЬ!')
        UI_ELEMENTS.nickNameFormChat.classList.remove('open')
    })

    // fetch(API.URL, {
    //     method: 'PATH',
    //     headers: {
    //         'Accept': 'application/json;',
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({ 'name': nickName })
    // })
    // .then(response => response.json())
    // .catch(() => {
    //     UI_ELEMENTS.nickNameInput.classList.add('error')
    //     alert(state.ERROR_DATA)
    // })
}
