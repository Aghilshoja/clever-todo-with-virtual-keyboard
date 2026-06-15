import {
  ACTIONS,
  ACTIVE,
  ATTR_STATES,
  CHECK_STATES,
  DELETION_MODES,
  HIGHLIGHT_SELECTED_TASK,
  INACTIVE,
} from "../constants/todo-constants.js";
import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import { getCachedElements } from "./get-cached-element.js";
import { exitTaskSelection } from "./select-tasks.js";

const elements = getCachedElements();

export const showSeveralTasksWarning = () => {
  const selectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  if (selectedTasks.length === 0) return;
  if (
    !elements.deleteHeading ||
    !elements.warningPopup ||
    !elements.deleteHeading
  )
    return;
  elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = ACTIVE.POPUP;
  elements.deleteHeading.textContent = `Delete ${selectedTasks.length} tasks ?`;
  elements.warningMessage.textContent = `This will permanently delete these tasks and can't be undo`;
  appStateUi.deletionMode = DELETION_MODES.BATCH;
};

export const deleteSeveralTasks = (e) => {
  const isSeveralTaskDeletion =
    appStateUi.deletionMode === DELETION_MODES.BATCH;
  if (
    e.target.closest(`[${ACTIONS.CONFIRM_DELETION}]`) &&
    isSeveralTaskDeletion
  ) {
    const selectedTaskElements = document.querySelectorAll(
      `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
    );

    if (selectedTaskElements.length === 0) return;

    const taskIds = Array.from(selectedTaskElements).map(
      (task) => task.dataset.id,
    );

    lists.default.deleteSeveralTasks(taskIds);

    selectedTaskElements.forEach((selectedTask) => selectedTask.remove());
    appStateUi.selectedTasksCounter = 0;
    appStateUi.deletionMode = DELETION_MODES.NONE;
    if (elements.warningPopup)
      elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = INACTIVE.POPUP;
    exitTaskSelection();
    handleEmptyTaskStateUi();
    countTasks();
    showNumberOfCompletedTasks();
  }
};
