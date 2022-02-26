function setLocalStorage(name, value) {
    return localStorage.setItem(name, JSON.stringify(value))
}

function getLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name))
}

export { setLocalStorage, getLocalStorage }
