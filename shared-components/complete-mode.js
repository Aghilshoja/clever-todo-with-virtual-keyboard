import { elements, lists } from "../todos-controller/todos-controller.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { createTaskEmptyState, handleEmptyTaskStateUi } from "./delete-mode.js";
import { showUndopopup } from "./undo-completed-task.js";
import {
  disableOrEnableButtons,
  updateCounterAfterCompletingOrUncompletingATask,
  updateLabelsOfOperationalButtonsForSelectedTasks,
} from "./select-tasks.js";
import { ACTIONS, ATTR, UNDO_STATES } from "../constants/todo-constants.js";
import { appStateUi } from "./todo-states/states.js";
import { putSubtaskAtTheEnd } from "./utils/task-dom-utils.js";
import {
  storeUndoInfo,
  updateSingleTaskCompletionUndoMessage,
} from "./utils/task-undo-utils.js";

export const showEmptyStateWhenNoVisibleTasks = () => {
  const tasksContainer = getList();

  if (!tasksContainer) return;

  const taskItems = document.querySelectorAll(
    `[${ATTR.TASK_ITEM}][data-is-completed="false"]`,
  );

  const areCompletedTasksHidden =
    elements.showCompletedTasksBtn.dataset.isVisible === "false";
  if (
    taskItems.length === 0 &&
    areCompletedTasksHidden &&
    lists.default.sections.length === 0
  ) {
    const template = document.createElement("ul");
    template.innerHTML = createTaskEmptyState();
    tasksContainer.prepend(template.firstElementChild);
  }
};

export const getList = () => {
  return (
    document.querySelector(
      `[${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`,
    ) || null
  );
};

export const completeTask = (e) => {
  const clickedCheckbox = e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`);
  if (!clickedCheckbox) return;

  const taskId = clickedCheckbox.dataset.id;
  if (!taskId) return;

  const tasksContainer = getList();
  if (!tasksContainer) return;

  const descendants = lists.default.getAllDescendants(taskId);
  appStateUi.undoOperation.previousCompletionStates = new Map();

  descendants.forEach((subtask) => {
    appStateUi.undoOperation.previousCompletionStates.set(
      subtask.id,
      subtask.isCompleted,
    );
  });

  const sectionItem = clickedCheckbox.closest(`[${ATTR.SECTION_ITEM}]`);

  let taskObject = null;

  if (sectionItem) {
    const sectionId = sectionItem.dataset.id;

    if (sectionId) {
      taskObject = lists.default.markTaskAsCompleted(taskId, sectionId);
    }

    const sectionList = sectionItem.querySelector(`[${ATTR.SECTION_LIST}]`);

    storeUndoInfo(taskId, sectionList);

    if (sectionList) {
      putSubtaskAtTheEnd(taskObject, sectionList);
    }
  } else {
    taskObject = lists.default.markTaskAsCompleted(taskId);

    storeUndoInfo(taskId, tasksContainer);

    putSubtaskAtTheEnd(taskObject, tasksContainer);
  }

  appStateUi.undoOperation.originalTaskObject = taskObject;

  handleEmptyTaskStateUi();
  countTasks();

  const numberOfCompletedTasks =
    lists.default.getAllDescendants(taskId).length + 1;

  updateSingleTaskCompletionUndoMessage(e, numberOfCompletedTasks);
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_COMPLETED;
  showUndopopup();
  updateLabelsOfOperationalButtonsForSelectedTasks();

  /* update number of tasks selected after completing them in task selection mode */
  updateCounterAfterCompletingOrUncompletingATask();

  /* disable or enable delete, complete, duplicate operation on tasks when in tasks selection */
  disableOrEnableButtons();
  showEmptyStateWhenNoVisibleTasks();
};
