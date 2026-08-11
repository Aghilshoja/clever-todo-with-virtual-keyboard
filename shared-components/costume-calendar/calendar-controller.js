import {
  KEYBOARD_STATES,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR_STATES,
  EDIT_MODES,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { elements, lists } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { updateCalendar } from "./create-calendar.js";
import { exitDateMode, exitEditingDate } from "./exit-date-picker.js";
import { getTaskObject, quickDateLabels } from "./quick-date-options.js";
import { initializeDateEditor, showDateEditor } from "./prepare-date-editor.js";
import { quickDateVisibility } from "./quick-date-options.js";
import { exitTaskSelection } from "../select-tasks.js";
import { appStateUi } from "../todo-states/states.js";
import { keyboardUiState } from "../../keyboard-view/keyboard-states/states.js";

const activateCalendar = () => {
  elements.dateContainer.dataset[ATTR_STATES.DATE_CONTAINER] =
    ACTIVE.DATE_CONTAINER;

  quickDateLabels.updateLabels();
};

const openTaskCalendar = () => {
  quickDateVisibility.updateQuickDateOptions();

  const task = getTaskObject();
  if (!task) return;

  appStateUi.activeMode = EDIT_MODES.DATE_MODE;
  appStateUi.hasTime = task.hasTime;
  if (task.dueDate !== null) appStateUi.draftedDate = new Date(task.dueDate);

  updateCalendar(task);
  activateCalendar();
  showDateEditor();
  initializeDateEditor();
  quickDateVisibility.updateQuickDateOptions();
};

const showCostumeCalendar = (e) => {
  if (!e.target.closest(`[${ACTIONS.TASK_DATE}]`)) return;
  const taskDateBtn = e.target.closest(`[${ACTIONS.TASK_DATE}]`);
  openTaskCalendar();
};

const handleExitEditingTaskDateOrDateMode = (event) => {
  if (!event.target.closest(`[${ACTIONS.EXIT_DATE_PICKER}]`)) return;
  if (appStateUi.activeMode === EDIT_MODES.DATE_MODE) exitDateMode();
  if (appStateUi.activeMode === EDIT_MODES.EDIT_TASK_DATE) exitEditingDate();
  if (appStateUi.activeMode === EDIT_MODES.EDIT_MULTIPLE_TASK) {
    exitDateMode();
    exitTaskSelection();
  }
};

export {
  showCostumeCalendar,
  handleExitEditingTaskDateOrDateMode,
  openTaskCalendar,
};
