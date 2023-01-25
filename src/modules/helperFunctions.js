export const iterateEventOverNodeList = (list, event, fn) => {
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener(event, fn);
    }
}

export const setAttributes = (element, attributes) => {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}