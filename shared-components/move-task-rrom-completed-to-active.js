import { lists } from "../todos-controller/todos-controller.js";
import {
  captureAndRemoveTaskItem,
  getList,
  updateCompletionStatusLabel,
} from "./complete-mode.js";
import { renderTask } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { showUndopopup } from "./undo-completed-task.js";
import {
  disableOrEnableButtons,
  updateCounterAfterCompletingOrUncompletingATask,
} from "./select-tasks.js";
import { ACTIONS, UNDO_STATES } from "../constants/todo-constants.js";
import { appStateUi } from "./todo-states/states.js";

export const moveTaskFromCompletedToActive = (event) => {
  const clickedCheckbox = event.target.closest(`[${ACTIONS.UNCOMPLETE_TASK}]`);
  if (!clickedCheckbox) return;
  const taskid = clickedCheckbox.dataset.id;
  if (!taskid) return;
  const activeTaskObject = lists.default.moveTaskFromCompletedToActive(taskid);
  captureAndRemoveTaskItem(taskid);
  appStateUi.undoOperation.originalTaskObject = activeTaskObject;

  const tasksContainer = getList();

  if (tasksContainer) {
    const template = document.createElement("div");
    template.innerHTML = renderTask(activeTaskObject);
    tasksContainer.prepend(template.firstElementChild);
  }

  countTasks();
  updateCompletionStatusLabel(event);
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_UNCOMPLETED;
  showUndopopup();
  updateCounterAfterCompletingOrUncompletingATask();
  /* disable or enable delete, complete, duplicate operation on tasks when in tasks selection */
  disableOrEnableButtons();
};
