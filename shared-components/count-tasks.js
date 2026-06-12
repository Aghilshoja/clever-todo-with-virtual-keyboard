import { getCachedElements } from "./get-cached-element.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { ACTIVE, ATTR_STATES, INACTIVE } from "../constants/todo-constants.js";

const elements = getCachedElements();
export const countTasks = () => {
  if (!elements) throw new Error("required DOM was not found");
  if (lists.default.getTasks().length > 0) {
    elements.taskCounter.dataset[ATTR_STATES.TASKS_COUNTER] =
      ACTIVE.TASKS_COUNTER;
    elements.taskCounter.textContent = lists.default.getTasks().length;
  } else if (lists.default.getTasks().length === 0) {
    elements.taskCounter.dataset[ATTR_STATES.TASKS_COUNTER] =
      INACTIVE.TASKS_COUNTER;
    elements.taskCounter.textContent = "";
  }
};
