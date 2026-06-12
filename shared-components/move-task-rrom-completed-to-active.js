import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import {
  captureAndRemoveTaskItem,
  showNumberOfCompletedTasks,
  updateCompletionStatusLabel,
} from "./complete-mode.js";
import { renderTasks } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { showUndopopup } from "./undo-completed-task.js";
import {
  disableOrEnableButtons,
  updateCounterAfterCompletingOrUncompletingATask,
} from "./select-tasks.js";
import { ACTIONS, UNDO_STATES } from "../constants/todo-constants.js";

export const moveTaskFromCompletedToActive = (event) => {
  const clickedCheckbox = event.target.closest(`[${ACTIONS.UNCOMPLETE_TASK}]`);
  if (!clickedCheckbox) return;
  const taskid = clickedCheckbox.dataset.id;
  if (!taskid) return;
  const activeTaskObject = lists.default.moveTaskFromCompletedToActive(taskid);
  captureAndRemoveTaskItem(taskid);
  showNumberOfCompletedTasks();
  appStateUi.undoOperation.taskObject = activeTaskObject.activeTask;
  appStateUi.undoOperation.taskObjectIndex =
    activeTaskObject.indexOfTaskToUncomplete;
  appStateUi.undoOperation.originalTaskObject =
    activeTaskObject.taskToUncomplete;
  renderTasks(lists.default.getTasks(), activeTaskObject.activeTask);
  countTasks();
  updateCompletionStatusLabel(event);
  showUndopopup();
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_UNCOMPLETED;
  updateCounterAfterCompletingOrUncompletingATask();
  /* disable or enable delete, complete, duplicate operation on tasks when in tasks selection */
  disableOrEnableButtons();
};
