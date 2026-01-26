import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { KeyboardStructure } from "./keyboard-data-structure.js";

export const keyboard = new KeyboardStructure();

export const createKeys = (chars, langs) => {
  const buttons = document.createElement("button");

  if (langs.specialKeys[chars]) {
    buttons.className = langs.specialKeys[chars].class;
    buttons.setAttribute("aria-label", `${langs.specialKeys[chars].label}`);
    buttons.textContent = chars;
  } else if (/[0-9]/.test(chars)) {
    buttons.classList.add("keys");
    // Numbers  aria label
    buttons.setAttribute("aria-label", `Number ${chars}`);
    buttons.textContent = chars;
  } else if (langs === keyboard.keyboardStructure.fa) {
    buttons.setAttribute("data-lang", "fa");
    buttons.classList.add("keys");
    // Numbers  aria label
    buttons.setAttribute("aria-label", `Number ${chars}`);
    buttons.textContent = chars;
  } else if (langs === keyboard.keyboardStructure.en) {
    buttons.setAttribute("data-lang", "en");
    buttons.classList.add("keys");
    // Numbers  aria label
    buttons.setAttribute("aria-label", `Number ${chars}`);
    buttons.textContent = chars;
  } else {
    buttons.classList.add("keys");
    //letters aria label
    buttons.setAttribute("aria-label", `key ${chars}`);
    buttons.textContent = chars;
  }

  document
    .querySelectorAll(
      ".keyboard__row-0, .keyboard__row-1, .keyboard__row-2, .keyboard__row-3, .keyboard__row-4"
    )
    .forEach((each) => {
      each.appendChild(buttons);
    });
  return buttons;
};

export const createRows = (rows, index) => {
  const elements = getCachedElements();
  if (!elements && !rows)
    if (!elements) throw new Error("required DOM wasn't found");
  const rowElement = document.createElement("div");
  rowElement.classList.add(`keyboard__row-${index}`);
  elements.keyboardContainer.appendChild(rowElement);
};
