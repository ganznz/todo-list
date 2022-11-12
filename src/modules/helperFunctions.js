export const iterateEventOverNodeList = (list, event, fn) => {
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener(event, fn);
  }
}

const txInitialHeight = 50;
const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  (tx[i].value == 'Add a description for this task!') ? tx[i].setAttribute("style", `height: ${txInitialHeight}px; overflow-y:hidden`)
  : tx[i].setAttribute("style", `height: ${(tx[i].scrollHeight)}px; overflow-y:hidden;`)
  
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}