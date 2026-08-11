import {
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
} from "../constants/todo-constants.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { getCompletedListContainer } from "./complete-mode.js";
import { refreshUiAfterUndo } from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { activeUlId } from "./render-tasks.js";
import { exitTaskSelection } from "./select-tasks.js";
import { appStateUi } from "./todo-states/states.js";

const getSelectedTask = () => {
  const selectedTask = document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  return selectedTask.parentElement || null;
};

const takeSnapShotofDomForDueDates = () => {
  const currentList = getSelectedTask();
  const taskElements = currentList.querySelectorAll(`[${ATTR.TASK_ITEM}]`);
  if (taskElements.length === 0) return;

  const completedList = currentList.hasAttribute(ATTR.COMPLETED_LIST);
  const cloneTaskElements = Array.from(taskElements).map((task) =>
    task.cloneNode(true),
  );
  appStateUi.snapshots.domSnapshot = { cloneTaskElements, currentList };

  appStateUi.snapshots.dataSnapshot = completedList
    ? structuredClone(lists.default.completedTasks)
    : structuredClone(lists.default.tasks);
};

const undoMultipleActiveTasks = (currentList) => {
  currentList.textContent = "";
  appStateUi.snapshots.domSnapshot.cloneTaskElements.forEach((task) =>
    currentList.appendChild(task),
  );

  lists.default.tasks = appStateUi.snapshots.dataSnapshot;
  refreshUiAfterUndo();
  exitTaskSelection();
};

const undoMultipleCompletedTasks = (currentList) => {
  currentList.textContent = "";
  appStateUi.snapshots.domSnapshot.cloneTaskElements.forEach((task) =>
    currentList.appendChild(task),
  );

  lists.default.completedTasks = appStateUi.snapshots.dataSnapshot;
  refreshUiAfterUndo();
  exitTaskSelection();
};

const capturePreviousTaskState = () => {
  const currentList = appStateUi.snapshots.domSnapshot.currentList;

  if (currentList.dataset.id === activeUlId.ul) {
    undoMultipleActiveTasks(currentList);
  } else if (currentList.hasAttribute(ATTR.COMPLETED_LIST)) {
    undoMultipleCompletedTasks(currentList);
  }
};

const undoMultipleTaskDueDates = () => {
  capturePreviousTaskState();
};

export { undoMultipleTaskDueDates, takeSnapShotofDomForDueDates };
