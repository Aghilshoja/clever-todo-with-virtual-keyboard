import { lists } from "../todos-controller/todos-controller.js";
import { countTasks } from "./count-tasks.js";
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
import { renderTask } from "./render-tasks.js";
import { updateDOM } from "./utils/task-dom-utils.js";

const closeOpentoolbars = () => {
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
};

const getLastDescendantElement = (targetContainer, taskId) => {
  const descendants = lists.default.getAllDescendants(taskId);

  const descendantIds = new Set(descendants.map((task) => task.id));

  const descendantElements = [
    ...targetContainer.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  ].filter((el) => descendantIds.has(el.dataset.id));

  return descendantElements.at(-1);
};

export const duplicateTask = (event) => {
  if (event.target.closest(`[${ACTIONS.DUPLICATE}]`)) {
    const taskItem = event.target.closest(`[${ATTR.TASK_ITEM}]`);
    if (!taskItem) return;
    const taskId = event.target.dataset.id;

    const sectionItem = taskItem.closest(`[${ATTR.SECTION_ITEM}]`);

    let taskInfo = null;
    if (sectionItem) {
      const sectionId = sectionItem.dataset.id;
      taskInfo = lists.default.duplicateTask(taskId, sectionId);
    } else {
      taskInfo = lists.default.duplicateTask(taskId);
    }

    taskInfo.idMapping.forEach((newId, originalId) => {
      const originalEl = document.querySelector(
        `[${ATTR.TASK_ITEM}][data-id="${originalId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
      );

      if (originalEl) {
        originalEl.dataset.duplicatedId = newId;
      }
    });

    const targetContainer = event.currentTarget;

    const lastDescendantEl = getLastDescendantElement(
      targetContainer,
      taskItem.dataset.id,
    );

    const fragment = updateDOM(taskInfo.duplicatedTask, "duplication");

    if (!taskInfo.duplicatedTask.parentTaskId) {
      const descendants = lists.default.getAllDescendants(taskItem.dataset.id);

      if (descendants.length === 0) {
        const template = document.createElement("ul");
        template.innerHTML = renderTask(taskInfo.duplicatedTask);
        taskItem.after(template.firstElementChild);
      } else {
        if (lastDescendantEl) lastDescendantEl.after(fragment);
      }
    } else {
      if (lastDescendantEl) lastDescendantEl.after(fragment);
      else taskItem.after(fragment);
    }

    document.querySelectorAll("[data-duplicated-id]").forEach((el) => {
      delete el.dataset.duplicatedId;
    });

    closeOpentoolbars();
  }

  countTasks();
};
