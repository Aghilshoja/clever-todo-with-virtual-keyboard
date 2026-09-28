import { ATTR } from "../constants/todo-constants.js";
import { elements } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import { createTaskEmptyState } from "./delete-mode.js";

const showCompletedTasks = () => {
  const completedTasks = document.querySelectorAll(
    `[${ATTR.TASK_ITEM}][data-completed-task-visiblity="true"]`,
  );

  completedTasks.forEach((el) => (el.dataset.completedTaskVisiblity = "false"));

  elements.showCompletedTasksBtn.dataset.isVisible = "true";
  elements.showCompletedTasksBtn.textContent = "Hide completed tasks";
};

const hideCompletedTasks = () => {
  const completedTasks = document.querySelectorAll(
    `[${ATTR.TASK_ITEM}][data-completed-task-visiblity="false"]`,
  );

  completedTasks.forEach((el) => (el.dataset.completedTaskVisiblity = "true"));

  elements.showCompletedTasksBtn.dataset.isVisible = "false";
  elements.showCompletedTasksBtn.textContent = "Show completed tasks";
};

const removeEmptyStateIfNoActiveTasks = (tasksContainer) => {
  const activeTasks = document.querySelectorAll(
    `[${ATTR.TASK_ITEM}][data-is-completed="false"]`,
  );

  if (activeTasks.length === 0) {
    tasksContainer.querySelector(`[${ATTR.EMPTY_STATE_TASK}]`)?.remove();
  }
};

const addEmptyStateIfNoActiveTasks = (tasksContainer) => {
  const activeTasks = document.querySelectorAll(
    `[${ATTR.TASK_ITEM}][data-is-completed="false"]`,
  );

  if (activeTasks.length === 0) {
    const template = document.createElement("div");
    template.innerHTML = createTaskEmptyState();
    tasksContainer.prepend(template.firstElementChild);
  }
};

export const hideOrShowCompletedTasks = () => {
  const tasksContainer = getList();
  if (!tasksContainer) return;

  const areCompletedTasksHidden =
    elements.showCompletedTasksBtn.dataset.isVisible === "false";

  if (areCompletedTasksHidden) {
    showCompletedTasks();
    removeEmptyStateIfNoActiveTasks(tasksContainer);
  } else {
    hideCompletedTasks();
    addEmptyStateIfNoActiveTasks(tasksContainer);
  }
};
