import { getCachedElements } from "../shared-components/get-cached-element.js";
import { uiState } from "../keyboard-controler/keyboard-controler.js";
import { ensureCaret, deleteCharBeforeCaret } from "./keyboard-input-caret.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";

import { disableOrEnableSaveBtn } from "../shared-components/handle-disabling-or-enabling-saving-task-edits.js";
export const pressBackspace = (e) => {
  if (e.target.closest(".keyboard__backspace-key")) {
    uiState.pressStartTime = Date.now();
    uiState.backspaceClient.clientX = e.clientX;
    uiState.backspaceClient.clientY = e.clientY;
    uiState.isBackspacePressed = true;
    uiState.backSpaceTimer = setTimeout(() => {
      if (uiState.isBackspacePressed) startContinuousDelete();
    }, uiState.holdThreshold);
  }
};

export const releaseBackspace = () => {
  clearInterval(uiState.deleteTimer);
  clearTimeout(uiState.backSpaceTimer);

  /* Exit early if pointer moved away: 
   isBackspacePressed is false when pointermove > 10px, so single deletion is skipped. 
   If still true, the finger hasn't moved, and single deletion can happen. */
  if (!uiState.isBackspacePressed) return;

  const pressDuration = Date.now() - uiState.pressStartTime;

  if (pressDuration < uiState.holdThreshold) deleteLastCharacterOfInput();
  uiState.isBackspacePressed = false;
};

export const cancelPointer = () => {
  if (!uiState.isBackspacePressed) return;
  clearInterval(uiState.deleteTimer);
  clearTimeout(uiState.backSpaceTimer);
  uiState.isBackspacePressed = false;
};

export const moveBackspacePointer = (e) => {
  if (!uiState.isBackspacePressed) return;
  const clientX = e.clientX - uiState.backspaceClient.clientX;
  const clientY = e.clientY - uiState.backspaceClient.clientY;

  if (Math.hypot(clientX, clientY) > 10) {
    clearTimeout(uiState.backSpaceTimer);
    clearInterval(uiState.deleteTimer);
    uiState.isBackspacePressed = false;
  }
};
const startContinuousDelete = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  const interval = 50;

  uiState.deleteTimer = setInterval(() => {
    if (!uiState.isBackspacePressed) {
      clearInterval(uiState.deleteTimer);
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

export const ensurePlaceholder = (input) => {
  if (
    appStateUi.activePlaceholder === "Description" &&
    input.textContent === ""
  ) {
    input.classList.add("keyboard-section__task-input--caret");
    input.textContent = input.dataset.description;
  }

  if (
    appStateUi.activePlaceholder === "Edit-your-task" &&
    input.textContent === ""
  ) {
    input.classList.add("keyboard-section__task-input--caret");
    input.textContent = input.dataset.editPlaceholder;
  }

  if (
    appStateUi.activePlaceholder === "Enter-a-task" &&
    input.textContent === ""
  ) {
    input.classList.add("keyboard-section__task-input--caret");
    input.textContent = input.dataset.placeholder;
  }
};

export const clearPlaceholder = (input) => {
  const isTherePlaceholder =
    input.textContent === "Description" ||
    input.textContent === "Edit your task" ||
    input.textContent === "Enter a task";

  if (isTherePlaceholder) input.textContent = "";
};

export const disableSubmitIfInputEmpty = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");

  elements.submitTask.disabled =
    elements.inputElement.textContent.trim() === "Enter a task";
};

const deleteLastCharacterOfInput = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");

  const input = elements.inputElement;
  deleteCharBeforeCaret(input);
  ensurePlaceholder(input);
  disableSubmitIfInputEmpty();
  disableOrEnableSaveBtn();
};

export const typeIntoInput = (event) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  const input = elements.inputElement;
  clearPlaceholder(input);
  input.classList.remove("keyboard-section__task-input--caret");
  const caret = ensureCaret(input);

  caret.insertAdjacentText("beforebegin", event.target.textContent);

  disableSubmitIfInputEmpty();
  disableOrEnableSaveBtn();
};
