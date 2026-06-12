import { getCachedElements } from "./get-cached-element.js";
import { ensureCaret } from "../keyboard-view/keyboard-input-caret.js";
import { clearPlaceholder } from "../keyboard-view/keyboard-input-behavior.js";
import { disableSubmitIfInputEmpty } from "../keyboard-view/keyboard-input-behavior.js";
import { ATTRIBUTES } from "../constants/keyboard-constants.js";

const elements = getCachedElements();

export const saveInputText = () => {
  let input = elements.inputElement;
  localStorage.setItem("save-drafted-text", input.textContent);
};

export const loadDraftedInputText = () => {
  const input = elements.inputElement;
  if (!input) return;
  const loadedDraftedText = localStorage.getItem("save-drafted-text");
  if (loadedDraftedText !== "Enter a task") {
    clearPlaceholder(input);
    delete input.dataset[ATTRIBUTES.INPUT_CARET];
    const caret = ensureCaret(input);
    caret.insertAdjacentText("beforebegin", loadedDraftedText);
    disableSubmitIfInputEmpty();
  } else {
    input.dataset[ATTRIBUTES.INPUT_CARET] = "";
  }
};
