function popupClose() {
    const popupClose = document.querySelectorAll('.popup__close')
    popupClose.forEach(item => {
        item.addEventListener('click', () => {
            item.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove('open')
        })
    })
}

function closePopupEsc() {
    const popupActive = document.querySelector('.popup.open')

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            popupActive.classList.remove('open')
        }
    })
}

export { popupClose, closePopupEsc }
