import {
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import { handleSeveralTasksCompletion } from "./handle-several-tasks-completion.js";
import { handleSeveralTasksUncompletion } from "./handle-several-tasks-uncompletion.js";
import { activeUlId } from "./render-tasks.js";
import { ACTIONS, ATTR_STATES } from "../constants/todo-constants.js";
import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import {
  getCompletedListContainer,
  showNumberOfCompletedTasks,
} from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import { showUndopopup } from "./undo-completed-task.js";
import { getCachedElements } from "./get-cached-element.js";
import { exitTaskSelection } from "./select-tasks.js";

const elements = getCachedElements();

const getSelectedTask = () => {
  const selectedTask = document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  return selectedTask.parentElement || null;
};

export const handleSeveralTasksCompletionOrUncompletion = () => {
  const currentList = getSelectedTask();
  if (!currentList) return;

  if (currentList.dataset.id === activeUlId.ul) {
    handleSeveralTasksCompletion(currentList);
    appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_SEVERAL_COMPLETED;
  } else if (currentList.hasAttribute(ATTR.COMPLETED_LIST)) {
    handleSeveralTasksUncompletion(currentList);
    appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_SEVERAL_UNCOMPLETED;
  }
};

// shared component for both completed tasks and uncompleted tasks
export const changeUndoPopupLabel = (currentList, length) => {
  if (!elements.completionStatusLabel) return;
  const completedList = currentList.hasAttribute(ATTR.COMPLETED_LIST);

  if (completedList)
    elements.completionStatusLabel.textContent = `${length} uncompleted`;
  else elements.completionStatusLabel.textContent = `${length} completed`;
};

// snapshot of DOM for the undo operation
export const takeSnapshotOfDom = (currentList) => {
  const taskElements = currentList.querySelectorAll(`[${ATTR.TASK_ITEM}]`);
  if (taskElements.length === 0) return;

  const completedList = currentList.hasAttribute(ATTR.COMPLETED_LIST);
  const cloneTaskElements = Array.from(taskElements).map((task) =>
    task.cloneNode(true),
  );
  appStateUi.snapshots.domSnapshot = cloneTaskElements;
  appStateUi.snapshots.dataSnapshot = completedList
    ? structuredClone(lists.default.completedTasks)
    : structuredClone(lists.default.tasks);
};

// remove original selected tasks and clone it so that we do not work on a live refrence
const removeOriginallySelectedTasks = () => {
  const selectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  // remove the highlighted selected tasks then clone them
  selectedTasks.forEach(
    (el) => delete el.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK],
  );

  const cloneSelectedTasks = Array.from(selectedTasks).map((task) =>
    task.cloneNode(true),
  );

  selectedTasks.forEach((task) => task.remove());
  return cloneSelectedTasks;
};

// update data attribute and status of the checkbox to match completed tasks
const checkAndUpdateDataAttributeOfCheckboxes = (
  selectedTasks,
  completedList,
) => {
  selectedTasks.forEach((selectedTask) => {
    const checkboxes = completedList
      ? selectedTask.querySelectorAll(`[${ACTIONS.UNCOMPLETE_TASK}]`)
      : selectedTask.querySelectorAll(`[${ACTIONS.COMPLETE_TASK}]`);
    checkboxes.forEach((checkbox) => {
      checkbox.checked = completedList ? false : true;
      checkbox.dataset[ATTR_STATES.CHECKbOX] = completedList
        ? "complete-task"
        : "uncomplete-task";
    });
  });
};

export const removeSelectedTasks = (currentList) => {
  const selectedTasksClone = removeOriginallySelectedTasks();
  if (selectedTasksClone.length === 0) return;

  const completedList = currentList.hasAttribute(ATTR.COMPLETED_LIST);

  // mark checkboxes checked for the completed tasks
  checkAndUpdateDataAttributeOfCheckboxes(selectedTasksClone, completedList);

  const selectedTasksLength = selectedTasksClone.length;
  const taskids = Array.from(selectedTasksClone).map((task) => task.dataset.id);
  appStateUi.snapshots.IdsOfSelectedTasks = taskids;
  return {
    selectedTasksLength,
    taskids,
    selectedTasksClone,
  };
};

export const clearActiveTaskContainer = () => {
  const activeList = document.querySelector(`
    [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);

  return activeList;
};

export const refreshUi = () => {
  showNumberOfCompletedTasks();
  countTasks();
  handleEmptyTaskStateUi();
  showUndopopup();
  exitTaskSelection();
};
