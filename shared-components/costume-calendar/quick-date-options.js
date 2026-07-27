import { KEYBOARD_STATES } from "../../constants/keyboard-constants.js";
import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  DUE_DATE_STATES,
  EDIT_MODES,
  INACTIVE,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import {
  appStateUi,
  lists,
} from "../../todos-controller.js/todos-controller.js";
import { duplicateSeveralTasks } from "../duplicate-several-tasks.js";
import { getCachedElements } from "../get-cached-element.js";
import { daysOfWeek, months, requiredDates } from "./create-calendar.js";
import { exitDateMode, exitEditingDate } from "./exit-date-picker.js";
import { formatTimeDisplay } from "./parse-time.js";
import { format24HourTime } from "./prepare-date-editor.js";
import { getTaskItem } from "./update-task-due-date-view.js";

const elements = getCachedElements();

const quickDateLabels = {
  setTodayLabel() {
    if (!elements.todayLabel) return;

    const today = daysOfWeek[requiredDates.refNow.getDay()];
    const task = getTaskObject();
    const date = new Date(task.dueDate);

    if (appStateUi.hasTime) {
      elements.todayTimeLabel.textContent = `${formatTimeDisplay(
        date.getHours(),
        date.getMinutes(),
      )}`;
      quickDateLabels.toggleTimeLabelVisibility(ACTIVE.REMOVE_TASK_TIME);
    } else {
      quickDateLabels.toggleTimeLabelVisibility(INACTIVE.REMOVE_TASK_TIME);
      elements.todayLabel.textContent = today;
    }
  },

  setTomorrowLabel() {
    if (!elements.tomorrowLabel) return;

    const tomorrowIndex = (requiredDates.refNow.getDay() + 1) % 7;
    const tomorrow = daysOfWeek[tomorrowIndex];

    const task = getTaskObject();
    const date = new Date(task.dueDate);

    if (task.hasTime) {
      elements.tomorrowTimeLabel.textContent = `${formatTimeDisplay(
        date.getHours(),
        date.getMinutes(),
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

    const task = getTaskObject();
    const dueDate = new Date(task.dueDate);

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
    if (!elements.addTimeBtn) return;

    const task = getTaskObject();
    const dueDate = new Date(task.dueDate);

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

  perserveTime(year, month, day) {
    const task = getTaskObject();

    if (!task) return false;

    const preservedTime = new Date(task.dueDate);

    const caret = ensureCaret(elements.inputElement);

    const currentYear = new Date().getFullYear();

    const navigatedDate = `${months[month]} ${day} ${year == currentYear ? "" : year}`;

    if (task.hasTime) {
      const date =
        appStateUi.hasTime === false
          ? navigatedDate
          : `${navigatedDate} ${format24HourTime(
              preservedTime.getHours(),
              preservedTime.getMinutes(),
            )}`;

      virtualKeyboard.caretManeger.text = date;
      virtualKeyboard.caretManeger.caretPosition = date.length;

      updateTextEditor(elements.inputElement, caret);

      return true;
    }

    return false;
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
    const task = getTaskObject();

    if (!task) return;

    const taskDueDate = new Date(task.dueDate);
    appStateUi.hasTime = false;
    appStateUi.draftedDate = taskDueDate;

    if (task.dueDate) {
      quickDateLabels.setTodayLabel();
      quickDateLabels.setTomorrowLabel();
      quickDateLabels.setNextWeekLabel();
      quickDateLabels.removeTimeFromTextEditor(task.taskDueDate);
      quickDateLabels.removeTime();
    }
  },

  removeTime() {
    if (!elements.addTimeBtn || !elements.removeTimeBtn) return;

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

  isToday(task) {
    const dueDate = new Date(task.dueDate);
    const now = new Date();

    return quickDateVisibility.isSameCalendarDay(dueDate, now);
  },

  isTomorrow(date) {
    const dueDate = new Date(date.dueDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return quickDateVisibility.isSameCalendarDay(dueDate, tomorrow);
  },

  isNextWeek(date) {
    const dueDate = new Date(date.dueDate);
    const nextMonday = new Date();
    const todayIndex = nextMonday.getDay();

    const MONDAY_INDEX = 1;

    let daysUntilMonday = MONDAY_INDEX - todayIndex;

    if (daysUntilMonday < 0) {
      daysUntilMonday += 7;
    }

    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);

    return quickDateVisibility.isSameCalendarDay(dueDate, nextMonday);
  },

  toggleNoDateBtnVisibility(task) {
    if (!elements.noDateBtnContainer) return;

    if (task.dueDate === null) {
      elements.noDateBtnContainer.dataset[ATTR_STATES.NO_DATE_CONTAINER] =
        INACTIVE.NO_DATE_CONTAINER;
    } else {
      elements.noDateBtnContainer.dataset[ATTR_STATES.NO_DATE_CONTAINER] =
        ACTIVE.NO_DATE_CONTAINER;
    }
  },

  toggleTodayOption(date) {
    if (!elements.todayContainer) return;
    const validateToday = quickDateVisibility.isToday(date);
    if (validateToday) {
      elements.todayContainer.dataset[ATTR_STATES.TODAY_CONTAINER] =
        INACTIVE.TODAY_CONTAINER;
    } else {
      elements.todayContainer.dataset[ATTR_STATES.TODAY_CONTAINER] =
        ACTIVE.TODAY_CONTAINER;
    }
  },

  toggleTomorrowOption(date) {
    if (!elements.tomorrowContainer) return;
    const validateTomorrow = quickDateVisibility.isTomorrow(date);

    if (validateTomorrow) {
      elements.tomorrowContainer.dataset[ATTR_STATES.TOMORROW_CONTAINER] =
        INACTIVE.TOMORROW_CONTAINER;
    } else {
      elements.tomorrowContainer.dataset[ATTR_STATES.TOMORROW_CONTAINER] =
        ACTIVE.TOMORROW_CONTAINER;
    }
  },

  toggleNextWeekOption(date) {
    if (!elements.nextWeekContainer) return;
    const validateNextWeek = quickDateVisibility.isNextWeek(date);

    if (validateNextWeek) {
      elements.nextWeekContainer.dataset[ATTR_STATES.NEXT_WEEK_CONTAINER] =
        INACTIVE.NEXT_WEEK_CONTAINER;
    } else {
      elements.nextWeekContainer.dataset[ATTR_STATES.NEXT_WEEK_CONTAINER] =
        ACTIVE.NEXT_WEEK_CONTAINER;
    }
  },

  updateQuickDateOptions() {
    const taskObject = getTaskObject();
    if (!taskObject) return;

    quickDateVisibility.toggleNoDateBtnVisibility(taskObject);
    quickDateVisibility.toggleTodayOption(taskObject);
    quickDateVisibility.toggleTomorrowOption(taskObject);
    quickDateVisibility.toggleNextWeekOption(taskObject);
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
    if (!elements.taskDateSuggestion) return;

    const dueDateEls = taskItem.querySelectorAll(
      `[${ACTIONS.TASK_DATE}], [${ATTR.VISIBLE_DUE_DATE}]`,
    );

    if (taskDueDate)
      quickDateActions.renderDueDateLabel(dueDateEls, taskDueDate);
    else quickDateActions.renderNoDateLabel(dueDateEls);
  },

  checkIfUsersPickedTime(taskId, dueDate) {
    const task = lists.default.getTask(taskId);

    const newTime = new Date(task.dueDate);

    if (task.hasTime) {
      dueDate.setHours(newTime.getHours(), newTime.getMinutes(), 0, 0);
    } else {
      dueDate.setHours(23, 59, 0, 0);
    }

    return dueDate;
  },

  closeDateEditor() {
    exitDateMode();
    exitEditingDate();
  },

  handleTodaySelection() {
    const { taskItem, taskId } = getTaskItem();
    const todayDueDate = quickDateActions.getToday();
    const setDueDateTime = quickDateActions.checkIfUsersPickedTime(
      taskId,
      todayDueDate,
    );
    lists.default.setDueDate(taskId, setDueDateTime, appStateUi.hasTime);
    quickDateActions.updateTaskDate(taskItem, setDueDateTime);
    quickDateActions.closeDateEditor();
  },

  handleTomorrowSelection() {
    const { taskId, taskItem } = getTaskItem();
    const tomorrowDueDate = quickDateActions.getTomorrow();
    const setDueDateTime = quickDateActions.checkIfUsersPickedTime(
      taskId,
      tomorrowDueDate,
    );
    lists.default.setDueDate(taskId, setDueDateTime, appStateUi.hasTime);
    quickDateActions.updateTaskDate(taskItem, setDueDateTime);
    quickDateActions.closeDateEditor();
  },

  handleNextWeekSelection() {
    const { taskItem, taskId } = getTaskItem();
    const nextWeekDueDate = quickDateActions.getNextWeek();
    const setDueDateTime = quickDateActions.checkIfUsersPickedTime(
      taskId,
      nextWeekDueDate,
    );
    lists.default.setDueDate(taskId, setDueDateTime, appStateUi.hasTime);
    quickDateActions.updateTaskDate(taskItem, setDueDateTime);
    quickDateActions.closeDateEditor();
  },

  handleNoDate() {
    const { taskItem, taskId } = getTaskItem();
    const taskObject = lists.default.getTask(taskId);
    taskObject.dueDate = null;
    taskObject.hasTime = false;

    quickDateActions.updateTaskDate(taskItem);
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
