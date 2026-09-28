import { lists } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import {
  refreshUi,
  removeOriginallySelectedTasks,
  takeSnapshotOfDom,
} from "./handle-several-tasks-completion-or-uncompletion.js";
import { renderTask } from "./render-tasks.js";

export const handleSeveralTasksUncompletion = () => {
  const tasksContainer = getList();

  if (!tasksContainer) return;

  takeSnapshotOfDom(tasksContainer);

  const selectedTasksInfo = removeOriginallySelectedTasks();
  const { taskIds, selectedTasksLength } = selectedTasksInfo;

  if (!taskIds || !selectedTasksLength) return;

  const uncompletedTasks = lists.default.uncompleteSeveralTasks(taskIds);

  for (const task of uncompletedTasks) {
    const template = document.createElement("div");
    template.innerHTML = renderTask(task);
    tasksContainer.prepend(template.firstElementChild);
  }

  refreshUi();
};
