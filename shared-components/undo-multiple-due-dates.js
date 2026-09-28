import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import { refreshUiAfterUndo } from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { exitTaskSelection } from "./select-tasks.js";
import { appStateUi } from "./todo-states/states.js";

const takeSnapShotofDomForDueDates = () => {
  const tasksContainer = getList();

  if (!tasksContainer) return;

  const taskElements = tasksContainer.querySelectorAll(`[${ATTR.TASK_ITEM}]`);
  if (taskElements.length === 0) return;

  const cloneTaskElements = Array.from(taskElements).map((task) =>
    task.cloneNode(true),
  );
  appStateUi.snapshots.domSnapshot = { cloneTaskElements, tasksContainer };

  appStateUi.snapshots.dataSnapshot = structuredClone(lists.default.tasks);
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

const capturePreviousTaskState = () => {
  const currentList = appStateUi.snapshots.domSnapshot.tasksContainer;

  undoMultipleActiveTasks(currentList);
};

const undoMultipleTaskDueDates = () => {
  capturePreviousTaskState();
};

export { undoMultipleTaskDueDates, takeSnapShotofDomForDueDates };
