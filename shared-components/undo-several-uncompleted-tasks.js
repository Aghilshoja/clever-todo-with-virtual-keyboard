import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import {
  refreshUiAfterUndo,
  removeSelectedTasksHighlightedTasks,
} from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { appStateUi } from "./todo-states/states.js";

export const undoSeveralUncompletedTasks = () => {
  const currentList = appStateUi.undoOperation.currentList;

  if (!currentList) return;

  removeSelectedTasksHighlightedTasks();

  const taskIds = appStateUi.snapshots.IdsOfSelectedTasks;

  const tasksToRemoveFromActiveListAfterUndo = taskIds.map((id) =>
    document.querySelector(`[${ATTR.TASK_ITEM}][data-id='${id}']`),
  );

  tasksToRemoveFromActiveListAfterUndo.forEach((task) => task.remove());

  currentList.innerHTML = "";
  appStateUi.snapshots.domSnapshot.forEach((task) =>
    currentList.appendChild(task),
  );

  const originalClonedArray = appStateUi.snapshots.dataSnapshot;

  const isSectionList = currentList.hasAttribute(ATTR.SECTION_LIST);

  const sectionList = appStateUi.undoOperation.sectionList;

  lists.default.undoSeveralUncompletedTasks(
    originalClonedArray,
    isSectionList,
    sectionList,
  );

  refreshUiAfterUndo();
};
