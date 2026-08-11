import { openTaskCalendar } from "../costume-calendar/calendar-controller.js";
import { appStateUi } from "../todo-states/states.js";

export const registerNotificationListener = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      const taskId = event.data.taskId;
      if (!taskId) return;
      appStateUi.activeTaskId = taskId;
      openTaskCalendar();
    });
  }
};
