import {
  LOCAL_STORAGE_KEY,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR_STATES,
  EDIT_MODES,
  INACTIVE,
  HIDDEN,
  VISIBLE,
} from "../../constants/todo-constants.js";
import {
  keyboardUiState,
  virtualKeyboard,
} from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import {
  disableSubmitIfInputEmpty,
  ensurePlaceholder,
} from "../../keyboard-view/keyboard-input-behavior.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";

const elements = getCachedElements();

const resetModesAndEnsurePlaceholder = () => {
  appStateUi.activeMode = EDIT_MODES.NO_MODES;
  keyboardUiState.activePlaceholder = PLACEHOLDERS.ENTER_TASK;
  if (elements.circleEl && elements.inputElement) {
    elements.circleEl.after(elements.inputElement);
    const savedData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY.TEXT_EDITOR),
    );

    if ((savedData.draftedNewTask ?? "").length > 0) {
      virtualKeyboard.caretManeger.text = savedData.draftedNewTask;
      virtualKeyboard.caretManeger.caretPosition = savedData.caretPosition;
      const caret = ensureCaret(elements.inputElement);
      updateTextEditor(elements.inputElement, caret);
    } else {
      virtualKeyboard.resetCaretState();
      elements.inputElement.textContent = "";
      ensurePlaceholder(elements.inputElement);
      disableSubmitIfInputEmpty();
    }
  }
};

const hideDateMode = () => {
  if (!elements.dateContainer) return;
  elements.dateContainer.dataset[ATTR_STATES.DATE_CONTAINER] =
    INACTIVE.DATE_CONTAINER;

  resetModesAndEnsurePlaceholder();
};

const hideEditTaskDateUI = () => {
  if (!elements.quickOptionsContainer || !elements.taskDateSuggestion) return;
  elements.quickOptionsContainer.dataset[ATTR_STATES.QUICK_OPTIONS_CONTAINER] =
    VISIBLE.QUICK_OPTIONS_CONTAINER;

  elements.taskDateSuggestion.dataset[ATTR_STATES.DATA_SUGGESTION] =
    HIDDEN.DATA_SUGGESTION;

  appStateUi.activeMode = EDIT_MODES.DATE_MODE;

  if (elements.undoCompletedTask)
    elements.unrelatedKeyboardOptions.forEach(
      (fade) =>
        (fade.dataset[ATTR_STATES.UNRELATED_ELS] = VISIBLE.UNRELATED_ELS),
    );
};

const exitDateMode = () => {
  hideDateMode();
  appStateUi.draftedDate = null;
};

const exitEditingDate = (event) => {
  hideEditTaskDateUI();
};

export { exitDateMode, exitEditingDate };
