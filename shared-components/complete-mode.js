import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { getCachedElements } from "./get-cached-element.js";
import { renderCompletedTask } from "./render-tasks.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { addListeners } from "../todos-controller.js/todos-controller.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import { showUndopopup } from "./undo-completed-task.js";
import {
  disableOrEnableButtons,
  updateCounterAfterCompletingOrUncompletingATask,
  updateLabelsOfOperationalButtonsForSelectedTasks,
} from "./select-tasks.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  INACTIVE,
  UNDO_STATES,
} from "../constants/todo-constants.js";

const elements = getCachedElements();

export const captureAndRemoveTaskItem = (taskId) => {
  const taskItem = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]`,
  );
  if (!taskItem) return;
  appStateUi.undoOperation.removedEl = taskItem;
  appStateUi.undoOperation.previousEl = taskItem.previousElementSibling;
  appStateUi.undoOperation.nextEl = taskItem.nextElementSibling;
  taskItem.remove();
};

export const getCompletedListContainer = () => {
  const activeList = document.querySelector(
    `[${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`,
  );

  const listWrapper = activeList.nextElementSibling;
  const completedListTitle = listWrapper.querySelector(
    `[${ATTR.COMPLETION_STATUS}]`,
  );
  const completedList = listWrapper.querySelector(`[${ATTR.COMPLETED_LIST}]`);
  return {
    listWrapper,
    completedListTitle,
    completedList,
  };
};

export const showNumberOfCompletedTasks = () => {
  const numberOfCompletedTasks = lists.default.getCompletedTasks().length;
  const completedElements = getCompletedListContainer();
  if (!completedElements) return;
  completedElements.completedListTitle.textContent =
    numberOfCompletedTasks === 1
      ? `${numberOfCompletedTasks} completed task`
      : `${numberOfCompletedTasks} completed tasks`;
  completedElements.listWrapper.dataset[ATTR_STATES.COMPLETED_LIST_SECTION] =
    ACTIVE.COMPLETED_SECTION;

  if (numberOfCompletedTasks === 0) {
    completedElements.listWrapper.dataset[ATTR_STATES.COMPLETED_LIST_SECTION] =
      INACTIVE.COMPLETED_SECTION;
  }
};

export const updateCompletionStatusLabel = (e) => {
  const completionStatus = elements.completionStatusLabel;
  const activeListCheckbox = e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`);
  const completedListCheckbox = e.target.closest(
    `[${ACTIONS.UNCOMPLETE_TASK}]`,
  );
  if (activeListCheckbox) completionStatus.textContent = "Completed";
  else if (completedListCheckbox) completionStatus.textContent = "Uncompleted";
};

export const completeTask = (e) => {
  const clickedCheckbox = e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`);
  if (!clickedCheckbox) return;
  if (!elements) throw new Error("Required DOM was not found");
  const taskId = clickedCheckbox.dataset.id;
  if (!taskId) return;
  const completedTaskobject = lists.default.markTaskAsCompleted(taskId);
  const completedListContainer = getCompletedListContainer();
  if (!completedListContainer) return;
  captureAndRemoveTaskItem(taskId);
  addListeners(
    completedListContainer.completedList,
  ); /* add listeners to the completed list */
  showNumberOfCompletedTasks();
  renderCompletedTask(completedTaskobject.copyCompletedTask);
  appStateUi.undoOperation.taskObject = completedTaskobject.copyCompletedTask;
  appStateUi.undoOperation.taskObjectIndex =
    completedTaskobject.completedTaskIndex;
  appStateUi.undoOperation.originalTaskObject =
    completedTaskobject.taskToComplete;
  countTasks(); //update badge of active list
  handleEmptyTaskStateUi();
  // show undo popup
  updateCompletionStatusLabel(e);
  showUndopopup();
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_COMPLETED;
  updateLabelsOfOperationalButtonsForSelectedTasks();

  /* update number of tasks selected after completing them in task selection mode */
  updateCounterAfterCompletingOrUncompletingATask();
  /* disable or enable delete, complete, duplicate operation on tasks when in tasks selection */
  disableOrEnableButtons();
};
