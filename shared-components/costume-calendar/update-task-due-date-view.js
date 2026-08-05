import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  DUE_DATE_STATES,
  OPEN,
} from "../../constants/todo-constants.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { daysOfWeek, months } from "./create-calendar.js";
import { getCachedElements } from "../get-cached-element.js";
import { format24HourTime } from "./prepare-date-editor.js";

const getTaskItem = () => {
  const taskId = appStateUi.activeTaskId;
  if (taskId) {
    return {
      taskItem: document.querySelector(
        `[${ATTR.TASK_ITEM}][data-id="${taskId}"]`,
      ),
      taskId,
    };
  }

  const toolbar = document.querySelector(
    `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
  );

  if (!toolbar) return null;

  const taskItem = toolbar.closest(`[${ATTR.TASK_ITEM}]`);

  if (!taskItem) return null;

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
  const dueDateEls = taskItem.querySelectorAll(
    `[${ACTIONS.TASK_DATE}], [${ATTR.VISIBLE_DUE_DATE}]`,
  );

  checkOverdueDate(dueDateEls);

  const currentYear = new Date().getFullYear();

  const taskDueDate = `${daysOfWeek[appStateUi.draftedDate.getDay()]}, ${months[appStateUi.draftedDate.getMonth()]} ${appStateUi.draftedDate.getDate()} ${appStateUi.draftedDate.getFullYear() === currentYear ? "" : appStateUi.draftedDate.getFullYear()} ${appStateUi.hasTime === false ? "" : format24HourTime(appStateUi.draftedDate.getHours(), appStateUi.draftedDate.getMinutes())}`;
  dueDateEls.forEach((dateEl) => {
    dateEl.innerHTML = `<i class="fa fa-calendar" aria-hidden="true"></i>  ${taskDueDate}`;
  });
};

export { updateDOM, getTaskItem };
