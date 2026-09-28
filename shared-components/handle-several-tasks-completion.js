import { lists } from "../todos-controller/todos-controller.js";
import {
  createTaskItem,
  getList,
  showEmptyStateWhenNoVisibleTasks,
} from "./complete-mode.js";
import {
  refreshUi,
  removeOriginallySelectedTasks,
  takeSnapshotOfDom,
} from "./handle-several-tasks-completion-or-uncompletion.js";

export const handleSeveralTasksCompletion = () => {
  const tasksContainer = getList();

  if (!tasksContainer) return;

  takeSnapshotOfDom(tasksContainer);

  const selectedTasksInfo = removeOriginallySelectedTasks();
  const { taskIds, selectedTasksLength } = selectedTasksInfo;

  if (!taskIds || !selectedTasksLength) return;

  const completedTasks = lists.default.markSeveralTasksAsCompleted(taskIds);

  for (const task of completedTasks) {
    const taskItem = createTaskItem(task);
    tasksContainer.appendChild(taskItem);
  }

  refreshUi();
  showEmptyStateWhenNoVisibleTasks();
};
