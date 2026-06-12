import { getCachedElements } from "./get-cached-element.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  INACTIVE,
} from "../constants/todo-constants.js";

const elements = getCachedElements();

export const handleEmptyTaskStateUi = () => {
  const listContainer = document.querySelector(`
  [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);
  if (lists.default.tasks.length === 0) {
    listContainer.innerHTML = `
          <li>
              <img
              src="photo_2026-02-20_12-00-02.jpg"
              alt="Your inbox is empty"
              class="main-page__empty-state-image"
              width="250"
            />
            <p class="main-page__empty-state-description">
              <strong>Capture now,</strong><strong> Plan later</strong
              ><br />Inbox is your go-to spot for quick task entry.
            </p>
            <p class="main-page__empty-state-description">
              Clear your mind now, organize when you're ready
            </p>
            </li>
    `;
  }
};

export const deleteTask = (e) => {
  if (!elements) throw new Error("Required elemetn was not found");
  if (e.target.closest(`[${ACTIONS.CONFIRM_DELETION}]`)) {
    const taskItem = document.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${appStateUi.taskId}"]`,
    );
    if (taskItem) taskItem.remove();
    lists.default.deleteTask(appStateUi.taskId);
    if (elements.warningPopup)
      elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = INACTIVE.POPUP;
  } else
    elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = INACTIVE.POPUP;

  handleEmptyTaskStateUi();
  countTasks();
  showNumberOfCompletedTasks();
};

export const warnDeletion = (e) => {
  if (e.target.closest(`[${ACTIONS.DELETE}]`)) {
    if (!elements) throw new Error("Required elemetn was not found");
    const taskItem = e.target.closest(`[${ATTR.TASK_ITEM}]`);
    appStateUi.taskId = taskItem.dataset.id;
    if (elements.warningPopup)
      elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = ACTIVE.POPUP;
    const taskEl = taskItem.querySelector(`[${ATTR.MAIN_TASK_TEXT}]`);
    if (!taskEl) return;
    if (elements.warningMessage)
      elements.warningMessage.innerHTML = `This will permanently delete "${taskEl.textContent}" and can't be undone`;
  }
};
