import { getCachedElements } from "./get-cached-element.js";
import { ensureCaret } from "../keyboard-view/keyboard-input-caret.js";
import { clearPlaceholder } from "../keyboard-view/keyboard-input-behavior.js";
import { disableSubmitIfInputEmpty } from "../keyboard-view/keyboard-input-behavior.js";
import {
  ATTRIBUTES,
  KEYBOARD_STATES,
  PLACEHOLDERS,
} from "../constants/keyboard-constants.js";

const elements = getCachedElements();

export const clearEditSessionState = () => {
  localStorage.removeItem("app-state");
  localStorage.removeItem("new-task-draft");
};

export const saveInputText = () => {
  let input = elements.inputElement;
  localStorage.setItem("save-drafted-text", input.textContent);
};

const loadDraft = (input, draft) => {
  clearPlaceholder(input);
  delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
  const caret = ensureCaret(input);
  caret.insertAdjacentText("beforebegin", draft);
  disableSubmitIfInputEmpty();
};

export const loadDraftedInputText = () => {
  const input = elements.inputElement;
  if (!input) return;
  const loadedDraftedText = localStorage.getItem("save-drafted-text");
  const appState = localStorage.getItem("app-state");
  const draftedTask = localStorage.getItem("new-task-draft");
  if (appState) {
    loadDraft(input, draftedTask);
    clearEditSessionState();
  } else if (loadedDraftedText && loadedDraftedText !== PLACEHOLDERS.ENTER_TASK)
    loadDraft(input, loadedDraftedText);
  else input.dataset[ATTRIBUTES.INPUT_CARET] = "";
};
