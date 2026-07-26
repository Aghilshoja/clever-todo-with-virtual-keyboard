import {
  ATTR_STATES,
  DUE_DATE_STATES,
} from "../../constants/todo-constants.js";

export const markTaskAsDue = (taskId) => {
  const dateEls = document.querySelectorAll(
    `.task__visible-due-date[data-id='${taskId}'], .task__set-due-date[data-id="${taskId}"]`,
  );

  if (dateEls.length === 0) return;

  dateEls.forEach(
    (dateEl) =>
      (dateEl.dataset[ATTR_STATES.TASK_DUE_STATE] = DUE_DATE_STATES.OVERDUE),
  );
};
