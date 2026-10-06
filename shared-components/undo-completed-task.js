import { elements, lists } from "../todos-controller/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { undoUncompletedTask } from "./undo-uncompleted-task.js";
import { disableOrEnableButtons } from "./select-tasks.js";
import {
  ACTIONS,
  ATTR,
  UNDO_STATES,
  ATTR_STATES,
  ACTIVE,
  INACTIVE,
  CHECK_STATES,
} from "../constants/todo-constants.js";
import { appStateUi } from "./todo-states/states.js";
import { getList } from "./complete-mode.js";

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
  }, 2000);
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

const unhighlightSelectedTaskAfterUndoOperation = (taskItem) => {
  delete taskItem.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK];
};

const restoreTaskItemWhenAlone = (removedTaskItem) => {
  if (removedTaskItem.hasAttribute(CHECK_STATES.SECTION_ID)) {
    const sectionListId = removedTaskItem.dataset.sectionId;
    const sectionList = document.querySelector(
      `[${ATTR.SECTION_LIST}][data-id="${sectionListId}"]`,
    );

    if (!sectionList) return;
    sectionList.prepend(removedTaskItem);
  } else {
    const tasksContainer = getList();
    if (!tasksContainer) return;
    tasksContainer.textContent = "";
    tasksContainer.appendChild(removedTaskItem);
  }
};

const undoCompletedTask = () => {
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;
  const removedTaskItem = appStateUi.undoOperation.removedEl;
  const previousEl = appStateUi.undoOperation.previousEl;
  const nextEl = appStateUi.undoOperation.nextEl;

  unhighlightSelectedTaskAfterUndoOperation(removedTaskItem);
  disableOrEnableButtons();
  removeTaskItemForUndo();

  lists.default.undoCompletedTask(originalTaskObject);

  const checkboxes = removedTaskItem.querySelectorAll(
    `[${ACTIONS.COMPLETE_TASK}]`,
  );
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) checkbox.checked = false;
  });

  if (previousEl) previousEl.after(removedTaskItem);
  else if (nextEl) nextEl.before(removedTaskItem);
  else restoreTaskItemWhenAlone(removedTaskItem);

  countTasks();
  hideUndoPopup();
  removeTaskEmptyState();
};

export const handleUndoCompletingAndUncompleting = () => {
  const undoType = appStateUi.undoOperation.undoType;
  if (undoType === UNDO_STATES.UNDO_COMPLETED) undoCompletedTask();
  else if (undoType === UNDO_STATES.UNDO_UNCOMPLETED) undoUncompletedTask();
};
