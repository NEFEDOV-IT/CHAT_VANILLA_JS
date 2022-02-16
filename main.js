// import {} from './view.js'
const formChat = document.querySelector('.chat__form')
const windowChat = document.querySelector('.chat__window')
const template = document.querySelector('.template')

formChat.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageChat = document.querySelector('.chat__form-input').value
    showMessage(messageChat)
})

function showMessage(message) {
    windowChat.prepend(template.content.cloneNode(true))
    windowChat.querySelector('.chat__text').textContent = `Я: ${message}`
    windowChat.querySelector('.chat__time').textContent = timeConverter(new Date())
    formChat.reset()
}

function timeConverter(data) {
    const TIME_DATA = new Date(data)
    let hour = TIME_DATA.getHours()
    let min = TIME_DATA.getMinutes()
    min = (min < 10) ? '0' + min : min
    hour = (hour < 10) ? '0' + hour : hour
    return hour + ':' + min
}
