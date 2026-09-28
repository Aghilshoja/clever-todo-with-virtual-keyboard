import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import {
  refreshUiAfterUndo,
  removeSelectedTasksHighlightedTasks,
} from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { appStateUi } from "./todo-states/states.js";

export const undoSeveralUncompletedTasks = () => {
  const tasksContainer = getList();

  if (!tasksContainer) return;

  removeSelectedTasksHighlightedTasks();

  const taskIds = appStateUi.snapshots.IdsOfSelectedTasks;

  const tasksToRemoveFromActiveListAfterUndo = taskIds.map((id) =>
    document.querySelector(`[${ATTR.TASK_ITEM}][data-id='${id}']`),
  );

  tasksToRemoveFromActiveListAfterUndo.forEach((task) => task.remove());

  tasksContainer.innerHTML = "";
  appStateUi.snapshots.domSnapshot.forEach((task) =>
    tasksContainer.appendChild(task),
  );

  const originalClonedArray = appStateUi.snapshots.dataSnapshot;

  lists.default.undoSeveralUncompletedTasks(originalClonedArray);

  refreshUiAfterUndo();
};
