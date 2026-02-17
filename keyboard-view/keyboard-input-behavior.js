import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import {
  virtualKeyboard,
  uiState,
} from "../keyboard-controler/keyboard-controler.js";
import {
  ensureCaret,
  deleteCharBeforeCaret,
  hasUserText,
} from "./keyboard-input-caret.js";

export const pressBackspace = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    uiState.pressStartTime = Date.now();
    uiState.backspaceClient.clientX = e.clientX;
    uiState.backspaceClient.clientY = e.clientY;
    uiState.isBackspacePressed = true;
    uiState.backSpaceTimer = setTimeout(() => {
      if (uiState.isBackspacePressed) startContinuousDelete();
    }, uiState.holdThreshold);
  }
};

export const releaseBackspace = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    uiState.isBackspacePressed = false;
    uiState.isBackspcaceHeld = false;
    clearInterval(uiState.deleteTimer);
    clearTimeout(uiState.backSpaceTimer);

    const pressDuration = Date.now() - uiState.pressStartTime;

    if (!uiState.isCancelled) {
      if (pressDuration < uiState.holdThreshold) deleteLastCharacterOfInput();
    }
  }
};

export const cancelPointer = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    if (uiState.isBackspacePressed) {
      clearInterval(uiState.deleteTimer);
      clearTimeout(uiState.backSpaceTimer);
    }
  }
};

export const moveBackspacePointer = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    const clientX = e.clientX - uiState.backspaceClient.clientX;
    const clientY = e.clientY - uiState.backspaceClient.clientY;

    if (Math.hypot(clientX, clientY) > 10) {
      clearTimeout(uiState.backSpaceTimer);
      clearInterval(uiState.deleteTimer);
    }
  }
};
const startContinuousDelete = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  uiState.isBackspcaceHeld = true;
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
  if (!hasUserText(input)) {
    input.dataset.hasPlaceholder = "true";
    input.classList.add("keyboard-section__task-input--caret");
    input.textContent = input.dataset.placeholder;
  }
};

export const clearPlaceholder = (input) => {
  if (input.dataset.hasPlaceholder === "true") {
    input.textContent = "";
    input.classList.add("keyboard-section__task-input--caret");
    delete input.dataset.hasPlaceholder;
  }
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
};

export const typeIntoInput = (event) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  clearPlaceholder(elements.inputElement);
  const input = elements.inputElement;
  input.classList.remove("keyboard-section__task-input--caret");
  const caret = ensureCaret(input);

  caret.insertAdjacentText("beforebegin", event.target.textContent);

  disableSubmitIfInputEmpty();
};
