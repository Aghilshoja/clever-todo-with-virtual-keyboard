import { KEYBOARD_STATES } from "../../constants/keyboard-constants.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  DUE_DATE_STATES,
  EDIT_MODES,
  INACTIVE,
  UNDO_STATES,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import {
  appStateUi,
  elements,
  lists,
} from "../../todos-controller.js/todos-controller.js";
import { duplicateSeveralTasks } from "../duplicate-several-tasks.js";
import { getCachedElements } from "../get-cached-element.js";
import { ShowUndoStatusLabel } from "../handle-several-tasks-completion-or-uncompletion.js";
import { exitTaskSelection } from "../select-tasks.js";
import { getSelectedTasksToSetDateOn } from "../set-due-date-on-multiple-tasks.js";
import { showUndopopup } from "../undo-completed-task.js";
import { takeSnapShotofDomForDueDates } from "../undo-multiple-due-dates.js";
import { daysOfWeek, months, requiredDates } from "./create-calendar.js";
import { exitDateMode, exitEditingDate } from "./exit-date-picker.js";
import { formatTimeDisplay } from "./parse-time.js";
import { format24HourTime } from "./prepare-date-editor.js";
import { getTaskItem } from "./update-task-due-date-view.js";

const quickDateLabels = {
  setTodayLabel() {
    const today = daysOfWeek[requiredDates.refNow.getDay()];

    const dueDate = appStateUi.draftedDate;

    if (appStateUi.hasTime) {
      elements.todayTimeLabel.textContent = `${formatTimeDisplay(
        dueDate.getHours(),
        dueDate.getMinutes(),
      )}`;
      quickDateLabels.toggleTimeLabelVisibility(ACTIVE.REMOVE_TASK_TIME);
    } else {
      quickDateLabels.toggleTimeLabelVisibility(INACTIVE.REMOVE_TASK_TIME);
      elements.todayLabel.textContent = today;
    }
  },

  setTomorrowLabel() {
    const tomorrowIndex = (requiredDates.refNow.getDay() + 1) % 7;
    const tomorrow = daysOfWeek[tomorrowIndex];

    const dueDate = appStateUi.draftedDate;

    if (appStateUi.hasTime) {
      elements.tomorrowTimeLabel.textContent = `${formatTimeDisplay(
        dueDate.getHours(),
        dueDate.getMinutes(),
      )}`;
      quickDateLabels.toggleTimeLabelVisibility(ACTIVE.REMOVE_TASK_TIME);
    } else {
      quickDateLabels.toggleTimeLabelVisibility(INACTIVE.REMOVE_TASK_TIME);
      elements.tomorrowLabel.textContent = tomorrow;
    }
  },

  setNextWeekLabel() {
    const today = new Date();
    const todayIndex = today.getDay();

    const MONDAY_INDEX = 1;

    let daysUntilMonday = MONDAY_INDEX - todayIndex;

    if (daysUntilMonday < 0) {
      daysUntilMonday += 7;
    }

    today.setDate(today.getDate() + daysUntilMonday);
    const dueDate = appStateUi.draftedDate;

    if (appStateUi.hasTime) {
      elements.nextWeekTimeLabel.textContent =
        quickDateLabels.renderNextWeekWithTime(today, dueDate);
      quickDateLabels.toggleTimeLabelVisibility(ACTIVE.REMOVE_TASK_TIME);
    } else {
      quickDateLabels.toggleTimeLabelVisibility(INACTIVE.REMOVE_TASK_TIME);
      elements.nextWeekLabel.textContent =
        quickDateLabels.renderNextWeekWithoutTime(today);
    }
  },

  setAddTimeBtnLabel() {
    const dueDate = appStateUi.draftedDate;

    if (appStateUi.hasTime) {
      elements.addTimeBtn.innerHTML = `${format24HourTime(
        dueDate.getHours(),
        dueDate.getMinutes(),
      )}`;

      elements.removeTimeBtn.dataset[ATTR_STATES.REMOVE_TASK_TIME] =
        ACTIVE.REMOVE_TASK_TIME;
    } else {
      elements.addTimeBtn.innerHTML = "Add time";

      elements.removeTimeBtn.dataset[ATTR_STATES.REMOVE_TASK_TIME] =
        INACTIVE.REMOVE_TASK_TIME;
    }
  },

  removeTimeFromTextEditor() {
    const currentYear = new Date().getFullYear();

    const formatDueDate = `${months[requiredDates.navMonth]} ${requiredDates.navDate} ${
      requiredDates.navYear === currentYear ? "" : requiredDates.navYear
    }`;

    delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];

    virtualKeyboard.caretManeger.text = formatDueDate;
    virtualKeyboard.caretManeger.caretPosition = formatDueDate.length;

    const caret = ensureCaret(elements.inputElement);

    updateTextEditor(elements.inputElement, caret);
  },

  syncQuickDateOptions() {
    const taskDueDate =
      appStateUi.draftedDate === null
        ? new Date()
        : new Date(appStateUi.draftedDate);
    appStateUi.draftedDate = taskDueDate;

    if (appStateUi.hasTime) {
      appStateUi.hasTime = false;
      quickDateLabels.setTodayLabel();
      quickDateLabels.setTomorrowLabel();
      quickDateLabels.setNextWeekLabel();
      quickDateLabels.removeTimeFromTextEditor();
      quickDateLabels.removeTime();
    }
  },

  removeTime() {
    elements.addTimeBtn.innerHTML = "Add time";

    elements.removeTimeBtn.dataset[ATTR_STATES.REMOVE_TASK_TIME] =
      INACTIVE.REMOVE_TASK_TIME;
  },

  renderNextWeekWithTime(today, dueDate) {
    return ` ${formatTimeDisplay(dueDate.getHours(), dueDate.getMinutes())}`;
  },

  renderNextWeekWithoutTime(today) {
    return `${daysOfWeek[today.getDay()]} (${months[today.getMonth()]} ${today.getDate()})`;
  },

  toggleTimeLabelVisibility(toggleVisibility) {
    elements.toggleTimeVisibility.forEach((el) => {
      el.dataset[ATTR_STATES.REMOVE_TASK_TIME] = toggleVisibility;
    });
  },

  updateLabels() {
    quickDateLabels.setTodayLabel();
    quickDateLabels.setTomorrowLabel();
    quickDateLabels.setNextWeekLabel();
    quickDateLabels.setAddTimeBtnLabel();
  },
};

const quickDateVisibility = {
  isSameCalendarDay(taskDate, targetDate) {
    return (
      taskDate.getFullYear() === targetDate.getFullYear() &&
      taskDate.getMonth() === targetDate.getMonth() &&
      taskDate.getDate() === targetDate.getDate()
    );
  },

  isToday() {
    const taskDueDate = new Date(appStateUi.draftedDate);

    const now = new Date();

    return quickDateVisibility.isSameCalendarDay(taskDueDate, now);
  },

  isTomorrow() {
    const taskDueDate =
      appStateUi.draftedDate === null
        ? new Date()
        : new Date(appStateUi.draftedDate);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return quickDateVisibility.isSameCalendarDay(taskDueDate, tomorrow);
  },

  isNextWeek() {
    const taskDueDate =
      appStateUi.draftedDate === null
        ? new Date()
        : new Date(appStateUi.draftedDate);
    const nextMonday = new Date();
    const todayIndex = nextMonday.getDay();

    const MONDAY_INDEX = 1;

    let daysUntilMonday = MONDAY_INDEX - todayIndex;

    if (daysUntilMonday < 0) {
      daysUntilMonday += 7;
    }

    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);

    return quickDateVisibility.isSameCalendarDay(taskDueDate, nextMonday);
  },

  toggleNoDateBtnVisibility() {
    if (appStateUi.draftedDate === null) {
      elements.noDateBtnContainer.dataset[ATTR_STATES.NO_DATE_CONTAINER] =
        INACTIVE.NO_DATE_CONTAINER;
    } else {
      elements.noDateBtnContainer.dataset[ATTR_STATES.NO_DATE_CONTAINER] =
        ACTIVE.NO_DATE_CONTAINER;
    }
  },

  toggleTodayOption() {
    const validateToday = quickDateVisibility.isToday();
    if (validateToday) {
      elements.todayContainer.dataset[ATTR_STATES.TODAY_CONTAINER] =
        INACTIVE.TODAY_CONTAINER;
    } else {
      elements.todayContainer.dataset[ATTR_STATES.TODAY_CONTAINER] =
        ACTIVE.TODAY_CONTAINER;
    }
  },

  toggleTomorrowOption() {
    const validateTomorrow = quickDateVisibility.isTomorrow();

    if (validateTomorrow) {
      elements.tomorrowContainer.dataset[ATTR_STATES.TOMORROW_CONTAINER] =
        INACTIVE.TOMORROW_CONTAINER;
    } else {
      elements.tomorrowContainer.dataset[ATTR_STATES.TOMORROW_CONTAINER] =
        ACTIVE.TOMORROW_CONTAINER;
    }
  },

  toggleNextWeekOption() {
    const validateNextWeek = quickDateVisibility.isNextWeek();

    if (validateNextWeek) {
      elements.nextWeekContainer.dataset[ATTR_STATES.NEXT_WEEK_CONTAINER] =
        INACTIVE.NEXT_WEEK_CONTAINER;
    } else {
      elements.nextWeekContainer.dataset[ATTR_STATES.NEXT_WEEK_CONTAINER] =
        ACTIVE.NEXT_WEEK_CONTAINER;
    }
  },

  updateQuickDateOptions() {
    quickDateVisibility.toggleNoDateBtnVisibility();
    quickDateVisibility.toggleTodayOption();
    quickDateVisibility.toggleTomorrowOption();
    quickDateVisibility.toggleNextWeekOption();
  },
};

const quickDateActions = {
  getToday() {
    const today = new Date();

    return today;
  },

  getTomorrow() {
    const tomorrow = new Date();
    const TOMORROW = 1;

    tomorrow.setDate(tomorrow.getDate() + TOMORROW);

    return tomorrow;
  },

  getNextWeek() {
    const nextWeekDueDate = new Date();
    const todayIndex = nextWeekDueDate.getDay();

    const MONDAY_INDEX = 1;

    let daysUntilMonday = MONDAY_INDEX - todayIndex;

    if (daysUntilMonday < 0) {
      daysUntilMonday += 7;
    }

    nextWeekDueDate.setDate(nextWeekDueDate.getDate() + daysUntilMonday);

    return nextWeekDueDate;
  },

  renderNoDateLabel(dueDateEls) {
    dueDateEls.forEach((dateEl) => {
      dateEl.dataset[ATTR_STATES.TASK_DUE_STATE] = "";
      if (dateEl.hasAttribute(ATTR.VISIBLE_DUE_DATE)) dateEl.textContent = "";
      else
        dateEl.innerHTML = `<i class="fa fa-calendar" aria-hidden="true"></i> Date`;
    });
  },

  renderDueDateLabel(dueDateEls, taskDueDate) {
    if (taskDueDate) {
      const time = formatTimeDisplay(
        taskDueDate.getHours(),
        taskDueDate.getMinutes(),
      );

      dueDateEls.forEach((dateEl) => {
        dateEl.dataset[ATTR_STATES.TASK_DUE_STATE] = DUE_DATE_STATES.UPCOMING;
        dateEl.innerHTML = `<i class="fa fa-calendar" aria-hidden="true"></i> ${daysOfWeek[taskDueDate.getDay()]}  ${months[taskDueDate.getMonth()]} ${taskDueDate.getDate()} ${time}`;
      });
    }
  },

  updateTaskDate(taskItem, taskDueDate) {
    const dueDateEls = taskItem.querySelectorAll(
      `[${ACTIONS.TASK_DATE}], [${ATTR.VISIBLE_DUE_DATE}]`,
    );

    if (taskDueDate)
      quickDateActions.renderDueDateLabel(dueDateEls, taskDueDate);
    else quickDateActions.renderNoDateLabel(dueDateEls);
  },

  checkIfUsersPickedTime(dueDate) {
    if (appStateUi.hasTime) {
      dueDate.setHours(
        appStateUi.draftedDate.getHours(),
        appStateUi.draftedDate.getMinutes(),
        0,
        0,
      );
    } else {
      dueDate.setHours(23, 59, 0, 0);
    }

    return dueDate;
  },

  closeDateEditor() {
    exitDateMode();
    exitEditingDate();
  },

  applyQuickDateSelection(dueDate) {
    const { taskId, taskItem } = getTaskItem();
    const setDueDateTime = quickDateActions.checkIfUsersPickedTime(dueDate);
    appStateUi.hasTime = true;
    lists.default.setDueDate(taskId, setDueDateTime, appStateUi.hasTime);
    quickDateActions.updateTaskDate(taskItem, setDueDateTime);
    quickDateActions.closeDateEditor();
  },

  applyQuickDateToSelectedTasks(dueDate) {
    const setDueDateTime = quickDateActions.checkIfUsersPickedTime(dueDate);
    appStateUi.hasTime = true;
    const { taskIds, selectedTaskItems } = getSelectedTasksToSetDateOn();

    takeSnapShotofDomForDueDates();

    lists.default.setMultipleDueDates(
      taskIds,
      setDueDateTime,
      appStateUi.hasTime,
    );

    selectedTaskItems.forEach((taskEl) =>
      quickDateActions.updateTaskDate(taskEl, setDueDateTime),
    );
    quickDateActions.closeDateEditor();
    appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_MULTIPLE_DUE_DATES;
    appStateUi.undoOperation.dueDate = setDueDateTime;
    appStateUi.undoOperation.hasTime = appStateUi.hasTime;
    ShowUndoStatusLabel();
    showUndopopup();
    exitTaskSelection();
  },

  applyQuickDateByMode(dueDate) {
    if (appStateUi.activeMode === EDIT_MODES.EDIT_MULTIPLE_TASK) {
      quickDateActions.applyQuickDateToSelectedTasks(dueDate);
    } else {
      quickDateActions.applyQuickDateSelection(dueDate);
    }
  },

  handleTodaySelection() {
    const todayDueDate = quickDateActions.getToday();
    quickDateActions.applyQuickDateByMode(todayDueDate);
  },

  handleTomorrowSelection() {
    const tomorrowDueDate = quickDateActions.getTomorrow();
    quickDateActions.applyQuickDateByMode(tomorrowDueDate);
  },

  handleNextWeekSelection() {
    const nextWeekDueDate = quickDateActions.getNextWeek();
    quickDateActions.applyQuickDateByMode(nextWeekDueDate);
  },

  handleNoDate() {
    if (appStateUi.activeMode === EDIT_MODES.EDIT_MULTIPLE_TASK) {
      const { taskIds, selectedTaskItems } = getSelectedTasksToSetDateOn();

      for (let i = 0; i < taskIds.length; i++) {
        const task = lists.default.getTask(taskIds[i]);
        task.hasTime = false;
        task.dueDate = null;
      }
      selectedTaskItems.forEach((taskEl) =>
        quickDateActions.updateTaskDate(taskEl),
      );
      exitTaskSelection();
    } else {
      const { taskItem, taskId } = getTaskItem();
      const taskObject = lists.default.getTask(taskId);
      taskObject.dueDate = null;
      taskObject.hasTime = false;

      quickDateActions.updateTaskDate(taskItem);
    }
    quickDateActions.closeDateEditor();
  },
};

const getTaskObject = () => {
  const { taskId } = getTaskItem();

  const task = lists.default.getTask(taskId);

  return task;
};

export {
  quickDateLabels,
  getTaskObject,
  quickDateVisibility,
  quickDateActions,
};
