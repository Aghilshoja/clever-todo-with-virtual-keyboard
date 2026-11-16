import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  HIDDEN,
  HIGHLIGHT_SELECTED_TASK,
  VISIBLE,
} from "../../constants/todo-constants.js";
import { lists } from "../../todos-controller/todos-controller.js";
import { renderTask } from "../render-tasks.js";
import { appStateUi } from "../todo-states/states.js";

export const renderSubtaskInItsParentToolbar = (
  parentTaskEl,
  subtaskEl,
  operationType,
) => {
  const subTaskElCopy = subtaskEl.cloneNode(true);
  delete subTaskElCopy.dataset[ATTR_STATES.SUBTASKS];
  const nestingIndentEl = subTaskElCopy.querySelector(
    `[${ATTR.SUBTASK_INDENT}]`,
  );
  if (nestingIndentEl) nestingIndentEl.style.marginLeft = "0";

  const subtasksContainer = parentTaskEl.querySelector(
    `[${ATTR.SUBTASKS_CONTAINER}]`,
  );

  if (!subtasksContainer) return;

  if (operationType === "completion" || operationType === "duplication") {
    subtasksContainer.appendChild(subTaskElCopy);
  } else subtasksContainer.prepend(subTaskElCopy);
};

export const handleMaxSubTaskLimit = (subTaskEl, depth) => {
  const MAX_LIMIT = 4;
  if (depth === MAX_LIMIT) {
    const subTaskBtn = subTaskEl.querySelector(`[${ACTIONS.SUB_TASK}]`);
    if (subTaskBtn) subTaskBtn.remove();
  }
};

const renderSubtask = (subTaskOb) => {
  const template = document.createElement("ul");
  template.innerHTML = renderTask(subTaskOb);
  const taskItem = template.firstElementChild;
  taskItem.dataset.parentTaskId = subTaskOb.parentTaskId;
  taskItem.dataset[ATTR_STATES.SUBTASKS] = VISIBLE.SUBTASKS;
  const depth = lists.default.getSubtaskDepth(appStateUi.taskId);
  handleMaxSubTaskLimit(taskItem, depth);
  const nestingIndentEl = taskItem.querySelector(`[${ATTR.SUBTASK_INDENT}]`);
  if (nestingIndentEl) nestingIndentEl.style.marginLeft = `${depth}rem`;

  const parentTaskEl = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${appStateUi.taskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  if (parentTaskEl) {
    const mainSubTasksTogglerContainer = parentTaskEl.querySelector(
      `[${ATTR.MAIN_SUBTASK_TOGGLER_CONTAINER}]`,
    );

    if (mainSubTasksTogglerContainer) {
      const subTaskTogglerBtn = mainSubTasksTogglerContainer.querySelector(
        `[${ACTIONS.SUBTASK_TOGGLER}]`,
      );
      if (subTaskTogglerBtn)
        subTaskTogglerBtn.dataset[ATTR_STATES.MAIN_SUBTASK_TOGGLER] =
          VISIBLE.SUBTASK_TOGGLER;
    }

    const toolbarsubTaskTogglerEl = parentTaskEl.querySelector(
      `[${ACTIONS.TOOLBAR_SUBTASKS_TOGGLER}]`,
    );
    if (toolbarsubTaskTogglerEl)
      toolbarsubTaskTogglerEl.dataset[ATTR_STATES.TOOLBAR_SUBTASK_TOGGLER] =
        VISIBLE.SUBTASK_TOGGLER;

    return {
      parentTaskEl,
      taskItem,
    };
  }
};

const getSelectedTask = () =>
  document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

export const addSubtask = (taskText) => {
  const COLLAPSED = "collapsed";
  // Override the parent task ID when adding a subtask to a selected task.
  const selectedTask = getSelectedTask();
  if (selectedTask) appStateUi.taskId = selectedTask.dataset.id;

  const subtask = lists.default.addSubTask(
    appStateUi.taskId,
    taskText,
    appStateUi.sectionId,
  );

  const { parentTaskEl, taskItem } = renderSubtask(subtask);
  if (parentTaskEl.getAttribute("data-sub-tasks-expanded") === COLLAPSED) {
    taskItem.dataset[ATTR_STATES.SUBTASKS] = HIDDEN.SUBTASKS;
  } else taskItem.dataset[ATTR_STATES.SUBTASKS] = VISIBLE.SUBTASKS;

  parentTaskEl.after(taskItem);
  renderSubtaskInItsParentToolbar(parentTaskEl, taskItem);
};
