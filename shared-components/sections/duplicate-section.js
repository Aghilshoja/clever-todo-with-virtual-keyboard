import { ACTIONS, ATTR } from "../../constants/todo-constants.js";
import { lists } from "../../todos-controller/todos-controller.js";
import { addTaskListeners } from "../listeners/todo-listeners.js";
import { appStateUi } from "../todo-states/states.js";
import {
  truncateSectionDescription,
  truncateSectionName,
} from "../truncate-task.js";
import { updateDOM } from "../utils/task-dom-utils.js";
import { createSection } from "./section-dom-operation.js";

const duplicateSection = (e) => {
  if (!e.target.closest(`[${ACTIONS.DUPLICATE_SECTION}]`)) return;

  const sectionId = e.target.dataset.id;
  if (!sectionId) return;

  const originalSection = document.querySelector(
    `[${ATTR.SECTION_ITEM}][data-id="${sectionId}"]`,
  );
  if (!originalSection) return;

  const { duplicatedSection, idMapping } =
    lists.default.duplicateSection(sectionId);

  appStateUi.sectionObject = duplicatedSection;

  const duplicatedSectionEl = createSection();

  const sectionList = duplicatedSectionEl.querySelector(
    `[${ATTR.SECTION_LIST}]`,
  );

  if (!sectionList) return;

  // Mark original task elements so updateDOM can preserve their DOM order.
  idMapping.forEach((newId, originalId) => {
    const originalEl = originalSection.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${originalId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    );

    if (originalEl) {
      originalEl.dataset.duplicatedId = newId;
    }
  });

  const buildDuplicatedTaskTree = (task) => {
    return updateDOM(task, "duplication");
  };

  for (const task of duplicatedSection.tasks) {
    const taskElement = buildDuplicatedTaskTree(task);
    if (!taskElement) continue;

    if (task.isCompleted) sectionList.appendChild(taskElement);
    else sectionList.prepend(taskElement);
  }

  originalSection
    .querySelectorAll("[data-duplicated-id]")
    .forEach((el) => delete el.dataset.duplicatedId);

  originalSection.after(duplicatedSectionEl);

  truncateSectionDescription();
  truncateSectionName();

  addTaskListeners(sectionList);
};

export { duplicateSection };
