import {
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
} from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { refreshUiAfterUndo } from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { exitTaskSelection } from "./select-tasks.js";
import { appStateUi } from "./todo-states/states.js";

const getCurrentList = () => {
  const selectedTask = document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  return selectedTask.parentElement || null;
};

const takeSnapShotofDomForDueDates = () => {
  const currentList = getCurrentList();

  if (!currentList) return;

  const taskElements = currentList.querySelectorAll(`[${ATTR.TASK_ITEM}]`);
  if (taskElements.length === 0) return;

  const cloneTaskElements = Array.from(taskElements).map((task) =>
    task.cloneNode(true),
  );
  appStateUi.snapshots.domSnapshot = { cloneTaskElements, currentList };

  const isSectionList = currentList.hasAttribute(ATTR.SECTION_LIST);

  if (isSectionList) {
    const sectionList = lists.default.getSectionList(currentList.dataset.id);
    appStateUi.undoOperation.sectionList = sectionList;

    if (!sectionList) return;
    appStateUi.snapshots.dataSnapshot = structuredClone(sectionList.tasks);
  } else {
    appStateUi.snapshots.dataSnapshot = structuredClone(lists.default.tasks);
  }
};

const undoMultipleActiveTasks = (currentList) => {
  currentList.textContent = "";
  appStateUi.snapshots.domSnapshot.cloneTaskElements.forEach((task) =>
    currentList.appendChild(task),
  );

  if (currentList.hasAttribute(ATTR.SECTION_LIST)) {
    appStateUi.undoOperation.sectionList.tasks =
      appStateUi.snapshots.dataSnapshot;
  } else {
    lists.default.tasks = appStateUi.snapshots.dataSnapshot;
  }
  refreshUiAfterUndo();
  exitTaskSelection();
};

const capturePreviousTaskState = () => {
  const currentList = appStateUi.snapshots.domSnapshot.currentList;

  undoMultipleActiveTasks(currentList);
};

const undoMultipleTaskDueDates = () => {
  capturePreviousTaskState();
};

export { undoMultipleTaskDueDates, takeSnapShotofDomForDueDates };
