import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { KeyboardStructure } from "./keyboard-data-structure.js";

export const keyboard = new KeyboardStructure();

export const ensurePlaceholder = (input) => {
  if (!input.textContent.trim()) {
    input.textContent = input.dataset.placeholder || "";
  }
};

const clearPlaceholder = (inputElement) => {
  if (!inputElement) return;

  if (inputElement.textContent.trim() === inputElement.dataset.placeholder) {
    inputElement.textContent = "";
  }
};

const disableSubmitIfInputEmpty = () => {
  const elements = getCachedElements();
  if (!elements) return;

  elements.submitTask.disabled =
    elements.inputElement.textContent.trim() === "Enter a task";
};

export const backspaceFunctionality = () => {
  const elements = getCachedElements();
  if (!elements) return;
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
  if (!elements) return;
  clearPlaceholder(elements.inputElement);
  elements.inputElement.textContent += event.target.textContent;
  disableSubmitIfInputEmpty();
};

export const createKeys = (chars, langs, colIndex, rowIndex) => {
  const buttons = document.createElement("button");

  if (langs.specialKeys[chars]) {
    buttons.className = langs.specialKeys[chars].class;
    buttons.setAttribute("aria-label", `${langs.specialKeys[chars].label}`);
    buttons.textContent = chars;
  } else if (/[0-9]/.test(chars)) {
    buttons.classList.add("keys");
    // Numbers  aria label
    buttons.setAttribute("aria-label", `Number ${chars}`);
    buttons.setAttribute("data-col", `${colIndex}`);
    buttons.setAttribute("data-row", `${rowIndex}`);
    buttons.textContent = chars;
  } else if (langs === keyboard.keyboardStructure.fa) {
    buttons.setAttribute("data-lang", "fa");
    buttons.classList.add("keys");
    // Numbers  aria label
    buttons.setAttribute("aria-label", `Number ${chars}`);
    buttons.setAttribute("data-col", `${colIndex}`);
    buttons.setAttribute("data-row", `${rowIndex}`);
    buttons.setAttribute("aria-label", `key ${chars}`);
    buttons.textContent = chars;
  } else if (langs === keyboard.keyboardStructure.en) {
    buttons.setAttribute("data-lang", "en");
    buttons.classList.add("keys");
    // Numbers  aria label
    buttons.setAttribute("aria-label", `Number ${chars}`);
    buttons.setAttribute("data-col", `${colIndex}`);
    buttons.setAttribute("data-row", `${rowIndex}`);
    buttons.setAttribute("aria-label", `key ${chars}`);
    buttons.textContent = chars;
  } else {
    buttons.setAttribute("data-col", `${colIndex}`);
    buttons.setAttribute("data-row", `${rowIndex}`);
    buttons.setAttribute("aria-label", `key ${chars}`);
    buttons.classList.add("keys");
    buttons.textContent = chars;
    buttons.setAttribute("data-base", `${chars}`);
  }

  const keysParent = document.querySelector(`.keyboard__row-${rowIndex}`);
  if (!keysParent) return;
  keysParent.appendChild(buttons);
  return buttons;
};

export const createRows = (rowIndex) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  const rowElement = document.createElement("div");
  rowElement.classList.add(`keyboard__row-${rowIndex}`);
  rowElement.setAttribute("data-col", `${rowIndex}`);
  elements.keyboardContainer.appendChild(rowElement);
};

export const updateKeysText = (capsLock) => {
  const keys = document.querySelectorAll(".keys");
  if (!keys) return;

  const shiftKey = document.querySelector(
    ".keyboard-input-container__arrow-key",
  );
  if (!shiftKey) return;

  if (capsLock === "lowercase") shiftKey.classList.remove("highlight-shift");
  else shiftKey.classList.add("highlight-shift");

  keys.forEach((key) => {
    const keyText = key.dataset.base || key.textContent;

    if (!/^[a-zA-Z]$/.test(keyText)) return keyText;
    key.textContent =
      capsLock === "lowercase" ? keyText.toLowerCase() : keyText.toUpperCase();
  });
};
