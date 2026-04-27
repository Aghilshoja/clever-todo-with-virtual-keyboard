import { getCachedElements } from "./get-cached-element.js";
import { lists } from "../todos-controller.js/todos-controller.js";

const elements = getCachedElements();
export const countTasks = () => {
  if (!elements) throw new Error("required DOM was not found");
  if (lists.default.getTasks().length > 0) {
    elements.taskCounter.classList.add("task-counter--active");
    elements.taskCounter.textContent = lists.default.getTasks().length;
  } else if (lists.default.getTasks().length === 0) {
    elements.taskCounter.classList.remove("task-counter--active");
    elements.taskCounter.textContent = "";
  }
};
