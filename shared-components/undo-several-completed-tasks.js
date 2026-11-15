import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import {
  refreshUiAfterUndo,
  removeSelectedTasksHighlightedTasks,
} from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { appStateUi } from "./todo-states/states.js";

export const undoSeveralCompletedTasks = () => {
  const sectionList = appStateUi.undoOperation.sectionList;
  const currentList = appStateUi.undoOperation.currentList;
  const isSectionList = currentList.hasAttribute(ATTR.SECTION_LIST);

  const originalSubtasks = appStateUi.snapshots.subtasks;
  const originalClonedArray = appStateUi.snapshots.dataSnapshot;

  if (!currentList) return;

  removeSelectedTasksHighlightedTasks();

  const tasksToRemoveFromCompletedLIstAfterUndo =
    appStateUi.snapshots.IdsOfSelectedTasks.map((id) =>
      document.querySelector(`[${ATTR.TASK_ITEM}][data-id='${id}']`),
    );

  tasksToRemoveFromCompletedLIstAfterUndo.forEach((task) => task.remove());

  currentList.innerHTML = "";
  appStateUi.snapshots.domSnapshot.forEach((task) =>
    currentList.appendChild(task),
  );

  lists.default.undoSeveralCompletedTasks(
    originalClonedArray,
    originalSubtasks,
    isSectionList,
    sectionList,
  );

  refreshUiAfterUndo();
};
