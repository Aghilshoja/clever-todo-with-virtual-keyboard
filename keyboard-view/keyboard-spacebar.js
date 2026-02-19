import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { ensureCaret } from "./keyboard-input-caret.js";
import { disableSubmitIfInputEmpty } from "./keyboard-input-behavior.js";
import { clearPlaceholder } from "./keyboard-input-behavior.js";

export const handleSpaceBar = (e) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  if (e.target.classList.contains("keyboard__spacebar")) {
    const input = elements.inputElement;
    const caret = ensureCaret(input);
    caret.before(document.createTextNode(" "));
    input.classList.remove("keyboard-section__task-input--caret");
    clearPlaceholder(input);
    disableSubmitIfInputEmpty();
  }
};
