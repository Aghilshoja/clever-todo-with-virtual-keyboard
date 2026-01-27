import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { KeyboardApp } from "../keyboard-model/keyboard-model.js";
import {
  createRows,
  createKeys,
  keyboard,
} from "../keyboard-view/build-keyboard-ui.js";
import { toggleKeyboard } from "../keyboard-view/toggle-keyboard.js";
import { closeKeyboard } from "../keyboard-view/closeKeyboardOnBodyClick.js";
import {
  renderKeyPreviewPopup,
  hideKeyPreview,
  updatePreviewOnPointerMove,
} from "../keyboard-view/keyboard-feedback-overlay.js";

export const virtualKeyboard = new KeyboardApp();

virtualKeyboard.subscribe(KeyboardApp.EVENTS.CREATE_ROWS, createRows);
virtualKeyboard.subscribe(KeyboardApp.EVENTS.CREATE_KEYS, createKeys);
virtualKeyboard.toggleLanguageLayout(keyboard.keyboardStructure.en);

const initApp = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");

  elements.mainPageNewTask.addEventListener("click", toggleKeyboard);
  elements.keyboardContainer.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".keys")) {
      virtualKeyboard.currentPreviewKey = e.target;
      renderKeyPreviewPopup(e.target);
    }
  });

  elements.keyboardContainer.addEventListener("pointerup", hideKeyPreview);

  elements.keyboardContainer.addEventListener(
    "pointermove",
    updatePreviewOnPointerMove
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
};

initApp();
