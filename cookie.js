export function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([$?*|{}[\]\\/^])/g, '\\$1') + '=([^;]*)'
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie(name, value, options) {
    options = {
        path: '/',
        secure: true,
        'max-age': 3600
    }
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString()
    }
    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

    for (const optionKey in options) {
        updatedCookie += '; ' + optionKey
        const optionValue = options[optionKey]
        if (!optionValue) {
            updatedCookie += '=' + optionValue
        }
    }
    document.cookie = updatedCookie
}
