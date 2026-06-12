import { ACTIONS, ATTR } from "../constants/todo-constants.js";
import {
  addListeners,
  appStateUi,
  lists,
} from "../todos-controller.js/todos-controller.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { activeUlId } from "./render-tasks.js";
import { hideUndoPopup, removeTaskItemForUndo } from "./undo-completed-task.js";

export const undoUncompletedTask = () => {
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;
  const taskObjectIndex = appStateUi.undoOperation.taskObjectIndex;
  const removedTaskItem = appStateUi.undoOperation.removedEl;
  const previousEl = appStateUi.undoOperation.previousEl;
  const nextEl = appStateUi.undoOperation.nextEl;
  const completedTaskId = appStateUi.undoOperation.taskObject.id;

  removeTaskItemForUndo();

  lists.default.undoUncompletedTask(
    originalTaskObject,
    taskObjectIndex,
    completedTaskId,
  );

  const checkboxes = removedTaskItem.querySelectorAll(
    `[${ACTIONS.UNCOMPLETE_TASK}]`,
  );

  checkboxes.forEach((checkbox) => (checkbox.checked = true));

  if (previousEl) previousEl.after(removedTaskItem);
  else if (nextEl) nextEl.before(removedTaskItem);
  else {
    const activeList = document.querySelector(
      `[${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`,
    );
    const nextElementSibling = activeList.nextElementSibling;
    const completedList = nextElementSibling.querySelector("ul");
    if (!nextElementSibling || !completedList) return;
    completedList.appendChild(removedTaskItem);
  }

  showNumberOfCompletedTasks();
  hideUndoPopup();
  countTasks(); // update badge of active tasks
};
