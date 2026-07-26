import {
  KEYBOARD_STATES,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import { ATTR_STATES } from "../../constants/todo-constants.js";
import {
  keyboardUiState,
  virtualKeyboard,
} from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { lists } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { months } from "./create-calendar.js";
import { getTaskObject } from "./quick-date-options.js";
import { formatTimeDisplay } from "./parse-time.js";

const elements = getCachedElements();

const format24HourTime = (hours, minutes) => {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const loadExistingDueDate = (task) => {
  const date = new Date(task.dueDate);

  const time = task.hasTime
    ? format24HourTime(date.getHours(), date.getMinutes())
    : "";

  const taskDueDate = `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear() === 2026 ? "" : date.getFullYear()} ${time}`;

  virtualKeyboard.caretManeger.text = taskDueDate.trim();

  virtualKeyboard.caretManeger.caretPosition = taskDueDate.length;

  const caret = ensureCaret(elements.inputElement);
  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];
  updateTextEditor(elements.inputElement, caret);
};

const initializeDateEditor = () => {
  const task = getTaskObject();
  if (!task) return;

  if (task && task.dueDate !== null) loadExistingDueDate(task);
  else elements.inputElement.textContent = PLACEHOLDERS.EDIT_TASK_DATE;
};

const showDateEditor = () => {
  if (!elements.inputElement || !elements.editDueDateBtn) return;

  elements.editDueDateBtn.dataset[ATTR_STATES.HIDE_DUE_DATE_BTN] = "";

  elements.editDueDateBtn.before(elements.inputElement);

  keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TASK_DATE;

  elements.inputElement.textContent = PLACEHOLDERS.EDIT_TASK_DATE;
};

export { showDateEditor, initializeDateEditor, format24HourTime };
