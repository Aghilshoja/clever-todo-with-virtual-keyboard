import { lists } from "../todos-controller.js/todos-controller.js";
import { getCompletedListContainer } from "./complete-mode.js";
import { getCachedElements } from "./get-cached-element.js";
import {
  changeUndoPopupLabel,
  refreshUi,
  removeSelectedTasks,
  takeSnapshotOfDom,
} from "./handle-several-tasks-completion-or-uncompletion.js";

const elements = getCachedElements();

export const handleSeveralTasksCompletion = (currentList) => {
  takeSnapshotOfDom(currentList);

  const selectedTasksInfo = removeSelectedTasks(currentList);
  const { taskids, selectedTasksClone, selectedTasksLength } =
    selectedTasksInfo;

  if (!taskids || !selectedTasksClone || !selectedTasksLength) return;

  lists.default.markSeveralTasksAsCompleted(taskids);

  const completedTasksList = getCompletedListContainer();
  const { completedList } = completedTasksList;

  if (!completedList) return;

  selectedTasksClone.forEach((task) => completedList.prepend(task));
  refreshUi();
  changeUndoPopupLabel(currentList, selectedTasksLength);
};
