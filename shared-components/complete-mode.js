import { elements, lists } from "../todos-controller/todos-controller.js";
import { renderTask } from "./render-tasks.js";
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

export const captureAndRemoveTaskItem = (taskId, currentlist) => {
  if (!currentlist) return;
  const taskItem = currentlist.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]`,
  );
  if (!taskItem) return;
  appStateUi.undoOperation.removedEl = taskItem;
  appStateUi.undoOperation.previousEl = taskItem.previousElementSibling;
  appStateUi.undoOperation.nextEl = taskItem.nextElementSibling;
  taskItem.remove();
};

export const getList = () => {
  return (
    document.querySelector(
      `[${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`,
    ) || null
  );
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

export const createTaskItem = (task) => {
  const template = document.createElement("div");
  template.innerHTML = renderTask(task);
  const taskItem = template.firstElementChild;
  taskItem.dataset.isCompleted = true;

  const shouldCompletedTasksBeVisible =
    elements.showCompletedTasksBtn.dataset.isVisible === "true";

  if (shouldCompletedTasksBeVisible)
    taskItem.dataset.completedTaskVisiblity = false;
  else taskItem.dataset.completedTaskVisiblity = true;

  return taskItem;
};

export const completeTask = (e) => {
  const clickedCheckbox = e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`);
  if (!clickedCheckbox) return;
  const taskId = clickedCheckbox.dataset.id;
  if (!taskId) return;
  const tasksContainer = getList();

  if (!tasksContainer) return;

  const sectionItem = clickedCheckbox.closest(`[${ATTR.SECTION_ITEM}]`);

  let taskObject = null;

  if (sectionItem) {
    const sectionId = sectionItem.dataset.id;
    if (sectionId)
      taskObject = lists.default.markTaskAsCompleted(taskId, sectionId);
    const taskItem = createTaskItem(taskObject);
    const sectionList = sectionItem.querySelector(`[${ATTR.SECTION_LIST}]`);
    captureAndRemoveTaskItem(taskId, sectionList);
    if (sectionList) sectionList.appendChild(taskItem);
  } else {
    taskObject = lists.default.markTaskAsCompleted(taskId);
    captureAndRemoveTaskItem(taskId, tasksContainer);
    const taskItem = createTaskItem(taskObject);
    tasksContainer.appendChild(taskItem);
  }

  appStateUi.undoOperation.originalTaskObject = taskObject;

  handleEmptyTaskStateUi();
  countTasks();

  updateCompletionStatusLabel(e);
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_COMPLETED;
  showUndopopup();
  updateLabelsOfOperationalButtonsForSelectedTasks();

  /* update number of tasks selected after completing them in task selection mode */
  updateCounterAfterCompletingOrUncompletingATask();
  /* disable or enable delete, complete, duplicate operation on tasks when in tasks selection */
  disableOrEnableButtons();
  showEmptyStateWhenNoVisibleTasks();
};
