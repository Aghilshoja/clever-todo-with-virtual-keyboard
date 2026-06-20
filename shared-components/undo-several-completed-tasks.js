import {
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import {
  refreshUiAfterUndo,
  removeSelectedTasksHighlightedTasks,
} from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { activeUlId } from "./render-tasks.js";

export const undoSeveralCompletedTasks = () => {
  const activelist = document.querySelector(`
    [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);

  if (!activelist) return;

  removeSelectedTasksHighlightedTasks();

  const tasksToRemoveFromCompletedLIstAfterUndo =
    appStateUi.snapshots.IdsOfSelectedTasks.map((id) =>
      document.querySelector(`[${ATTR.TASK_ITEM}][data-id='${id}']`),
    );

  tasksToRemoveFromCompletedLIstAfterUndo.forEach((task) => task.remove());

  activelist.innerHTML = "";
  appStateUi.snapshots.domSnapshot.forEach((task) =>
    activelist.appendChild(task),
  );

  const taskIds = appStateUi.snapshots.IdsOfSelectedTasks;

  const originalClonedArray = appStateUi.snapshots.dataSnapshot;
  lists.default.undoSeveralCompletedTasks(originalClonedArray, taskIds);

  refreshUiAfterUndo();
};
