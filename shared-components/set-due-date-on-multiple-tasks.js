import {
  ACTIVE,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  EDIT_MODES,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import { elements, lists } from "../todos-controller/todos-controller.js";
import { updateCalendar } from "./costume-calendar/create-calendar.js";
import {
  initializeDateEditor,
  showDateEditor,
} from "./costume-calendar/prepare-date-editor.js";
import {
  quickDateActions,
  quickDateLabels,
  quickDateVisibility,
} from "./costume-calendar/quick-date-options.js";
import { updateDOM } from "./costume-calendar/update-task-due-date-view.js";
import { ShowUndoStatusLabel } from "./handle-several-tasks-completion-or-uncompletion.js";
import { exitTaskSelection } from "./select-tasks.js";
import { appStateUi } from "./todo-states/states.js";
import { showUndopopup } from "./undo-completed-task.js";
import { takeSnapShotofDomForDueDates } from "./undo-multiple-due-dates.js";

const getSelectedTasksToSetDateOn = () => {
  const selectedTaskItems = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  const taskIds = Array.from(selectedTaskItems).map((el) => el.dataset.id);

  return {
    selectedTaskItems,
    taskIds,
  };
};

const loadCalendar = () => {
  elements.dateContainer.dataset[ATTR_STATES.DATE_CONTAINER] =
    ACTIVE.DATE_CONTAINER;

  quickDateLabels.updateLabels();
};

const getSectionId = () => {
  const { selectedTaskItems } = getSelectedTasksToSetDateOn();
  const taskItem = selectedTaskItems[0];
  if (!taskItem) return;
  const sectionEl = taskItem.closest(`[${ATTR.SECTION_ITEM}]`);
  if (sectionEl && sectionEl.dataset.id) return sectionEl.dataset.id;
};

const showCalendar = () => {
  appStateUi.activeMode = EDIT_MODES.EDIT_MULTIPLE_TASK;
  const { taskIds } = getSelectedTasksToSetDateOn();
  const sectionId = getSectionId();
  appStateUi.sectionId = sectionId;
  for (let i = 0; i < taskIds.length; i++) {
    const task = lists.default.getTask(taskIds[i], sectionId);
    if (task.dueDate === null) {
      appStateUi.hasTime = false;
      appStateUi.draftedDate = null;
      updateCalendar(task);
      break;
    } else {
      appStateUi.draftedDate = new Date(task.dueDate);
      appStateUi.hasTime = task.hasTime;
      updateCalendar(task);
    }
  }
  loadCalendar();
  showDateEditor();
  initializeDateEditor();
  quickDateVisibility.updateQuickDateOptions();
};

const saveMultipleTasksDueDate = () => {
  const { taskIds, selectedTaskItems } = getSelectedTasksToSetDateOn();

  appStateUi.undoOperation.hasTime = appStateUi.hasTime;
  appStateUi.undoOperation.dueDate = appStateUi.draftedDate;

  takeSnapShotofDomForDueDates();

  lists.default.setMultipleDueDates(
    taskIds,
    appStateUi.draftedDate,
    appStateUi.hasTime,
    appStateUi.sectionId,
  );

  selectedTaskItems.forEach((taskEl) => updateDOM(taskEl));

  quickDateActions.closeDateEditor();
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_MULTIPLE_DUE_DATES;
  ShowUndoStatusLabel();
  showUndopopup();
  exitTaskSelection();
};

export { showCalendar, saveMultipleTasksDueDate, getSelectedTasksToSetDateOn };
