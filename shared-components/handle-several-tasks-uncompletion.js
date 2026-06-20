import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import {
  changeUndoPopupLabel,
  clearActiveTaskContainer,
  refreshUi,
  removeSelectedTasks,
  takeSnapshotOfDom,
} from "./handle-several-tasks-completion-or-uncompletion.js";
import { activeUlId } from "./render-tasks.js";

export const handleSeveralTasksUncompletion = (currentList) => {
  const activeList = clearActiveTaskContainer();
  if (!activeList) return;

  if (lists.default.getTasks().length === 0) activeList.innerHTML = "";

  takeSnapshotOfDom(currentList);

  const selectedTasksInfo = removeSelectedTasks(currentList);
  const { taskids, selectedTasksClone, selectedTasksLength } =
    selectedTasksInfo;

  if (!taskids || !selectedTasksClone || !selectedTasksLength) return;

  lists.default.uncompleteSeveralTasks(taskids);
  selectedTasksClone.forEach((task) => activeList.prepend(task));

  changeUndoPopupLabel(currentList, selectedTasksLength);
  refreshUi();
};
