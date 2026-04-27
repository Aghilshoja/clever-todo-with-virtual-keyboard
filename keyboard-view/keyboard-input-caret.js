export const ensureCaret = (input) => {
  let caret = input.querySelector(".caret");

  if (!caret) {
    caret = document.createElement("span");
    caret.classList.add("caret");
    input.appendChild(caret);
  }
  return caret;
};

export const deleteCharBeforeCaret = (input) => {
  const caret = input.querySelector(".caret");
  if (!caret) return;

  let previousNode = caret.previousSibling;

  // Check if the previous node is a TEXT_NODE
  if (previousNode && previousNode.nodeType === Node.TEXT_NODE) {
    previousNode.textContent = previousNode.textContent.slice(0, -1);

    if (previousNode.textContent === "") {
      previousNode.remove();
    }
  }
  // NEW: Check if the previous node is an ELEMENT_NODE then remove it
  else if (previousNode && previousNode.nodeType === Node.ELEMENT_NODE)
    previousNode.remove();
};
