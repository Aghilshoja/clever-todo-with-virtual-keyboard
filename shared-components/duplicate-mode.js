import { lists } from "../todos-controller.js/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  CLOSED,
  INACTIVE,
  OPEN,
} from "../constants/todo-constants.js";

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
    const activeToolbars = document.querySelectorAll(
      `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
    );

    const activeManus = document.querySelectorAll(
      `[${CHECK_STATES.TOOLBAR_MENU}='${OPEN.TASK_MENU}']`,
    );

    const toolbarClosure = document.querySelectorAll(
      `[${CHECK_STATES.TOOLBAR_OVERLAY_STATE}='${ACTIVE.TOOLBAR_OVERLAY}']`,
    );

    if (activeToolbars)
      activeToolbars.forEach(
        (toolbar) =>
          (toolbar.dataset[ATTR_STATES.TASK_TOOLBAR] = CLOSED.TASK_TOOLBAR),
      );

    if (activeManus)
      activeManus.forEach(
        (menu) => (menu.dataset[ATTR_STATES.TASK_MENU] = CLOSED.TASK_MENU),
      );

    if (toolbarClosure)
      toolbarClosure.forEach(
        (el) =>
          (el.dataset[ATTR_STATES.TOOLBAR_OVERLAY] = INACTIVE.TOOLBAR_OVERLAY),
      );
  }

  showNumberOfCompletedTasks();
  countTasks();
};
