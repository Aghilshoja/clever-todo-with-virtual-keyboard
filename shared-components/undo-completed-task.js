import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { getCachedElements } from "./get-cached-element.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";

const elements = getCachedElements();

let undoPopupTimer = null;

export const showUndopopup = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const undoCompletion = elements.undoCompletion;
  if (!undoCompletion) return;

  // 1. Clear any existing timer
  if (undoPopupTimer) clearTimeout(undoPopupTimer);

  const isUndoPopupOpen = undoCompletion.classList.contains(
    "undo-completion--active",
  );

  if (isUndoPopupOpen)
    undoCompletion.classList.remove("undo-completion--active");

  setTimeout(() => {
    undoCompletion.classList.add("undo-completion--active");
  }, 2);

  undoPopupTimer = setTimeout(() => {
    elements.undoCompletion.classList.remove("undo-completion--active");
    // Reset the timer variable once it's done
    undoPopupTimer = null;
  }, 2000);
};

const removeUndoneCompletedTaskFromCompletedList = () => {
  const taskId = appStateUi.undoOperation.completedTaskObject.id;
  const removedTaskItemFromCompletedlist = document.querySelector(
    `.task[data-id="${taskId}"]`,
  );
  if (removedTaskItemFromCompletedlist)
    removedTaskItemFromCompletedlist.remove();
};

const hideUndoPopup = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const undoCompletionPopup = elements.undoCompletion;
  if (!undoCompletionPopup) return;
  undoCompletionPopup.classList.remove("undo-completion--active");
};

export const undoCompletedTask = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;
  const taskObjectIndex = appStateUi.undoOperation.completedTaskIndex;
  const removedTaskItem = appStateUi.undoOperation.removedEl;
  const previousEl = appStateUi.undoOperation.previousEl;
  const nextEl = appStateUi.undoOperation.nextEl;
  const completedTaskId = appStateUi.undoOperation.completedTaskObject.id;
  removeUndoneCompletedTaskFromCompletedList();

  lists.default.undoCompletedTask(
    originalTaskObject,
    taskObjectIndex,
    completedTaskId,
  );
  const checkbox = removedTaskItem.querySelector(".task__main-task-checkbox");
  if (checkbox.checked) checkbox.checked = false;

  if (previousEl) previousEl.after(removedTaskItem);
  else if (nextEl) nextEl.before(removedTaskItem);
  else {
    const activeList = document.querySelector(
      `.list[data-id="${activeUlId.ul}"]`,
    );
    if (!activeList) return;
    activeList.textContent = "";
    activeList.appendChild(removedTaskItem);
  }
  showNumberOfCompletedTasks();
  countTasks();
  hideUndoPopup();
};
