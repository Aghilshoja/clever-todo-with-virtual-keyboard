import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";

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
  const interval = 1000 / 15;

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
  if (!input.textContent.trim()) {
    input.textContent = input.dataset.placeholder || "";
  }
};

const clearPlaceholder = (inputElement) => {
  if (!inputElement) throw new Error("Oops! element not found");

  if (inputElement.textContent.trim() === inputElement.dataset.placeholder) {
    inputElement.textContent = "";
  }
};

const disableSubmitIfInputEmpty = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");

  elements.submitTask.disabled =
    elements.inputElement.textContent.trim() === "Enter a task";
};

const deleteLastCharacterOfInput = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  clearPlaceholder(elements.inputElement);
  elements.inputElement.textContent = elements.inputElement.textContent.slice(
    0,
    -1,
  );

  if (!elements.inputElement.textContent.trim()) {
    ensurePlaceholder(elements.inputElement);
  }

  disableSubmitIfInputEmpty();
};

export const typeIntoInput = (event) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");
  clearPlaceholder(elements.inputElement);
  elements.inputElement.textContent += event.target.textContent;
  disableSubmitIfInputEmpty();
};
