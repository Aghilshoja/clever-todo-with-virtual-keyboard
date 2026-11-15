import {
  ACTIONS,
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
} from "../../constants/todo-constants.js";
import { elements, lists } from "../../todos-controller/todos-controller.js";
import { months } from "../costume-calendar/create-calendar.js";
import { appStateUi } from "../todo-states/states.js";

const getSelectedTask = () =>
  document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

const updateDueDateChangeUndoMessage = () => {
  if (!appStateUi.undoOperation.dueDate) {
    console.warn("no due date provided");
    return "no date scheduled";
  }
  const currentYear = new Date().getFullYear();

  const year = appStateUi.undoOperation.dueDate.getFullYear();
  const month = appStateUi.undoOperation.dueDate.getMonth();
  const date = appStateUi.undoOperation.dueDate.getDate();

  const hour = appStateUi.undoOperation.dueDate.getHours();
  const minute = appStateUi.undoOperation.dueDate.getMinutes();

  const time = appStateUi.undoOperation.hasTime
    ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    : "";

  const formattedDueDate = `scheduled for ${months[month]} ${date}, ${year === currentYear ? "" : year} ${time}`;

  elements.completionStatusLabel.textContent = formattedDueDate;
};

const updateSingleTaskCompletionUndoMessage = (e, tasksCount) => {
  const completionStatus = elements.completionStatusLabel;
  const activeListCheckbox = e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`);
  const completedListCheckbox = e.target.closest(
    `[${ACTIONS.UNCOMPLETE_TASK}]`,
  );

  if (activeListCheckbox) {
    completionStatus.textContent = `${tasksCount} completed`;
  } else if (completedListCheckbox) {
    completionStatus.textContent = `${tasksCount} uncompleted`;
  }
};

const storeUndoInfo = (taskId, currentlist) => {
  if (!currentlist) return;
  const taskItem = currentlist.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  if (!taskItem) return;

  const previousElId = taskItem.previousElementSibling?.dataset.id;
  const nextElId = taskItem.nextElementSibling?.dataset.id;

  let toolbarSubtaskContainer = null;

  const parentId = taskItem.dataset.parentTaskId;

  if (parentId) {
    toolbarSubtaskContainer = currentlist.querySelector(
      `[${ATTR.SUBTASKS_CONTAINER}][data-id="${parentId}"]`,
    );
  }

  appStateUi.undoOperation.taskIDs = {
    previousElId,
    nextElId,
  };

  appStateUi.undoOperation.currentList = {
    currentlist,
    toolbarSubtaskContainer,
  };
};

const updateMultipleTasksCompletionUndoMessage = (operationType, count) => {
  console.log(
    "op:",
    operationType === "several-uncompletion",
    "op itself :",
    operationType,
    "count:",
    count,
  );
  if (operationType === "several-uncompletion") {
    elements.completionStatusLabel.textContent = `${count} uncompleted`;
  } else elements.completionStatusLabel.textContent = `${count} completed`;
};

const captureUndoSnapshot = () => {
  const selectedTask = getSelectedTask();
  if (!selectedTask) return;
  const currentList = selectedTask.parentElement;
  appStateUi.undoOperation.currentList = currentList;

  appStateUi.snapshots.domSnapshot = [
    ...currentList.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  ].map((element) => element.cloneNode(true));

  if (currentList.hasAttribute(ATTR.SECTION_LIST)) {
    const sectionList = lists.default.getSectionList(currentList.dataset.id);
    appStateUi.undoOperation.sectionList = sectionList;
    if (!sectionList) return;
    appStateUi.snapshots.dataSnapshot = structuredClone(sectionList.tasks);
  } else {
    appStateUi.snapshots.dataSnapshot = structuredClone(lists.default.tasks);
  }

  appStateUi.snapshots.subtasks = structuredClone(lists.default.subtasks);
  return currentList;
};

export {
  storeUndoInfo,
  updateMultipleTasksCompletionUndoMessage,
  updateSingleTaskCompletionUndoMessage,
  updateDueDateChangeUndoMessage,
  captureUndoSnapshot,
};
