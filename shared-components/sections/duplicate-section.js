import { ACTIONS, ATTR } from "../../constants/todo-constants.js";
import { lists } from "../../todos-controller/todos-controller.js";
import { createTaskItem } from "../complete-mode.js";
import { addTaskListeners } from "../listeners/todo-listeners.js";
import { renderTask } from "../render-tasks.js";
import { appStateUi } from "../todo-states/states.js";
import {
  truncateSectionDescription,
  truncateSectionName,
} from "../truncate-task.js";
import { createSection } from "./section-dom-operation.js";

const duplicateSection = (e) => {
  if (!e.target.closest(`[${ACTIONS.DUPLICATE_SECTION}]`)) return;
  const sectionId = e.target.dataset.id;
  if (!sectionId) return;

  const originalSection = document.querySelector(
    `[${ATTR.SECTION_ITEM}][data-id="${sectionId}"]`,
  );
  if (!originalSection) return;

  const duplicatedSection = lists.default.duplicateSection(sectionId);
  appStateUi.sectionObject = duplicatedSection;

  const duplicatedSectionEl = createSection();

  const sectionList = duplicatedSectionEl.querySelector(
    `[${ATTR.SECTION_LIST}]`,
  );

  if (!sectionList) return;

  for (const task of duplicatedSection.tasks) {
    if (task.isCompleted) {
      sectionList.appendChild(createTaskItem(task));
    } else {
      const template = document.createElement("div");
      template.innerHTML = renderTask(task);
      sectionList.prepend(template.firstElementChild);
    }
  }

  originalSection.after(duplicatedSectionEl);
  truncateSectionDescription();
  truncateSectionName();

  addTaskListeners(sectionList);
};

export { duplicateSection };
