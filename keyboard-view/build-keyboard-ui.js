import { getCachedElements } from "../shared-components/get-cached-element.js";
import {
  KEYBOARD_ACTIONS,
  ATTRIBUTES,
  KEYBOARD_STATES,
  KEYBOARD_INACTIVE,
  KEYBOARD_ACTIVE,
} from "../constants/keyboard-constants.js";
export const createKeys = (chars, langs, colIndex, rowIndex, activeLang) => {
  const button = document.createElement("button");

  const isSpecial = langs.specialKeys?.[chars];
  const isNumber = /[0-9]/.test(chars) || /[۰-۹]/.test(chars);

  if (isSpecial) {
    button.className = `${isSpecial.class} hover-affect active-affect keys-layout kb-btn-reset`;
    button.setAttribute("aria-label", isSpecial.label);
    button.dataset.action = isSpecial.dataAction;
    if (isSpecial.icon) {
      const icon = document.createElement("i");
      icon.className = isSpecial.icon;
      button.appendChild(icon);
    } else button.textContent = chars;
  } else {
    button.className =
      "keyboard__key hover-affect active-affect keys-layout kb-btn-reset";

    button.dataset.lang = activeLang;
    button.dataset.col = colIndex;
    button.dataset.row = rowIndex;
    button.dataset.keyType = "regular";
    button.textContent = chars;
    button.setAttribute(
      "aria-label",
      isNumber ? `Number ${chars}` : `Key ${chars}`,
    );

    if (!isNumber) button.dataset.base = chars;
  }

  const keysParent = document.querySelector(
    `[data-keyboard-row='${rowIndex}']`,
  );
  if (!keysParent) return;
  keysParent.appendChild(button);
  return button;
};

export const createRows = (rowIndex) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  const rowElement = document.createElement("div");
  rowElement.className = `keyboard__row-${rowIndex} kb-flex`;
  rowElement.dataset.col = rowIndex;
  rowElement.dataset.keyboardRow = rowIndex;
  elements.keyboardContainer.appendChild(rowElement);
};

export const updateKeysText = (capsLock, CAPS_LOCK_STATES) => {
  const keys = document.querySelectorAll(`[${ATTRIBUTES.REGULAR_KEY}]`);
  if (!keys) return;

  const shiftKey = document.querySelector(`[${KEYBOARD_ACTIONS.SHIFT_KEY}]`);
  if (!shiftKey) return;

  if (capsLock === CAPS_LOCK_STATES.LOWERCASE)
    shiftKey.dataset[KEYBOARD_STATES.SHIFT_KEY_STATE] =
      KEYBOARD_INACTIVE.SHIFT_KEY;
  else
    shiftKey.dataset[KEYBOARD_STATES.SHIFT_KEY_STATE] =
      KEYBOARD_ACTIVE.SHIFT_KEY;

  keys.forEach((key) => {
    const keyText = key.dataset.base || key.textContent;

    if (!/^[a-zA-Z]$/.test(keyText)) return keyText;
    key.textContent =
      capsLock === CAPS_LOCK_STATES.LOWERCASE
        ? keyText.toLowerCase()
        : keyText.toUpperCase();
  });
};
