import { getCachedElements } from "../shared-components/get-cached-element.js";
import { KeyboardApp } from "../keyboard-model/keyboard-model.js";
import {
  createRows,
  createKeys,
  updateKeysText,
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
import {
  typeIntoInput,
  moveBackspacePointer,
  ensurePlaceholder,
  pressBackspace,
  releaseBackspace,
  cancelPointer,
} from "../keyboard-view/keyboard-input-behavior.js";
import { handleSpaceBar } from "../keyboard-view/keyboard-spacebar.js";
import { positionCaret } from "../keyboard-view/keyboard-caret-positioning.js";

export const virtualKeyboard = new KeyboardApp();

export const uiState = {
  currentPreviewKey: null,
  clients: { clientX: null, clientY: null },
  previewFeedbackTimer: null,
  dragStartTimer: null,
  currentPreviewKey: null,
  activelayout: null,
  deleteTimer: null,
  isBackspacePressed: false,
  backSpaceTimer: null,
  backspaceClient: { clientX: null, clientY: null },
  holdThreshold: 800,
  pressStartTime: 0,
  indexs: {
    rowIndex: null,
    btnIndex: null,
  },
};

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
    if (e.target.closest(".keyboard__key")) {
      uiState.currentPreviewKey = e.target;
      renderKeyPreviewPopup(e.target);

      uiState.dragStartTimer = setTimeout(() => {
        uiState.currentPreviewKey.draggable = true;
      }, 300);
    }
  });

  elements.keyboardContainer.addEventListener("pointerup", hideKeyPreview);

  elements.keyboardContainer.addEventListener(
    "pointermove",
    updatePreviewOnPointerMove,
  );

  elements.keyboardContainer.addEventListener("pointerleave", () => {
    if (uiState.currentPreviewKey) {
      if (uiState.previewFeedbackTimer) {
        clearTimeout(uiState.previewFeedbackTimer);
        uiState.previewFeedbackTimer = null;
      }
      hideKeyPreview();
      uiState.currentPreviewKey = null;
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
    if (e.target.classList.contains("keyboard__english-layout"))
      virtualKeyboard.setLang("fa");

    if (e.target.classList.contains("keyboard__persian-layout"))
      virtualKeyboard.setLang("en");

    if (e.target.classList.contains("keyboard__symbol-switcher"))
      virtualKeyboard.setLang("symbols");

    if (e.target.classList.contains("keyboard__reverse-switcher"))
      virtualKeyboard.setLang("en");

    if (e.target.closest(".keyboard__shift-key")) {
      virtualKeyboard.currentCapsLock();
    }

    if (e.target.closest(".keyboard__key")) {
      typeIntoInput(e);
      virtualKeyboard.onKeyPressed();
    }

    if (e.target.classList.contains("keyboard-section__task-input")) {
      positionCaret(e);
    }
  });

  elements.keyboardContainer.addEventListener("pointerdown", pressBackspace);
  elements.keyboardContainer.addEventListener("pointerup", releaseBackspace);
  elements.keyboardContainer.addEventListener("pointercancel", cancelPointer);
  elements.keyboardContainer.addEventListener(
    "pointermove",
    moveBackspacePointer,
  );

  elements.keyboardContainer.addEventListener("click", handleSpaceBar);
};

initApp();
