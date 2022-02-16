import {UI_ELEMENTS} from './view.js'
import { popup } from './popup.js'

UI_ELEMENTS.formChat.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageChat = document.querySelector('.chat__form-input').value
    showMessage(messageChat)
})

function showMessage(message) {
    UI_ELEMENTS.windowChat.prepend(UI_ELEMENTS.template.content.cloneNode(true))
    UI_ELEMENTS.windowChat.querySelector('.chat__text').textContent = `Я: ${message}`
    UI_ELEMENTS.windowChat.querySelector('.chat__time').textContent = timeConverter(new Date())
    UI_ELEMENTS.formChat.reset()
}

function timeConverter(data) {
    const TIME_DATA = new Date(data)
    let hour = TIME_DATA.getHours()
    let min = TIME_DATA.getMinutes()
    min = (min < 10) ? '0' + min : min
    hour = (hour < 10) ? '0' + hour : hour
    return hour + ':' + min
}

popup()
