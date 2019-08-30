export function setLocalStorage(itemName, value) {
    localStorage.setItem(itemName, JSON.stringify(value))
}

export function getLocalStorage(itemName) {
    return JSON.parse(''+ localStorage.getItem(itemName) +'')
}