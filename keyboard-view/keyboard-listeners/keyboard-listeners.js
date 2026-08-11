import {
  ATTRIBUTES,
  KEYBOARD_ACTIONS,
} from "../../constants/keyboard-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { showDateKeyboard } from "../../shared-components/costume-calendar/show-date-keyboard.js";
import { closeKeyboard } from "../closeKeyboardOnBodyClick.js";
import { positionCaret } from "../keyboard-caret-positioning.js";
import {
  cancelPointer,
  moveBackspacePointer,
  pressBackspace,
  releaseBackspace,
  typeIntoInput,
} from "../keyboard-input-behavior.js";
import {
  handledragEnd,
  handledragEnter,
  handledraggeingKey,
  handledragLeave,
  handleKeyDrop,
} from "../keyboard-key-reorder.js";
import { handleSpaceBar } from "../keyboard-spacebar.js";
import { toggleKeyboard } from "../toggle-keyboard.js";
import { elements } from "../../todos-controller.js/todos-controller.js";
import { keyboardUiState } from "../keyboard-states/states.js";
import {
  hideKeyPreview,
  renderKeyPreviewPopup,
  updatePreviewOnPointerMove,
} from "../keyboard-feedback-overlay.js";

const registerDragAndDropListeners = () => {
  elements.keyboardContainer.addEventListener("dragenter", handledragEnter);
  elements.keyboardContainer.addEventListener("dragleave", handledragLeave);
  elements.keyboardContainer.addEventListener("dragend", handledragEnd);
  elements.keyboardContainer.addEventListener("drop", handleKeyDrop);
  elements.keyboardContainer.addEventListener("dragstart", handledraggeingKey);

  elements.keyboardContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
};

const registerKeyboardListeners = () => {
  document.addEventListener("click", (e) => {
    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_FA}]`))
      virtualKeyboard.setLang("fa");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_EN}]`))
      virtualKeyboard.setLang("en");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_SYM}]`))
      virtualKeyboard.setLang("symbolsPage1");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.FIRST_SYMBOLS_PAGE}]`))
      virtualKeyboard.setLang("symbolsPage2");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SECOND_SYMBOLS_PAGE}]`))
      virtualKeyboard.setLang("symbolsPage1");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SWITCH_TO_EN}]`))
      virtualKeyboard.setLang("en");

    if (e.target.closest(`[${KEYBOARD_ACTIONS.SHIFT_KEY}]`)) {
      virtualKeyboard.currentCapsLock();
    }

    if (e.target.closest(`[${KEYBOARD_ACTIONS.NEXT}]`))
      virtualKeyboard.triggerNextHandler();

    const newLineKey = e.target.closest(`[${KEYBOARD_ACTIONS.ADD_NEW_LINE}]`);
    const regularKey = e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`);

    if (regularKey || newLineKey) {
      const text = newLineKey ? "\n" : regularKey.textContent;
      typeIntoInput(text);
      virtualKeyboard.onKeyPressed();
    }

    if (e.target.closest(`[${ATTRIBUTES.INPUT}]`)) {
      positionCaret(e);
      showDateKeyboard();
    }
  });

  elements.keyboardDismissOverlay.addEventListener("click", closeKeyboard);
  elements.mainPageNewTask.addEventListener("click", toggleKeyboard);
  elements.keyboardContainer.addEventListener("click", handleSpaceBar);
};

const registerKeyboardPointerListeners = () => {
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

  elements.keyboardContainer.addEventListener("pointerdown", pressBackspace);
  elements.keyboardContainer.addEventListener("pointerup", releaseBackspace);
  elements.keyboardContainer.addEventListener("pointercancel", cancelPointer);
  elements.keyboardContainer.addEventListener(
    "pointermove",
    moveBackspacePointer,
  );
};

export {
  registerDragAndDropListeners,
  registerKeyboardListeners,
  registerKeyboardPointerListeners,
};
