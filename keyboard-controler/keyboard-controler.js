import { KeyboardApp } from "../keyboard-model/keyboard-model.js";
import {
  createRows,
  createKeys,
  updateKeysText,
} from "../keyboard-view/build-keyboard-ui.js";
import { ensurePlaceholder } from "../keyboard-view/keyboard-input-behavior.js";
import { loadDraftedInputText } from "../shared-components/save-drafted-text-input-to-local-storage.js";
import { ATTRIBUTES } from "../constants/keyboard-constants.js";
import { elements } from "../todos-controller.js/todos-controller.js";
import { keyboardUiState } from "../keyboard-view/keyboard-states/states.js";
import {
  registerDragAndDropListeners,
  registerKeyboardListeners,
  registerKeyboardPointerListeners,
} from "../keyboard-view/keyboard-listeners/keyboard-listeners.js";

export const virtualKeyboard = new KeyboardApp();

virtualKeyboard.subscribe(KeyboardApp.EVENTS.CLEAR_KEYBOARD, () => {
  const keyboard = (elements.keyboardContainer.textContent = "");
  return keyboard;
});
virtualKeyboard.subscribe(KeyboardApp.EVENTS.CREATE_ROWS, createRows);
virtualKeyboard.subscribe(KeyboardApp.EVENTS.CREATE_KEYS, createKeys);
virtualKeyboard.subscribe(KeyboardApp.EVENTS.UPDATE_KEYS, updateKeysText);
virtualKeyboard.loadNewKeyboardlayout();
virtualKeyboard.currentCapsLock();

const initApp = () => {
  ensurePlaceholder(elements.inputElement);

  registerDragAndDropListeners();
  registerKeyboardListeners();
  registerKeyboardPointerListeners();

  document.addEventListener("DOMContentLoaded", loadDraftedInputText);
};

initApp();
