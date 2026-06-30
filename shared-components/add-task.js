import { getCachedElements } from "./get-cached-element.js";
import { ensurePlaceholder } from "../keyboard-view/keyboard-input-behavior.js";
import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { disableSubmitIfInputEmpty } from "../keyboard-view/keyboard-input-behavior.js";
import { countTasks } from "./count-tasks.js";
import { saveInputText } from "./save-drafted-text-input-to-local-storage.js";
import { truncateTaskDescription, truncateTaskText } from "./truncate-task.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { ADD_TASK_MODE } from "../constants/todo-constants.js";
import {
  addTaskAboveSelectedTask,
  addTaskBelowSelectedTask,
} from "./add-task-relative-to-selected-task.js";

export const addTask = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.inputElement) return;

  const value = virtualKeyboard.caretManeger.text.trim();

  if (value === "") return;

  const shouldAddTaskAbove =
    appStateUi.addTaskModes === ADD_TASK_MODE.ADD_ABOVE;

  const shouldAddTaskBelow =
    appStateUi.addTaskModes === ADD_TASK_MODE.ADD_BELOW;

  if (shouldAddTaskAbove) addTaskAboveSelectedTask(value);
  else if (shouldAddTaskBelow) addTaskBelowSelectedTask(value);
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
