import {
  ATTRIBUTES,
  KEYBOARD_ACTIVE,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";

export const ensureCaret = (input) => {
  let caret = input.querySelector(`[${ATTRIBUTES.CARET}]`);

  if (!caret) {
    caret = document.createElement("span");
    caret.dataset[KEYBOARD_STATES.CARET] = KEYBOARD_ACTIVE.CARET;
    input.appendChild(caret);
  }
  return caret;
};

export const deleteCharBeforeCaret = (input) => {
  const caret = input.querySelector(`[${ATTRIBUTES.CARET}]`);
  if (!caret) return;

  let previousNode = caret.previousSibling;

  // Check if the previous node is a TEXT_NODE
  if (previousNode && previousNode.nodeType === Node.TEXT_NODE) {
    previousNode.textContent = previousNode.textContent.slice(0, -1);

    if (previousNode.textContent === "") previousNode.remove();
  }
};
