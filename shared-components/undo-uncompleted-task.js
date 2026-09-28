import { ACTIONS } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { appStateUi } from "./todo-states/states.js";
import {
  hideUndoPopup,
  removeTaskEmptyState,
  removeTaskItemForUndo,
} from "./undo-completed-task.js";

export const undoUncompletedTask = () => {
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;
  const removedTaskItem = appStateUi.undoOperation.removedEl;
  const previousEl = appStateUi.undoOperation.previousEl;
  const nextEl = appStateUi.undoOperation.nextEl;

  removeTaskItemForUndo();

  lists.default.undoUncompletedTask(originalTaskObject);

  const checkboxes = removedTaskItem.querySelectorAll(
    `[${ACTIONS.UNCOMPLETE_TASK}]`,
  );

  checkboxes.forEach((checkbox) => (checkbox.checked = true));

  if (previousEl) previousEl.after(removedTaskItem);
  else if (nextEl) nextEl.before(removedTaskItem);
  else {
    const tasksContainer = getList();
    if (!tasksContainer) return;
    completedList.appendChild(removedTaskItem);
  }

  hideUndoPopup();
  countTasks(); // update badge of active tasks
  removeTaskEmptyState();
};
