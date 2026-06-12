import { getCachedElements } from "./get-cached-element.js";
import { ensurePlaceholder } from "../keyboard-view/keyboard-input-behavior.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { disableSubmitIfInputEmpty } from "../keyboard-view/keyboard-input-behavior.js";
import { countTasks } from "./count-tasks.js";
import { saveInputText } from "./save-drafted-text-input-to-local-storage.js";
import { truncateTaskDescription, truncateTaskText } from "./truncate-task.js";
import { PLACEHOLDERS } from "../constants/keyboard-constants.js";

export const addTask = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.inputElement) return;
  const value = elements.inputElement.textContent.trim();
  const ENTER_TASK = PLACEHOLDERS.ENTER_TASK;
  if (value !== "" && value !== ENTER_TASK) lists.default.addTask(value);
  elements.inputElement.textContent = "";
  ensurePlaceholder(elements.inputElement);
  saveInputText();
  disableSubmitIfInputEmpty();
  countTasks();
  truncateTaskDescription();
  truncateTaskText();
};
