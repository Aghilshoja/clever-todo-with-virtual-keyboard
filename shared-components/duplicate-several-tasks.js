import {
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
} from "../constants/todo-constants.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { exitTaskSelection } from "./select-tasks.js";

export const duplicateSeveralTasks = () => {
  const selectedTaskElements = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  if (selectedTaskElements.length === 0) return;

  const taskIds = Array.from(selectedTaskElements).map(
    (task) => task.dataset.id,
  );

  const duplicatedTasks = lists.default.duplicateSeveralTasks(taskIds);

  selectedTaskElements.forEach((selectedTask, index) => {
    const clonedSelectedTasks = selectedTask.cloneNode(true);
    clonedSelectedTasks.dataset.id = duplicatedTasks[index].id;
    const clonedSelectedTaskChildren =
      clonedSelectedTasks.querySelectorAll("[data-id]");
    clonedSelectedTaskChildren.forEach(
      (el) => (el.dataset.id = duplicatedTasks[index].id),
    );
    selectedTask.after(clonedSelectedTasks);
  });
  exitTaskSelection();
  countTasks();
  showNumberOfCompletedTasks();
};
