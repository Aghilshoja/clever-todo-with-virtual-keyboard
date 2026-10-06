import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import {
  refreshUi,
  removeOriginallySelectedTasks,
  takeSnapshotOfDom,
} from "./handle-several-tasks-completion-or-uncompletion.js";
import { renderTask } from "./render-tasks.js";

const createUncompletedTask = (currentList, uncompletedTasks) => {
  for (const task of uncompletedTasks) {
    const template = document.createElement("ul");
    template.innerHTML = renderTask(task);
    currentList.prepend(template.firstElementChild);
  }
};
export const handleSeveralTasksUncompletion = () => {
  const currentList = takeSnapshotOfDom();

  const selectedTasksInfo = removeOriginallySelectedTasks();
  const { taskIds, selectedTasksLength } = selectedTasksInfo;

  if (!taskIds || !selectedTasksLength) return;

  let uncompletedTasks = null;

  if (currentList.hasAttribute(ATTR.SECTION_LIST)) {
    const sectionItem = currentList.closest(`[${ATTR.SECTION_ITEM}]`);
    if (!sectionItem) return;
    const sectionId = sectionItem.dataset.id;
    if (sectionId) {
      uncompletedTasks = lists.default.uncompleteSeveralTasks(
        taskIds,
        sectionId,
      );
    }

    createUncompletedTask(currentList, uncompletedTasks);
  } else {
    uncompletedTasks = lists.default.uncompleteSeveralTasks(taskIds);
    createUncompletedTask(currentList, uncompletedTasks);
  }

  refreshUi();
};
