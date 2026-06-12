import { lists } from "../todos-controller.js/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { ACTIONS, ATTR } from "../constants/todo-constants.js";

export const duplicateTask = (event) => {
  if (event.target.closest(`[${ACTIONS.DUPLICATE}]`)) {
    const taskItem = event.target.closest(`[${ATTR.TASK_ITEM}]`);
    if (!taskItem) return;
    const taskId = event.target.dataset.id;
    const duplicatedTask = lists.default.duplicateTask(taskId);
    const clonedTaskItem = taskItem.cloneNode(true);
    clonedTaskItem.dataset.id = duplicatedTask.id;
    const clonedTaskItemChildren = clonedTaskItem.querySelectorAll("[data-id]");
    clonedTaskItemChildren.forEach((el) => (el.dataset.id = duplicatedTask.id));
    taskItem.after(clonedTaskItem);
    const activeToolbars = document.querySelectorAll(".toolbar-action--active");
    if (activeToolbars)
      activeToolbars.forEach((toolbar) =>
        toolbar.classList.remove("toolbar-action--active"),
      );

    const activeManus = document.querySelectorAll(".manu--active");
    if (activeManus)
      activeManus.forEach((manu) => manu.classList.remove("manu--active"));
    const toolbarClosure = document.querySelectorAll(".close-toolbar--active");
    if (toolbarClosure)
      toolbarClosure.forEach((el) =>
        el.classList.remove("close-toolbar--active"),
      );
  }
  showNumberOfCompletedTasks();
  countTasks();
};
