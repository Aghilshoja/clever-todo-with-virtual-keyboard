import { elements } from "../todos-controller/todos-controller.js";
import { lists } from "../todos-controller/todos-controller.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  DELETION_MODES,
  HIDDEN,
  INACTIVE,
} from "../constants/todo-constants.js";
import { appStateUi } from "./todo-states/states.js";

export const createTaskEmptyState = () => {
  return `
          <li data-empty-state>
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
};

export const handleEmptyTaskStateUi = () => {
  const listContainer = document.querySelector(`
  [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);
  if (lists.default.tasks.length === 0 && lists.default.sections.length === 0) {
    listContainer.innerHTML = createTaskEmptyState();
  }
};

export const removeTogglerBtn = (taskToRemove) => {
  if (taskToRemove && taskToRemove.parentTaskId) {
    const parentOfRemovedTask = document.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${taskToRemove?.parentTaskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    );

    if (parentOfRemovedTask) {
      const descendants = lists.default.getAllDescendants(
        taskToRemove?.parentTaskId,
      );
      if (descendants.length === 0) {
        const subTaskTogglerBtn = parentOfRemovedTask.querySelector(
          `[${ACTIONS.SUBTASK_TOGGLER}]`,
        );
        if (subTaskTogglerBtn)
          subTaskTogglerBtn.dataset[ATTR_STATES.MAIN_SUBTASK_TOGGLER] =
            HIDDEN.SUBTASK_TOGGLER;

        const toolbarsubTaskTogglerEl = parentOfRemovedTask.querySelector(
          `[${ACTIONS.TOOLBAR_SUBTASKS_TOGGLER}]`,
        );

        if (toolbarsubTaskTogglerEl)
          toolbarsubTaskTogglerEl.dataset[ATTR_STATES.TOOLBAR_SUBTASK_TOGGLER] =
            HIDDEN.SUBTASK_TOGGLER;
      }
    }
  }
};

export const deleteTask = (e) => {
  const isSingleTaskDeletion =
    appStateUi.deletionMode === DELETION_MODES.SINGLE;
  if (
    e.target.closest(`[${ACTIONS.CONFIRM_DELETION}]`) &&
    isSingleTaskDeletion
  ) {
    const taskItems = document.querySelectorAll(
      `[${ATTR.TASK_ITEM}][data-id="${appStateUi.taskId}"]`,
    );

    if (taskItems.length === 0) return;

    const sectionItem = taskItems[0].closest(`[${ATTR.SECTION_ITEM}]`);

    const taskToRemove = lists.default.getTask(
      appStateUi.taskId,
      sectionItem?.dataset.id,
    );

    const descendantIds = lists.default
      .getAllDescendants(appStateUi.taskId)
      .map((task) => task.id);

    if (sectionItem) {
      const sectionId = sectionItem.dataset.id;
      if (sectionId) lists.default.deleteTask(appStateUi.taskId, sectionId);
    } else {
      lists.default.deleteTask(appStateUi.taskId);
    }

    elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = INACTIVE.POPUP;
    appStateUi.deletionMode = DELETION_MODES.NONE;

    descendantIds.forEach((id) => {
      const subtasks = document.querySelectorAll(
        `[${ATTR.TASK_ITEM}][data-id="${id}"]`,
      );
      subtasks.forEach((el) => el.remove());
    });
    taskItems.forEach((taskEl) => taskEl.remove());

    removeTogglerBtn(taskToRemove);
  }

  handleEmptyTaskStateUi();
  countTasks();
};

const showSingleTaskDeletionWarning = (e) => {
  const taskItem = e.target.closest(`[${ATTR.TASK_ITEM}]`);
  appStateUi.taskId = taskItem.dataset.id;

  elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = ACTIVE.POPUP;
  const taskEl = taskItem.querySelector(`[${ATTR.MAIN_TASK_TEXT}]`);
  if (!taskEl) return;

  elements.warningMessage.innerHTML = `This will permanently delete "${taskEl.textContent}" and can't be undone`;
  elements.deleteHeading.textContent = "Delete task?";
  appStateUi.deletionMode = DELETION_MODES.SINGLE;
};

export const warnDeletion = (e) => {
  if (e.target.closest(`[${ACTIONS.DELETE}]`)) showSingleTaskDeletionWarning(e);
};

export const closeWarningDeletionPopup = (e) => {
  if (e.target.closest(`[${ACTIONS.CONFIRM_DELETION}]`)) return;
  elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = INACTIVE.POPUP;
  appStateUi.deletionMode = DELETION_MODES.NONE;
};
