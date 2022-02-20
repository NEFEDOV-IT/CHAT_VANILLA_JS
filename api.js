export function apiSend(URL, method, headers, body, onError) {
    fetch(URL, {
        method: method,
        headers: headers,
        body: body
    })
    .then(response => response.json())
    .catch(() => alert(onError))
}

