export function apiSend(URL, method, headers, body, func, onError, classError) {
    fetch(URL, {
        method: method,
        headers: headers,
        body: body
    })
    .then(response => {
        if (!response.ok) {
            classError.classList.add('error')
            throw new Error()
        }
        return response.json()
    })
    .then(func)
    .catch(() => {
        alert(onError)
    })
}

export function apiMessageUser(URL, headers, func) {
    fetch(URL, {
        method: 'GET',
        headers: headers,
    })
    .then(response => response.json())
    .then(func)
    .catch(alert)
}
