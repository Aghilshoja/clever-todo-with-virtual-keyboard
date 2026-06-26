import {
  ATTRIBUTES,
  KEYBOARD_ACTIVE,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "./keyboard-caret-positioning.js";

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

  const caretState = virtualKeyboard.caretManeger;
  if (caretState.caretPosition === 0) return;

  caretState.text =
    caretState.text.slice(0, caretState.caretPosition - 1) +
    caretState.text.slice(caretState.caretPosition);

  caretState.caretPosition--;

  updateTextEditor(input, caret);
};
