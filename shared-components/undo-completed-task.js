import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { getCachedElements } from "./get-cached-element.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { undoUncompletedTask } from "./undo-uncompleted-task.js";
import { disableOrEnableButtons } from "./select-tasks.js";
import {
  ACTIONS,
  ATTR,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
  CHECK_STATES,
  ATTR_STATES,
  ACTIVE,
  INACTIVE,
} from "../constants/todo-constants.js";

const elements = getCachedElements();

let undoPopupTimer = null;

export const showUndopopup = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const undoCompletion = elements.undoCompletion;
  if (!undoCompletion) return;

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
    // Reset the timer variable once it's done
    undoPopupTimer = null;
  }, 2000);
};

export const removeTaskItemForUndo = () => {
  const taskId = appStateUi.undoOperation.taskObject.id;
  const taskItem = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]`,
  );
  if (taskItem) taskItem.remove();
};

export const hideUndoPopup = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const undoCompletionPopup = elements.undoCompletion;
  if (!undoCompletionPopup) return;
  undoCompletionPopup.dataset[ATTR_STATES.UNDO_CON] = INACTIVE.UNDO_CON;
};

const unhighlightSelectedTaskAfterUndoOperation = (taskItem) => {
  delete taskItem.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK];
};

const undoCompletedTask = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;
  const taskObjectIndex = appStateUi.undoOperation.taskObjectIndex;
  const removedTaskItem = appStateUi.undoOperation.removedEl;
  const previousEl = appStateUi.undoOperation.previousEl;
  const nextEl = appStateUi.undoOperation.nextEl;
  const completedTaskId = appStateUi.undoOperation.taskObject.id;
  unhighlightSelectedTaskAfterUndoOperation(removedTaskItem);
  disableOrEnableButtons();
  removeTaskItemForUndo();

  lists.default.undoCompletedTask(
    originalTaskObject,
    taskObjectIndex,
    completedTaskId,
  );
  const checkboxes = removedTaskItem.querySelectorAll(
    `[${ACTIONS.COMPLETE_TASK}]`,
  );
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) checkbox.checked = false;
  });

  if (previousEl) previousEl.after(removedTaskItem);
  else if (nextEl) nextEl.before(removedTaskItem);
  else {
    const activeList = document.querySelector(
      `[${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`,
    );
    if (!activeList) return;
    activeList.textContent = "";
    activeList.appendChild(removedTaskItem);
  }
  showNumberOfCompletedTasks();
  countTasks();
  hideUndoPopup();
};

export const handleUndoCompletingAndUncompleting = () => {
  const undoType = appStateUi.undoOperation.undoType;
  if (undoType === UNDO_STATES.UNDO_COMPLETED) undoCompletedTask();
  else if (undoType === UNDO_STATES.UNDO_UNCOMPLETED) undoUncompletedTask();
};
