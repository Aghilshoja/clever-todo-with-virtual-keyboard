import { elements, lists } from "../todos-controller/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { undoUncompletedTask } from "./undo-uncompleted-task.js";
import { disableOrEnableButtons } from "./select-tasks.js";
import {
  ATTR,
  UNDO_STATES,
  ATTR_STATES,
  ACTIVE,
  INACTIVE,
} from "../constants/todo-constants.js";
import { appStateUi } from "./todo-states/states.js";
import { getList } from "./complete-mode.js";
import { renderTask } from "./render-tasks.js";
import { buildActiveTask, updateDOM } from "./utils/task-dom-utils.js";

export const removeTaskEmptyState = () => {
  const tasksContainer = getList();

  if (!tasksContainer) return;

  const emptyStateEl = tasksContainer.querySelector(
    `[${ATTR.EMPTY_STATE_TASK}]`,
  );

  if (emptyStateEl) emptyStateEl.remove();
};

let undoPopupTimer = null;

export const showUndopopup = () => {
  const noUndoAvailable =
    appStateUi.undoOperation.undoType === UNDO_STATES.NO_UNDO;

  elements.undoCompletedTask.hidden = noUndoAvailable;
  const undoCompletion = elements.undoCompletion;

  // 1. Clear any existing timer
  if (undoPopupTimer) clearTimeout(undoPopupTimer);

  const isUndoPopupOpen =
    undoCompletion.dataset[ATTR_STATES.UNDO_CON] === ACTIVE.UNDO_CON;

  if (isUndoPopupOpen)
    undoCompletion.dataset[ATTR_STATES.UNDO_CON] = INACTIVE.UNDO_CON;

  setTimeout(() => {
    undoCompletion.dataset[ATTR_STATES.UNDO_CON] = ACTIVE.UNDO_CON;
  }, 2);

  undoPopupTimer = setTimeout(() => {
    undoCompletion.dataset[ATTR_STATES.UNDO_CON] = INACTIVE.UNDO_CON;
    appStateUi.undoOperation.undoType = UNDO_STATES.NO_UNDO;
    // Reset the timer variable once it's done
    undoPopupTimer = null;
  }, 10000);
};

export const removeTaskItemForUndo = () => {
  const taskId = appStateUi.undoOperation.originalTaskObject.id;
  const taskItem = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]`,
  );
  if (taskItem) taskItem.remove();
};

export const hideUndoPopup = () => {
  const undoCompletionPopup = elements.undoCompletion;

  undoCompletionPopup.dataset[ATTR_STATES.UNDO_CON] = INACTIVE.UNDO_CON;
};

const createMainTask = (taskObject, currentList, previousStateInfo) => {
  const OPERATION_TYPE = "undo-completion";
  const taskElement = buildActiveTask(taskObject);
  const fragment = updateDOM(taskObject, taskElement, OPERATION_TYPE);
  if (!fragment) return;

  const taskId = previousStateInfo.previousElId || previousStateInfo.nextElId;

  let taskEl = currentList.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  if (!taskEl) {
    currentList.prepend(fragment);
    return;
  }

  if (previousStateInfo.previousElId) taskEl.after(fragment);
  else if (previousStateInfo.nextElId) taskEl.before(fragment);
};

const buildToolbarActiveTask = (task) => {
  const template = document.createElement("ul");
  template.innerHTML = renderTask(task);
  const taskItem = template.firstElementChild;

  return taskItem;
};

const undoCompletedTask = () => {
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;

  disableOrEnableButtons();
  removeTaskItemForUndo();

  lists.default.undoCompletedTask(
    originalTaskObject,
    appStateUi.undoOperation.previousCompletionStates,
  );

  const { currentlist, toolbarSubtaskContainer } =
    appStateUi.undoOperation.currentList;

  if (currentlist) {
    const previousStateInfo = appStateUi.undoOperation.taskIDs;
    createMainTask(originalTaskObject, currentlist, previousStateInfo);

    if (toolbarSubtaskContainer) {
      const toolbarContainer = toolbarSubtaskContainer;
      toolbarContainer
        .querySelector(
          `[${ATTR.TASK_ITEM}][data-id="${originalTaskObject.id}"]`,
        )
        ?.remove();

      const fragment = buildToolbarActiveTask(originalTaskObject);

      const taskId =
        previousStateInfo.previousElId || previousStateInfo.nextElId;

      const toolbarTaskEl = toolbarContainer.querySelector(
        `[${ATTR.TASK_ITEM}][data-id="${taskId}"]`,
      );

      if (!toolbarTaskEl) {
        toolbarContainer.prepend(fragment);
        return;
      }

      if (previousStateInfo.previousElId) toolbarTaskEl.after(fragment);
      else if (previousStateInfo.nextElId) toolbarTaskEl.before(fragment);
    }
  }

  countTasks();
  hideUndoPopup();
  removeTaskEmptyState();
};

export const handleUndoCompletingAndUncompleting = () => {
  const undoType = appStateUi.undoOperation.undoType;
  if (undoType === UNDO_STATES.UNDO_COMPLETED) undoCompletedTask();
  else if (undoType === UNDO_STATES.UNDO_UNCOMPLETED) undoUncompletedTask();
};
