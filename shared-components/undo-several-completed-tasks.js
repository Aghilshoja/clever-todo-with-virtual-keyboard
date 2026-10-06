import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import {
  refreshUiAfterUndo,
  removeSelectedTasksHighlightedTasks,
} from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { appStateUi } from "./todo-states/states.js";

export const undoSeveralCompletedTasks = () => {
  const currentList = appStateUi.undoOperation.currentList;

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

  const originalClonedArray = appStateUi.snapshots.dataSnapshot;

  const isSectionList = currentList.hasAttribute(ATTR.SECTION_LIST);

  const sectionList = appStateUi.undoOperation.sectionList;

  lists.default.undoSeveralCompletedTasks(
    originalClonedArray,
    isSectionList,
    sectionList,
  );

  refreshUiAfterUndo();
};
