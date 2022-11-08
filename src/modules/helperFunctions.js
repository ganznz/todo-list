export const iterateEventOverNodeList = (list, event, fn) => {
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener(event, fn);
  }
}