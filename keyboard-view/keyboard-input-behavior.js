import { getCachedElements } from "../shared-components/get-cached-element.js";
import { ensureCaret, deleteCharBeforeCaret } from "./keyboard-input-caret.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { handleTaskCharacterLimit } from "../shared-components/handle-task-character-limit.js";
import { disableOrEnableSaveBtn } from "../shared-components/handle-disabling-or-enabling-saving-task-edits.js";
import { saveInputText } from "../shared-components/save-drafted-text-input-to-local-storage.js";
import {
  keyboardUiState,
  virtualKeyboard,
} from "../keyboard-controler/keyboard-controler.js";
import {
  PLACEHOLDERS,
  ATTRIBUTES,
  KEYBOARD_ACTIONS,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";

export const pressBackspace = (e) => {
  if (e.target.closest(`[${KEYBOARD_ACTIONS.BACKSPACE}]`)) {
    keyboardUiState.pressStartTime = Date.now();
    keyboardUiState.backspaceClient.clientX = e.clientX;
    keyboardUiState.backspaceClient.clientY = e.clientY;
    keyboardUiState.isBackspacePressed = true;
    keyboardUiState.backSpaceTimer = setTimeout(() => {
      if (keyboardUiState.isBackspacePressed) startContinuousDelete();
    }, keyboardUiState.holdThreshold);
  }
};

export const releaseBackspace = () => {
  clearInterval(keyboardUiState.deleteTimer);
  clearTimeout(keyboardUiState.backSpaceTimer);

  /* Exit early if pointer moved away: 
   isBackspacePressed is false when pointermove > 10px, so single deletion is skipped. 
   If still true, the finger hasn't moved, and single deletion can happen. */
  if (!keyboardUiState.isBackspacePressed) return;

  const pressDuration = Date.now() - keyboardUiState.pressStartTime;

  if (pressDuration < keyboardUiState.holdThreshold)
    deleteLastCharacterOfInput();
  keyboardUiState.isBackspacePressed = false;
};

export const cancelPointer = () => {
  if (!keyboardUiState.isBackspacePressed) return;
  clearInterval(keyboardUiState.deleteTimer);
  clearTimeout(keyboardUiState.backSpaceTimer);
  keyboardUiState.isBackspacePressed = false;
};

export const moveBackspacePointer = (e) => {
  if (!keyboardUiState.isBackspacePressed) return;
  const clientX = e.clientX - keyboardUiState.backspaceClient.clientX;
  const clientY = e.clientY - keyboardUiState.backspaceClient.clientY;

  if (Math.hypot(clientX, clientY) > 10) {
    clearTimeout(keyboardUiState.backSpaceTimer);
    clearInterval(keyboardUiState.deleteTimer);
    keyboardUiState.isBackspacePressed = false;
  }
};
const startContinuousDelete = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  const interval = 50;

  keyboardUiState.deleteTimer = setInterval(() => {
    if (!keyboardUiState.isBackspacePressed) {
      clearInterval(keyboardUiState.deleteTimer);
      return;
    }

    // Delete in chunks for faster deletion
    for (let i = 0; i < 1; i++) {
      if (elements.inputElement.textContent.length > 0) {
        deleteLastCharacterOfInput();
      }
    }
  }, interval);
};

const addCaretToInput = (input) => {
  input.dataset[KEYBOARD_STATES.INPUT_CARET] = "";
};

export const ensurePlaceholder = (input) => {
  if (
    keyboardUiState.activePlaceholder === PLACEHOLDERS.DESCRIPTION &&
    input.textContent === ""
  ) {
    addCaretToInput(input);
    input.textContent = input.dataset.description;
  }

  if (
    keyboardUiState.activePlaceholder === PLACEHOLDERS.EDIT_TASK &&
    input.textContent === ""
  ) {
    addCaretToInput(input);
    input.textContent = input.dataset.editPlaceholder;
  }

  if (
    keyboardUiState.activePlaceholder === PLACEHOLDERS.ENTER_TASK &&
    input.textContent === ""
  ) {
    addCaretToInput(input);
    input.textContent = input.dataset.placeholder;
  }
};

export const clearPlaceholder = (input) => {
  const isTherePlaceholder =
    input.textContent === PLACEHOLDERS.DESCRIPTION ||
    input.textContent === PLACEHOLDERS.EDIT_TASK ||
    input.textContent === PLACEHOLDERS.ENTER_TASK;

  if (isTherePlaceholder) input.textContent = "";
};

export const disableSubmitIfInputEmpty = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");

  elements.submitTask.disabled =
    elements.inputElement.textContent.trim() === PLACEHOLDERS.ENTER_TASK;
};

const deleteLastCharacterOfInput = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");

  const input = elements.inputElement;
  deleteCharBeforeCaret(input);
  ensurePlaceholder(input);
  disableOrEnableSaveBtn();
  saveInputText();
  disableSubmitIfInputEmpty();
  handleTaskCharacterLimit();
};

export const insertText = (input, char, caret) => {
  const caretState = virtualKeyboard.caretManeger;
  const textBeforeCaret = caretState.text.slice(0, caretState.caretPosition);
  const textAfterCaret = caretState.text.slice(caretState.caretPosition);

  caretState.text = textBeforeCaret + char + textAfterCaret;

  caretState.caretPosition += char.length;

  const before = document.createTextNode(
    caretState.text.slice(0, caretState.caretPosition),
  );

  const after = document.createTextNode(
    caretState.text.slice(caretState.caretPosition),
  );

  input.replaceChildren(before, caret, after);
};

export const typeIntoInput = (event) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  const input = elements.inputElement;
  if (!input) return;

  delete input.dataset[KEYBOARD_STATES.INPUT_CARET];

  clearPlaceholder(input);

  const caret = ensureCaret(input);

  const char = event.target.textContent;

  insertText(input, char, caret);

  disableSubmitIfInputEmpty();
  disableOrEnableSaveBtn();
  handleTaskCharacterLimit();
  saveInputText();
};
