import { ensurePlaceholder } from "../keyboard-view/keyboard-input-behavior.js";
import { elements, lists } from "../todos-controller/todos-controller.js";
import { disableSubmitIfInputEmpty } from "../keyboard-view/keyboard-input-behavior.js";
import { countTasks } from "./count-tasks.js";
import { saveInputText } from "./save-drafted-text-input-to-local-storage.js";
import { truncateTaskDescription, truncateTaskText } from "./truncate-task.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import {
  ADD_SECTION,
  ADD_TASK_MODE,
  ATTR,
} from "../constants/todo-constants.js";
import {
  addTaskAboveSelectedTask,
  addTaskBelowSelectedTask,
} from "./add-task-relative-to-selected-task.js";
import { appStateUi } from "./todo-states/states.js";
import { getList } from "./complete-mode.js";
import { addTaskToSection } from "./sections/add-task-to-section.js";

const removeEmptyStateImage = () => {
  const tasksContainer = getList();
  if (!tasksContainer) return;
  const emptyStateEl = tasksContainer.querySelector(
    `[${ATTR.EMPTY_STATE_TASK}]`,
  );
  if (emptyStateEl) emptyStateEl.remove();
};

export const addTask = () => {
  const value = virtualKeyboard.caretManeger.text.trim();

  if (value === "") return;

  removeEmptyStateImage();

  const shouldAddTaskAbove =
    appStateUi.addTaskModes === ADD_TASK_MODE.ADD_ABOVE;

  const shouldAddTaskBelow =
    appStateUi.addTaskModes === ADD_TASK_MODE.ADD_BELOW;

  const shouldAddTaskToSection =
    appStateUi.addSectionMode === ADD_SECTION.SECTION;

  if (shouldAddTaskAbove) addTaskAboveSelectedTask(value);
  else if (shouldAddTaskBelow) addTaskBelowSelectedTask(value);
  else if (shouldAddTaskToSection) addTaskToSection(value);
  else lists.default.addTask(value);

  elements.inputElement.textContent = "";

  virtualKeyboard.resetCaretState();
  virtualKeyboard.updateAutoCaps();

  ensurePlaceholder(elements.inputElement);
  saveInputText();
  disableSubmitIfInputEmpty();
  countTasks();
  truncateTaskDescription();
  truncateTaskText();
};
