import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import {
  ensureCaret,
  deleteCharBeforeCaret,
  hasUserText,
} from "./keyboard-input-caret.js";

export const pressBackspace = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    virtualKeyboard.pressStartTime = Date.now();
    virtualKeyboard.backspaceClient.clientX = e.clientX;
    virtualKeyboard.backspaceClient.clientY = e.clientY;
    virtualKeyboard.isBackspacePressed = true;
    virtualKeyboard.backSpaceTimer = setTimeout(() => {
      if (virtualKeyboard.isBackspacePressed) startContinuousDelete();
    }, virtualKeyboard.holdThreshold);
  }
};

export const releaseBackspace = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    virtualKeyboard.isBackspacePressed = false;
    virtualKeyboard.isBackspcaceHeld = false;
    clearInterval(virtualKeyboard.deleteTimer);
    clearTimeout(virtualKeyboard.backSpaceTimer);

    const pressDuration = Date.now() - virtualKeyboard.pressStartTime;

    if (!virtualKeyboard.isCancelled) {
      if (pressDuration < virtualKeyboard.holdThreshold)
        deleteLastCharacterOfInput();
    }
  }
};

export const cancelPointer = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    if (virtualKeyboard.isBackspacePressed) {
      clearInterval(virtualKeyboard.deleteTimer);
      clearTimeout(virtualKeyboard.backSpaceTimer);
    }
  }
};

export const moveBackspacePointer = (e) => {
  if (e.target.classList.contains("keyboard-input-container__delete-key")) {
    const clientX = e.clientX - virtualKeyboard.backspaceClient.clientX;
    const clientY = e.clientY - virtualKeyboard.backspaceClient.clientY;

    if (Math.hypot(clientX, clientY) > 10) {
      clearTimeout(virtualKeyboard.backSpaceTimer);
      clearInterval(virtualKeyboard.deleteTimer);
    }
  }
};
const startContinuousDelete = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  virtualKeyboard.isBackspcaceHeld = true;
  const interval = 50;

  virtualKeyboard.deleteTimer = setInterval(() => {
    if (!virtualKeyboard.isBackspacePressed) {
      clearInterval(virtualKeyboard.deleteTimer);
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
