import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { KeyboardStructure } from "./keyboard-data-structure.js";

export const keyboard = new KeyboardStructure();

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
