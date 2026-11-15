import {
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
} from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { exitTaskSelection } from "./select-tasks.js";
import { updateDOM } from "./utils/task-dom-utils.js";

const buildDuplicatedTaskTree = (targetContainer, result) => {
  const { duplicatedTask, idMapping } = result;

  const originalElements = [
    ...targetContainer.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  ].filter((el) => idMapping.has(el.dataset.id));

  // Mark original elements for updateDOM's ordering logic.
  idMapping.forEach((newId, originalId) => {
    const originalEl = originalElements.find(
      (el) => el.dataset.id === originalId,
    );

    if (originalEl) {
      originalEl.dataset.duplicatedId = newId;
    }
  });

  const fragment = updateDOM(duplicatedTask, "duplication");

  const lastOriginalElement = originalElements.at(-1);

  // Clean up temporary attributes.
  originalElements.forEach((el) => {
    delete el.dataset.duplicatedId;
  });

  if (lastOriginalElement) {
    lastOriginalElement.after(fragment);
  }
};

export const duplicateSeveralTasks = () => {
  const selectedTaskElements = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  if (selectedTaskElements.length === 0) return;

  const taskIds = Array.from(selectedTaskElements).map(
    (task) => task.dataset.id,
  );

  const sectionItem = selectedTaskElements[0].closest(`[${ATTR.SECTION_ITEM}]`);

  const sectionId = sectionItem?.dataset.id;

  const targetContainer = sectionItem
    ? sectionItem.querySelector(`[${ATTR.SECTION_LIST}]`)
    : getList();

  if (!targetContainer) return;

  const duplicatedResults = lists.default.duplicateSeveralTasks(
    taskIds,
    sectionId,
  );

  duplicatedResults.forEach((result) => {
    buildDuplicatedTaskTree(targetContainer, result);
  });

  exitTaskSelection();
  countTasks();
};
