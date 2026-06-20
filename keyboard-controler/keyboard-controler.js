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
import {
  saveInputText,
  loadDraftedInputText,
} from "../shared-components/save-drafted-text-input-to-local-storage.js";
import {
  KEYBOARD_ACTIONS,
  ATTRIBUTES,
  PLACEHOLDERS,
} from "../constants/keyboard-constants.js";
export const virtualKeyboard = new KeyboardApp();

export const keyboardUiState = {
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
  activePlaceholder: PLACEHOLDERS.ENTER_TASK,
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
virtualKeyboard.currentCapsLock();

const initApp = () => {
  if (!elements) throw new Error("required DOM wasn't found");

  ensurePlaceholder(elements.inputElement);
  elements.mainPageNewTask.addEventListener("click", toggleKeyboard);

  elements.keyboardContainer.addEventListener("pointerdown", (e) => {
    if (e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`)) {
      keyboardUiState.currentPreviewKey = e.target;
      renderKeyPreviewPopup(e.target);

      keyboardUiState.dragStartTimer = setTimeout(() => {
        keyboardUiState.currentPreviewKey.draggable = true;
      }, 300);
    }
  });

  elements.keyboardContainer.addEventListener("pointerup", hideKeyPreview);

  elements.keyboardContainer.addEventListener(
    "pointermove",
    updatePreviewOnPointerMove,
  );

  elements.keyboardContainer.addEventListener("pointerleave", () => {
    if (keyboardUiState.currentPreviewKey) {
      if (keyboardUiState.previewFeedbackTimer) {
        clearTimeout(keyboardUiState.previewFeedbackTimer);
        keyboardUiState.previewFeedbackTimer = null;
      }
      hideKeyPreview();
      keyboardUiState.currentPreviewKey = null;
    }
  });

  elements.keyboardDismissOverlay.addEventListener("click", closeKeyboard);

  elements.keyboardContainer.addEventListener("dragstart", handledraggeingKey);

  elements.keyboardContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  elements.keyboardContainer.addEventListener("dragenter", handledragEnter);
  elements.keyboardContainer.addEventListener("dragleave", handledragLeave);
  elements.keyboardContainer.addEventListener("dragend", handledragEnd);
  elements.keyboardContainer.addEventListener("drop", handleKeyDrop);

  document.addEventListener("DOMContentLoaded", loadDraftedInputText);

  document.addEventListener("click", (e) => {
    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_FA}]`))
      virtualKeyboard.setLang("fa");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_EN}]`))
      virtualKeyboard.setLang("en");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_SYM}]`))
      virtualKeyboard.setLang("symbols");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_EN}]`))
      virtualKeyboard.setLang("en");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SHIFT_KEY}]`)) {
      virtualKeyboard.currentCapsLock();
    }

    if (e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`)) {
      typeIntoInput(e);
      virtualKeyboard.onKeyPressed();
      saveInputText();
    }

    if (e.target.closest(`[${ATTRIBUTES.INPUT}]`)) {
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
