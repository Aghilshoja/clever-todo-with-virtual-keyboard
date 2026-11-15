import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import {
  refreshUiAfterUndo,
  removeSelectedTasksHighlightedTasks,
} from "./handle-several-completed-and-uncompleted-tasks-undo.js";
import { appStateUi } from "./todo-states/states.js";

export const undoSeveralUncompletedTasks = () => {
  const currentList = appStateUi.undoOperation.currentList;

  if (!currentList) return;

  removeSelectedTasksHighlightedTasks();

  currentList.innerHTML = "";

  appStateUi.snapshots.domSnapshot.forEach((task) =>
    currentList.appendChild(task),
  );

  const originalTasks = appStateUi.snapshots.dataSnapshot;
  const originalSubtasks = appStateUi.snapshots.subtasks;

  const isSectionList = currentList.hasAttribute(ATTR.SECTION_LIST);
  const sectionList = appStateUi.undoOperation.sectionList;

  lists.default.undoSeveralUncompletedTasks(
    originalTasks,
    originalSubtasks,
    isSectionList,
    sectionList,
  );

  refreshUiAfterUndo();
};
