import { ACTIONS, ADD_SECTION, ATTR } from "../../constants/todo-constants.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";
import { lists } from "../../todos-controller/todos-controller.js";
import { addTaskListeners } from "../listeners/todo-listeners.js";
import { renderTask } from "../render-tasks.js";
import { appStateUi } from "../todo-states/states.js";

const revealKeyboard = (e) => {
  if (!e.target.closest(`[${ACTIONS.ADD_TASK_TO_SECTION}]`)) return;

  appStateUi.addSectionMode = ADD_SECTION.ADD_TASK_TO_SECTION;
  appStateUi.sectionId = e.target.closest(
    `[${ACTIONS.ADD_TASK_TO_SECTION}]`,
  )?.dataset.id;

  toggleKeyboard();
};

const addTaskToSection = (value) => {
  const task = lists.default.addTaskToSection(appStateUi.sectionId, value);
  const taskItem = renderTask(task);

  const template = document.createElement("ul");
  template.innerHTML = taskItem;

  const taskItemEl = template.firstElementChild;

  const list = document.querySelector(
    `[${ATTR.SECTION_LIST}][data-id="${appStateUi.sectionId}"]`,
  );

  if (list) list.prepend(taskItemEl);

  addTaskListeners(list);

  appStateUi.addSectionMode = null;
};

export { addTaskToSection, revealKeyboard };
