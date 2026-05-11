import { lists } from "../todos-controller.js/todos-controller.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { renderTasks } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";

const removeTaskmarkedAsNotCompleted = (taskId) => {
  const taskItem = document.querySelector(`.task[data-id="${taskId}"]`);
  if (!taskItem) return;
  taskItem.remove();
};

export const moveTaskFromCompletedToActive = (event) => {
  const clickedCheckbox =
    event.target.closest(".task__completed-main-task-checkbox") ||
    event.target.closest(".task__toolbar-completed-task-checkbox");
  if (!clickedCheckbox) return;
  const taskid = clickedCheckbox.dataset.id;
  if (!taskid) return;
  const activeTaskObject = lists.default.moveTaskFromCompletedToActive(taskid);
  removeTaskmarkedAsNotCompleted(taskid);
  showNumberOfCompletedTasks();
  renderTasks(lists.default.getTasks(), activeTaskObject);
  countTasks();
};
