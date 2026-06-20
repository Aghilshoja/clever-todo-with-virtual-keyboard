import { ATTR } from "../constants/todo-constants.js";
import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { getCompletedListContainer } from "./complete-mode.js";
import {
  refreshUiAfterUndo,
  removeSelectedTasksHighlightedTasks,
} from "./handle-several-completed-and-uncompleted-tasks-undo.js";

export const undoSeveralUncompletedTasks = () => {
  const completedTaskList = getCompletedListContainer();
  const { completedList } = completedTaskList;

  removeSelectedTasksHighlightedTasks();

  const tasksToRemoveFromActiveListAfterUndo =
    appStateUi.snapshots.IdsOfSelectedTasks.map((id) =>
      document.querySelector(`[${ATTR.TASK_ITEM}][data-id='${id}']`),
    );

  tasksToRemoveFromActiveListAfterUndo.forEach((task) => task.remove());

  completedList.innerHTML = "";
  appStateUi.snapshots.domSnapshot.forEach((task) =>
    completedList.appendChild(task),
  );

  const taskIds = appStateUi.snapshots.IdsOfSelectedTasks;

  const originalClonedArray = appStateUi.snapshots.dataSnapshot;

  lists.default.undoSeveralUncompletedTasks(originalClonedArray, taskIds);

  refreshUiAfterUndo();
};
