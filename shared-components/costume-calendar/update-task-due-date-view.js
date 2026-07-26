import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  DUE_DATE_STATES,
  OPEN,
} from "../../constants/todo-constants.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { daysOfWeek, months } from "./create-calendar.js";
import { getCachedElements } from "../get-cached-element.js";
import { format24HourTime } from "./prepare-date-editor.js";

const elements = getCachedElements();

const getTaskItem = () => {
  const toolbar = document.querySelector(
    `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
  );

  const taskItem = toolbar.closest(`[${ATTR.TASK_ITEM}]`);

  return {
    taskItem,
    toolbar,
    taskId: taskItem.dataset.id,
  };
};

const checkOverdueDate = (dueDateEls) => {
  const now = Date.now();

  const taskDueDate = appStateUi.draftedDate?.getTime();

  if (taskDueDate <= now) {
    dueDateEls.forEach(
      (task) =>
        (task.dataset[ATTR_STATES.TASK_DUE_STATE] = DUE_DATE_STATES.OVERDUE),
    );
  } else {
    dueDateEls.forEach(
      (task) =>
        (task.dataset[ATTR_STATES.TASK_DUE_STATE] = DUE_DATE_STATES.UPCOMING),
    );
  }
};

const updateDOM = (taskItem) => {
  if (!elements.taskDateSuggestion) return;

  const dueDateEls = taskItem.querySelectorAll(
    `[${ACTIONS.TASK_DATE}], [${ATTR.VISIBLE_DUE_DATE}]`,
  );

  checkOverdueDate(dueDateEls);

  const taskDueDate = `${daysOfWeek[appStateUi.draftedDate.getDay()]}, ${months[appStateUi.draftedDate.getMonth()]} ${appStateUi.draftedDate.getDate()} ${appStateUi.draftedDate.getFullYear() === 2026 ? "" : appStateUi.draftedDate.getFullYear()} ${appStateUi.hasTime === false ? "" : format24HourTime(appStateUi.draftedDate.getHours(), appStateUi.draftedDate.getMinutes())}`;
  dueDateEls.forEach((dateEl) => {
    dateEl.innerHTML = `<i class="fa fa-calendar" aria-hidden="true"></i>  ${taskDueDate}`;
  });
};

export { updateDOM, getTaskItem };
