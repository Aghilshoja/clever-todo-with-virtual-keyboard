import { TaskList } from "../todos-model/todos-model.js";
import { renderTasks, activeUlId } from "../shared-components/render-tasks.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";
import { highlighActiveList } from "../shared-components/highlight-active-list.js";
import { ATTR } from "../constants/todo-constants.js";
import { openTaskCalendar } from "../shared-components/costume-calendar/calendar-controller.js";
import { markTaskAsDue } from "../shared-components/costume-calendar/mark-task-due.js";
import { registerServiceWorker } from "../service-worker/register-service-worker.js";
import { registerClockListeners } from "../shared-components/listeners/clock-listeners.js";
import { registerCalendarListeners } from "../shared-components/listeners/calendar-listeners.js";
import {
  addDragAndDropListeners,
  addTaskListeners,
  registerTodoListeners,
} from "../shared-components/listeners/todo-listeners.js";
import { registerNotificationListener } from "../shared-components/listeners/register-notification-listener.js";
import { registerLayoutObserver } from "../shared-components/observers/layout-observer.js";

registerServiceWorker();

export const elements = getCachedElements();

export const lists = {
  default: new TaskList("default"),
};

const handleListChange = (eachTask, listChange) => {
  if (listChange.id !== activeUlId.ul) return;

  renderTasks(listChange.getTasks(), eachTask);
};

lists.default.subscribe(TaskList.EVENTS.RENDER_TASK, handleListChange);
lists.default.subscribe(TaskList.EVENTS.MARK_TASK_AS_DUE, markTaskAsDue);

lists.default.initializeNotifications();
const initTodo = () => {
  highlighActiveList();

  const listContainer = document.querySelector(`
  [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);
  if (!listContainer) return;
  const nextElementSibling = listContainer.nextElementSibling;
  if (!nextElementSibling) return;
  const completedList = nextElementSibling.querySelector("ul");
  if (!completedList) return;
  addTaskListeners(listContainer);
  addTaskListeners(completedList);

  addDragAndDropListeners(listContainer);
  addDragAndDropListeners(completedList);

  registerNotificationListener();

  registerTodoListeners();
  registerCalendarListeners();
  registerClockListeners();

  registerLayoutObserver(listContainer);
};

initTodo();
