import { showCalendar } from "../set-due-date-on-multiple-tasks.js";
import { elements } from "../../todos-controller.js/todos-controller.js";
import { saveTaskDueDate } from "../save-task-due-date.js";
import {
  quickDateActions,
  quickDateLabels,
} from "../costume-calendar/quick-date-options.js";
import {
  decrementYearAndMonth,
  incrementYearAndMonth,
} from "../costume-calendar/navigate-month.js";
import { selectDate } from "../costume-calendar/handle-date-selection.js";
import { handleExitEditingTaskDateOrDateMode } from "../costume-calendar/calendar-controller.js";

export const registerCalendarListeners = () => {
  elements.batchDueDateBtn.addEventListener("click", showCalendar);

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

  elements.nextMonthBtn.addEventListener("click", incrementYearAndMonth);
  elements.previousMonthBtn.addEventListener("click", decrementYearAndMonth);

  elements.calendarContainer.addEventListener("click", selectDate);

  elements.dateContainer.addEventListener(
    "click",
    handleExitEditingTaskDateOrDateMode,
  );
};
