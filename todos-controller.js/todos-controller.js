import { TaskList } from "../todos-model/todos-model.js";
import { renderTasks, activeUlId } from "../shared-components/render-tasks.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";
import { addTask } from "../shared-components/add-task.js";
import { highlighActiveList } from "../shared-components/highlight-active-list.js";
import {
  revealToolbar,
  revealManu,
} from "../shared-components/reveal-toolbar.js";
import { closeToolbar } from "../shared-components/closeToolbarOnPageClick.js";
import { uupdatePaddingOfListDynamicallyBasedOnBottomNavbar } from "../shared-components/apply-padding-to-lists-based-on-nvas-offsetHeight.js";
import {
  warnDeletion,
  deleteTask,
  closeWarningDeletionPopup,
} from "../shared-components/delete-mode.js";
import { duplicateTask } from "../shared-components/duplicate-mode.js";
import { implementEditAndDescriptionMode } from "../shared-components/handle-edit-and-description-modes.js";
import { saveEditedTask } from "../shared-components/handle-edit-and-description-modes.js";
import { editDescriptionAndTask } from "../shared-components/dom-operations/operation-on-dom-on-switch-between-edit-and-description-modes.js";
import {
  truncateTaskDescription,
  truncateTaskText,
} from "../shared-components/truncate-task.js";
import {
  completeTask,
  showNumberOfCompletedTasks,
} from "../shared-components/complete-mode.js";
import { handleUndoCompletingAndUncompleting } from "../shared-components/undo-completed-task.js";
import { moveTaskFromCompletedToActive } from "../shared-components/move-task-rrom-completed-to-active.js";
import {
  dragStart,
  dragOver,
  draggedEnter,
  draggedLeave,
  dropTarget,
  draggedEndTask,
} from "../shared-components/drag-and-drop.js";
import {
  toggleBatchOptions,
  triggerTaskSelectionUi,
  selectTasks,
  toggleOptionsOfSelectedTasks,
  handleExitSelectionClick,
  toggleSelectionBarMenu,
} from "../shared-components/select-tasks.js";
import {
  ADD_TASK_MODE,
  ATTR,
  DELETION_MODES,
  EDIT_MODES,
  SELECTION_BAR,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import {
  deleteSeveralTasks,
  showSeveralTasksWarning,
} from "../shared-components/delete-several-tasks.js";
import { duplicateSeveralTasks } from "../shared-components/duplicate-several-tasks.js";
import { handleSeveralTasksCompletionOrUncompletion } from "../shared-components/handle-several-tasks-completion-or-uncompletion.js";
import { handleMultipleTasksUndo } from "../shared-components/handle-several-completed-and-uncompleted-tasks-undo.js";
import { openKeyboardToAddATask } from "../shared-components/add-task-relative-to-selected-task.js";
import {
  decrementYearAndMonth,
  incrementYearAndMonth,
} from "../shared-components/costume-calendar/navigate-month.js";
import { exitEditMode } from "../shared-components/handle-edit-and-description-modes.js";
import { selectDate } from "../shared-components/costume-calendar/handle-date-selection.js";
import {
  handleExitEditingTaskDateOrDateMode,
  openTaskCalendar,
  showCostumeCalendar,
} from "../shared-components/costume-calendar/calendar-controller.js";
import { saveTaskDueDate } from "../shared-components/save-task-due-date.js";
import {
  quickDateActions,
  quickDateLabels,
} from "../shared-components/costume-calendar/quick-date-options.js";
import { markTaskAsDue } from "../shared-components/costume-calendar/mark-task-due.js";
import { registerServiceWorker } from "../service-worker/register-service-worker.js";
import {
  buildClockUI,
  cancelTimeSelection,
  decideTimePeriod,
  restoreClockView,
  saveTime,
  selectTimeByManulType,
  updateClockDisplay,
} from "../shared-components/costume-clock/clock-controller.js";
import {
  renderHours,
  renderMinutes,
} from "../shared-components/costume-clock/clock-view-mode.js";
import { showCalendar } from "../shared-components/set-due-date-on-multiple-tasks.js";

registerServiceWorker();

export const elements = getCachedElements();

export const lists = {
  default: new TaskList("default"),
};

export const appStateUi = {
  taskId: null,
  activeMode: EDIT_MODES.NO_MODES,
  taskObjectToEdit: null,
  lastClickedElement: {
    lastEl: null,
    updatedInput: null,
  },
  undoOperation: {
    previousEl: null,
    nextEl: null,
    removedEl: null,
    taskObject: null,
    taskObjectIndex: null,
    originalTaskObject: null,
    undoType: UNDO_STATES.NO_UNDO,
    hasTime: null,
    dueDate: null,
  },
  taskSelectionMode: SELECTION_BAR.ACTIVE_LIST,
  selectedTasksCounter: 0,
  deletionMode: DELETION_MODES,
  // snapshots are used for undo operation
  snapshots: {
    domSnapshot: null,
    dataSnapshot: null,
    IdsOfSelectedTasks: null,
  },
  addTaskModes: ADD_TASK_MODE.REGULAR,
  draftedDate: null,
  hasTime: null,
  timeRemoval: false,
  activeTaskId: null,
  currentMinute: 0,
  currentHour: 12,
  originalHour: null,
  originalMinute: null,
};

const handleListChange = (eachTask, listChange) => {
  if (listChange.id !== activeUlId.ul) return;

  renderTasks(listChange.getTasks(), eachTask);
};

lists.default.subscribe(TaskList.EVENTS.RENDER_TASK, handleListChange);
lists.default.subscribe(TaskList.EVENTS.MARK_TASK_AS_DUE, markTaskAsDue);

lists.default.initializeNotifications();

export const addListeners = (list) => {
  list.addEventListener("click", revealManu);
  list.addEventListener("click", revealToolbar);
  list.addEventListener("click", closeToolbar);
  list.addEventListener("click", warnDeletion);
  list.addEventListener("click", duplicateTask);
  list.addEventListener("click", implementEditAndDescriptionMode);
  list.addEventListener("click", saveEditedTask);
  list.addEventListener("click", editDescriptionAndTask);
  list.addEventListener("click", exitEditMode);
  list.addEventListener("click", completeTask);
  list.addEventListener("click", moveTaskFromCompletedToActive);
  list.addEventListener("click", selectTasks);
  list.addEventListener("click", showCostumeCalendar);
};

const addDragAndDropListeners = (list) => {
  list.addEventListener("dragstart", dragStart);
  list.addEventListener("dragover", dragOver);
  list.addEventListener("dragenter", draggedEnter);
  list.addEventListener("dragleave", draggedLeave);
  list.addEventListener("drop", dropTarget);
  list.addEventListener("dragend", draggedEndTask);
};

const initTodo = () => {
  highlighActiveList();

  const listContainer = document.querySelector(`
  [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);
  if (!listContainer) return;
  const nextElementSibling = listContainer.nextElementSibling;
  if (!nextElementSibling) return;
  const completedList = nextElementSibling.querySelector("ul");
  if (!completedList) return;
  addListeners(listContainer);
  addListeners(completedList);
  addDragAndDropListeners(listContainer);
  addDragAndDropListeners(completedList);
  elements.warningPopup.addEventListener("click", deleteTask);
  elements.undoCompletedTask.addEventListener(
    "click",
    handleUndoCompletingAndUncompleting,
  );
  elements.undoCompletedTask.addEventListener("click", handleMultipleTasksUndo);

  document.addEventListener("click", toggleBatchOptions);
  document.addEventListener("click", toggleSelectionBarMenu);
  elements.dropDownList.addEventListener("click", triggerTaskSelectionUi);
  document.addEventListener("click", toggleOptionsOfSelectedTasks);
  elements.selectionBar.addEventListener("click", handleExitSelectionClick);
  elements.batchDeleteTasks.addEventListener("click", showSeveralTasksWarning);
  elements.batchDuplicateTasks.addEventListener("click", duplicateSeveralTasks);
  elements.batchCompletedTasks.addEventListener(
    "click",
    handleSeveralTasksCompletionOrUncompletion,
  );
  elements.warningPopup.addEventListener("click", deleteSeveralTasks);
  elements.warningPopup.addEventListener("click", closeWarningDeletionPopup);

  elements.selectionBarMenu.addEventListener("click", openKeyboardToAddATask);

  elements.nextMonthBtn.addEventListener("click", incrementYearAndMonth);
  elements.previousMonthBtn.addEventListener("click", decrementYearAndMonth);

  elements.calendarContainer.addEventListener("click", selectDate);

  elements.dateContainer.addEventListener(
    "click",
    handleExitEditingTaskDateOrDateMode,
  );

  elements.saveTaskDate.addEventListener("click", saveTaskDueDate);

  elements.todayBtn.addEventListener(
    "click",
    quickDateActions.handleTodaySelection,
  );

  elements.tomorrowBtn.addEventListener(
    "click",
    quickDateActions.handleTomorrowSelection,
  );

  elements.nextWeekBtn.addEventListener(
    "click",
    quickDateActions.handleNextWeekSelection,
  );

  elements.noDateBtn.addEventListener("click", quickDateActions.handleNoDate);

  elements.removeTimeBtn.addEventListener(
    "click",
    quickDateLabels.syncQuickDateOptions,
  );

  elements.addTimeBtn.addEventListener("click", buildClockUI);
  elements.timeHoursEl.addEventListener("click", renderHours);
  elements.timeMinutesEl.addEventListener("click", renderMinutes);
  elements.cancelTime.addEventListener("click", cancelTimeSelection);
  elements.clockFace.addEventListener("pointerdown", updateClockDisplay);
  elements.clockFace.addEventListener("pointermove", updateClockDisplay);
  elements.clockFace.addEventListener("pointerup", updateClockDisplay);
  document.addEventListener("click", decideTimePeriod);
  elements.keyboardBtn.addEventListener("click", selectTimeByManulType);
  elements.clockBtn.addEventListener("click", restoreClockView);
  elements.saveTimeBtn.addEventListener("click", saveTime);

  elements.batchDueDateBtn.addEventListener("click", showCalendar);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      const taskId = event.data.taskId;
      if (!taskId) return;
      appStateUi.activeTaskId = taskId;
      openTaskCalendar();
    });
  }

  // Navigation Click
  elements.navigation.addEventListener("click", (e) => {
    const listBtn = e.target.closest("[data-id]");
    if (!listBtn) return;

    activeUlId.ul = listBtn.dataset.id;

    if (!lists[activeUlId.ul]) return;

    renderTasks(lists.default.getTasks());
  });

  elements.submitTask.addEventListener("click", addTask);

  document.addEventListener("DOMContentLoaded", () => {
    uupdatePaddingOfListDynamicallyBasedOnBottomNavbar(listContainer);
    truncateTaskText();
    truncateTaskDescription();
  });

  // Update padding whenever the navbar resizes
  const resizeObserver = new ResizeObserver((entries) => {
    uupdatePaddingOfListDynamicallyBasedOnBottomNavbar(listContainer);
    truncateTaskText();
    truncateTaskDescription();
  });

  resizeObserver.observe(document.body);
};

initTodo();
