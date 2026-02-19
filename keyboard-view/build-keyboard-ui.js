import { getCachedElements } from "../cached-elements/get-cached-elements.js";

export const createKeys = (chars, langs, colIndex, rowIndex, activeLang) => {
  const button = document.createElement("button");

  const isSpecial = langs.specialKeys?.[chars];
  const isNumber = /[0-9]/.test(chars) || /[۰-۹]/.test(chars);

  if (isSpecial) {
    button.classList.add(`${isSpecial.class}`);
    button.setAttribute("aria-label", isSpecial.label);
    if (isSpecial.icon) {
      const icon = document.createElement("i");
      icon.className = isSpecial.icon;
      button.appendChild(icon);
    } else button.textContent = chars;
  } else {
    button.classList.add("keyboard__key");
    button.dataset.lang = activeLang;
    button.dataset.col = colIndex;
    button.dataset.row = rowIndex;
    button.textContent = chars;
    button.setAttribute(
      "aria-label",
      isNumber ? `Number ${chars}` : `Key ${chars}`,
    );

    if (!isNumber) button.dataset.base = chars;
  }

  const keysParent = document.querySelector(`.keyboard__row-${rowIndex}`);
  if (!keysParent) return;
  keysParent.appendChild(button);
  return button;
};

export const createRows = (rowIndex) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  const rowElement = document.createElement("div");
  rowElement.classList.add(`keyboard__row-${rowIndex}`);
  rowElement.dataset.col = rowIndex;
  elements.keyboardContainer.appendChild(rowElement);
};

export const updateKeysText = (capsLock) => {
  const keys = document.querySelectorAll(".keyboard__key");
  if (!keys) return;

  const shiftKey = document.querySelector(".keyboard__shift-key");
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
