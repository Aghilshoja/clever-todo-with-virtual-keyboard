import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { getCachedElements } from "./get-cached-element.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { undoUncompletedTask } from "./undo-uncompleted-task.js";

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

export const removeTaskItemForUndo = () => {
  const taskId = appStateUi.undoOperation.taskObject.id;
  const taskItem = document.querySelector(`.task[data-id="${taskId}"]`);
  if (taskItem) taskItem.remove();
};

export const hideUndoPopup = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const undoCompletionPopup = elements.undoCompletion;
  if (!undoCompletionPopup) return;
  undoCompletionPopup.classList.remove("undo-completion--active");
};

const undoCompletedTask = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;
  const taskObjectIndex = appStateUi.undoOperation.taskObjectIndex;
  const removedTaskItem = appStateUi.undoOperation.removedEl;
  const previousEl = appStateUi.undoOperation.previousEl;
  const nextEl = appStateUi.undoOperation.nextEl;
  const completedTaskId = appStateUi.undoOperation.taskObject.id;
  removeTaskItemForUndo();

  lists.default.undoCompletedTask(
    originalTaskObject,
    taskObjectIndex,
    completedTaskId,
  );
  const checkboxes = removedTaskItem.querySelectorAll(
    ".task__main-task-checkbox, .task__toolbar-task-checkbox",
  );
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) checkbox.checked = false;
  });

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

export const handleUndoCompletingAndUncompleting = () => {
  const undoType = appStateUi.undoOperation.undoType;
  if (undoType === "undo-completed") undoCompletedTask();
  else if (undoType === "undo-uncompleted") undoUncompletedTask();
};
