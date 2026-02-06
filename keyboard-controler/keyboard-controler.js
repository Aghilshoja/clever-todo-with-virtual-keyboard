import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { KeyboardApp } from "../keyboard-model/keyboard-model.js";
import {
  createRows,
  createKeys,
  updateKeysText,
  typeIntoInput,
  ensurePlaceholder,
} from "../keyboard-view/build-keyboard-ui.js";
import { toggleKeyboard } from "../keyboard-view/toggle-keyboard.js";
import { closeKeyboard } from "../keyboard-view/closeKeyboardOnBodyClick.js";
import {
  renderKeyPreviewPopup,
  hideKeyPreview,
  updatePreviewOnPointerMove,
} from "../keyboard-view/keyboard-feedback-overlay.js";
import {
  handleKeyDrop,
  handledraggeingKey,
  handledragEnter,
  handledragLeave,
  handledragEnd,
} from "../keyboard-view/keyboard-key-reorder.js";
import { backspaceFunctionality } from "../keyboard-view/build-keyboard-ui.js";
export const virtualKeyboard = new KeyboardApp();

const elements = getCachedElements();

virtualKeyboard.subscribe(KeyboardApp.EVENTS.CLEAR_KEYBOARD, () => {
  if (!elements.keyboardContainer) return;
  const keyboard = (elements.keyboardContainer.textContent = "");
  return keyboard;
});
virtualKeyboard.subscribe(KeyboardApp.EVENTS.CREATE_ROWS, createRows);
virtualKeyboard.subscribe(KeyboardApp.EVENTS.CREATE_KEYS, createKeys);
virtualKeyboard.subscribe(KeyboardApp.EVENTS.UPDATE_KEYS, updateKeysText);
virtualKeyboard.loadNewKeyboardlayout();

const initApp = () => {
  if (!elements) throw new Error("required DOM wasn't found");

  ensurePlaceholder(elements.inputElement);
  elements.mainPageNewTask.addEventListener("click", toggleKeyboard);

  elements.keyboardContainer.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".keys")) {
      virtualKeyboard.currentPreviewKey = e.target;
      renderKeyPreviewPopup(e.target);

      virtualKeyboard.dragStartTimer = setTimeout(() => {
        virtualKeyboard.currentPreviewKey.draggable = true;
      }, 300);
    }
  });

  elements.keyboardContainer.addEventListener("pointerup", hideKeyPreview);

  elements.keyboardContainer.addEventListener(
    "pointermove",
    updatePreviewOnPointerMove,
  );

  elements.keyboardContainer.addEventListener("pointerleave", () => {
    if (virtualKeyboard.currentPreviewKey) {
      if (virtualKeyboard.previewFeedbackTimer) {
        clearTimeout(virtualKeyboard.previewFeedbackTimer);
        virtualKeyboard.previewFeedbackTimer = null;
      }
      hideKeyPreview();
      virtualKeyboard.currentPreviewKey = null;
    }
  });

  document.body.addEventListener("click", (e) => {
    if (
      e.target.closest(".main-page") &&
      !e.target.closest(".keyboard-section--active") &&
      !e.target.closest(".main-page__add-task") &&
      !e.target.closest(".main-page__new-task")
    )
      closeKeyboard();
  });

  elements.keyboardContainer.addEventListener("dragstart", handledraggeingKey);

  elements.keyboardContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  elements.keyboardContainer.addEventListener("dragenter", handledragEnter);
  elements.keyboardContainer.addEventListener("dragleave", handledragLeave);
  elements.keyboardContainer.addEventListener("dragend", handledragEnd);
  elements.keyboardContainer.addEventListener("drop", handleKeyDrop);

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("keyboard-input-container__english"))
      virtualKeyboard.setLang("fa");

    if (e.target.classList.contains("keyboard-input-container__persian"))
      virtualKeyboard.setLang("en");

    if (
      e.target.classList.contains("keyboard-input-container__symbol-switcher")
    )
      virtualKeyboard.setLang("symbols");

    if (
      e.target.classList.contains("keyboard-input-container__reverse-switcher")
    )
      virtualKeyboard.setLang("en");

    if (e.target.classList.contains("keyboard-input-container__arrow-key")) {
      e.target.classList.add("highlight-shift");
      virtualKeyboard.currentCapsLock();
    }

    if (e.target.closest(".keys")) {
      typeIntoInput(e);
      virtualKeyboard.onKeyPressed();
    }

    if (e.target.classList.contains("keyboard-input-container__delete-key")) {
      backspaceFunctionality();
    }
  });
};

initApp();
