import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";
import {
  ATTR_STATES,
  EDIT_MODES,
  HIDDEN,
  VISIBLE,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";
import { elements } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { appStateUi } from "../todo-states/states.js";
import { showDateSuggestion } from "./show-date-suggestion.js";
import { keyboardUiState } from "../../keyboard-view/keyboard-states/states.js";

const showDateKeyboard = () => {
  if (
    appStateUi.activeMode !== EDIT_MODES.DATE_MODE &&
    appStateUi.activeMode !== EDIT_MODES.EDIT_TASK_DATE &&
    appStateUi.activeMode !== EDIT_MODES.EDIT_MULTIPLE_TASK
  )
    return;

  if (keyboardUiState.activePlaceholder === PLACEHOLDERS.EDIT_TIME) {
    //toggle number keyboard
    toggleKeyboard();
    return;
  }

  const unrelatedElements = elements.unrelatedKeyboardOptions;
  const quickOptionsContainer = elements.quickOptionsContainer;
  const taskDateSeggestionEl = elements.taskDateSuggestion;
  const input = elements.inputElement;

  appStateUi.activeMode = EDIT_MODES.EDIT_TASK_DATE;

  unrelatedElements.forEach(
    (fade) => (fade.dataset[ATTR_STATES.UNRELATED_ELS] = HIDDEN.UNRELATED_ELS),
  );

  quickOptionsContainer.dataset[ATTR_STATES.QUICK_OPTIONS_CONTAINER] =
    HIDDEN.QUICK_OPTIONS_CONTAINER;

  taskDateSeggestionEl.dataset[ATTR_STATES.DATA_SUGGESTION] =
    VISIBLE.DATA_SUGGESTION;

  showDateSuggestion();

  toggleKeyboard();
};

export { showDateKeyboard };
