import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import {
  createTaskItem,
  showEmptyStateWhenNoVisibleTasks,
} from "./complete-mode.js";
import {
  refreshUi,
  removeOriginallySelectedTasks,
  takeSnapshotOfDom,
} from "./handle-several-tasks-completion-or-uncompletion.js";

const createCompletedTask = (currentList, completedTasks) => {
  for (const task of completedTasks) {
    const taskItem = createTaskItem(task);
    currentList.appendChild(taskItem);
  }
};

export const handleSeveralTasksCompletion = () => {
  const currentList = takeSnapshotOfDom();

  const selectedTasksInfo = removeOriginallySelectedTasks();
  const { taskIds, selectedTasksLength } = selectedTasksInfo;

  if (!taskIds || !selectedTasksLength) return;

  let completedTasks = null;

  if (currentList.hasAttribute(ATTR.SECTION_LIST)) {
    const sectionItem = currentList.closest(`[${ATTR.SECTION_ITEM}]`);
    if (!sectionItem) return;
    const sectionId = sectionItem.dataset.id;
    if (sectionId) {
      completedTasks = lists.default.markSeveralTasksAsCompleted(
        taskIds,
        sectionId,
      );
    }

    createCompletedTask(currentList, completedTasks);
  } else {
    completedTasks = lists.default.markSeveralTasksAsCompleted(taskIds);
    createCompletedTask(currentList, completedTasks);
  }

  refreshUi();
  showEmptyStateWhenNoVisibleTasks();
};
