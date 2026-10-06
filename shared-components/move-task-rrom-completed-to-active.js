import { lists } from "../todos-controller/todos-controller.js";
import {
  captureAndRemoveTaskItem,
  updateCompletionStatusLabel,
} from "./complete-mode.js";
import { renderTask } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { showUndopopup } from "./undo-completed-task.js";
import {
  disableOrEnableButtons,
  updateCounterAfterCompletingOrUncompletingATask,
} from "./select-tasks.js";
import { ACTIONS, ATTR, UNDO_STATES } from "../constants/todo-constants.js";
import { appStateUi } from "./todo-states/states.js";

export const moveTaskFromCompletedToActive = (event) => {
  const clickedCheckbox = event.target.closest(`[${ACTIONS.UNCOMPLETE_TASK}]`);
  if (!clickedCheckbox) return;
  const taskid = clickedCheckbox.dataset.id;
  if (!taskid) return;

  let activeTaskObject = null;

  if (event.currentTarget.hasAttribute(ATTR.SECTION_LIST)) {
    const sectionItem = event.currentTarget.closest(`[${ATTR.SECTION_ITEM}]`);
    if (!sectionItem) return;
    const sectionId = sectionItem.dataset.id;
    if (sectionId) {
      activeTaskObject = lists.default.moveTaskFromCompletedToActive(
        taskid,
        sectionId,
      );
    }

    const template = document.createElement("ul");
    template.innerHTML = renderTask(activeTaskObject);
    const sectionList = sectionItem.querySelector(`[${ATTR.SECTION_LIST}]`);
    if (sectionList) {
      captureAndRemoveTaskItem(taskid, sectionList);
      sectionList.prepend(template.firstElementChild);
    }
  } else {
    activeTaskObject = lists.default.moveTaskFromCompletedToActive(taskid);
    const tasksContainer = event.currentTarget;
    captureAndRemoveTaskItem(taskid, tasksContainer);
    const template = document.createElement("ul");
    template.innerHTML = renderTask(activeTaskObject);
    tasksContainer.prepend(template.firstElementChild);
  }

  appStateUi.undoOperation.originalTaskObject = activeTaskObject;

  countTasks();
  updateCompletionStatusLabel(event);
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_UNCOMPLETED;
  showUndopopup();
  updateCounterAfterCompletingOrUncompletingATask();
  /* disable or enable delete, complete, duplicate operation on tasks when in tasks selection */
  disableOrEnableButtons();
};
