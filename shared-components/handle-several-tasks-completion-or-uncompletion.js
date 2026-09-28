import {
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import { handleSeveralTasksCompletion } from "./handle-several-tasks-completion.js";
import { handleSeveralTasksUncompletion } from "./handle-several-tasks-uncompletion.js";
import { elements, lists } from "../todos-controller/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import { showUndopopup } from "./undo-completed-task.js";
import { exitTaskSelection } from "./select-tasks.js";
import { months } from "./costume-calendar/create-calendar.js";
import { appStateUi } from "./todo-states/states.js";

const getSelectedTask = () => {
  const selectedTask = document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  return selectedTask;
};

export const handleSeveralTasksCompletionOrUncompletion = () => {
  const taskEl = getSelectedTask();
  if (!taskEl) return;

  const isCompletedTask = taskEl.dataset.isCompleted === "true";

  if (isCompletedTask) {
    appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_SEVERAL_UNCOMPLETED;
    handleSeveralTasksUncompletion();
  } else {
    appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_SEVERAL_COMPLETED;
    handleSeveralTasksCompletion();
  }
};

const formatTime = () => {
  const currentYear = new Date().getFullYear();

  const year = appStateUi.undoOperation.dueDate.getFullYear();
  const month = appStateUi.undoOperation.dueDate.getMonth();
  const date = appStateUi.undoOperation.dueDate.getDate();

  const hour = appStateUi.undoOperation.dueDate.getHours();
  const minute = appStateUi.undoOperation.dueDate.getMinutes();

  const time = appStateUi.undoOperation.hasTime
    ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    : "";

  return `scheduled for ${months[month]} ${date} ${year === currentYear ? "" : year} ${time}`;
};

// shared component for both completed tasks and uncompleted tasks
export const ShowUndoStatusLabel = (selectedTask, length) => {
  const isMultipleDueDates =
    appStateUi.undoOperation.undoType === UNDO_STATES.UNDO_MULTIPLE_DUE_DATES;
  if (isMultipleDueDates) {
    elements.completionStatusLabel.textContent = formatTime();
    return;
  }

  if (selectedTask && selectedTask.dataset.isCompleted === "true") {
    elements.completionStatusLabel.textContent = `${length} uncompleted`;
  } else elements.completionStatusLabel.textContent = `${length} completed`;
};

// snapshot of DOM for the undo operation
export const takeSnapshotOfDom = (currentList) => {
  const taskElements = currentList.querySelectorAll(`[${ATTR.TASK_ITEM}]`);
  if (taskElements.length === 0) return;

  const cloneTaskElements = Array.from(taskElements).map((task) =>
    task.cloneNode(true),
  );
  appStateUi.snapshots.domSnapshot = cloneTaskElements;
  appStateUi.snapshots.dataSnapshot = structuredClone(lists.default.tasks);
};

// remove original selected tasks and clone it so that we do not work on a live refrence
export const removeOriginallySelectedTasks = () => {
  const selectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  if (selectedTasks.length === 0) return;

  ShowUndoStatusLabel(selectedTasks[0], selectedTasks.length);

  const taskIds = Array.from(selectedTasks).map((el) => el.dataset.id);

  appStateUi.snapshots.IdsOfSelectedTasks = taskIds;
  const selectedTasksLength = selectedTasks.length;

  selectedTasks.forEach((task) => task.remove());
  return {
    taskIds,
    selectedTasksLength,
  };
};

export const refreshUi = () => {
  countTasks();
  handleEmptyTaskStateUi();
  showUndopopup();
  exitTaskSelection();
};
