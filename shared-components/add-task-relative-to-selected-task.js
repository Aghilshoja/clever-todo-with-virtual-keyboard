import {
  ADD_TASK_MODE,
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
} from "../constants/todo-constants.js";
import { toggleKeyboard } from "../keyboard-view/toggle-keyboard.js";
import { lists } from "../todos-controller/todos-controller.js";
import { renderTask } from "./render-tasks.js";
import { appStateUi } from "./todo-states/states.js";

const performDOMOperationOfAddingNewTask = (selectedTask, newTask) => {
  const template = document.createElement("ul");
  template.innerHTML = renderTask(newTask);
  const taskItem = template.firstElementChild;

  if (selectedTask.hasAttribute("data-section-id")) {
    taskItem.dataset.sectionId = selectedTask.dataset.sectionId;
  }
  return taskItem;
};

const getSelectedTask = () => {
  return document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );
};

const getLastTaskElementInTree = (selectedTaskId) => {
  const rootTaskId = lists.default.getRootParentId(selectedTaskId);

  const rootId = rootTaskId || selectedTaskId;

  const descendants = lists.default.getAllDescendants(rootId);

  const taskIds = new Set([rootId, ...descendants.map((task) => task.id)]);

  const taskElements = Array.from(
    document.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  );

  return taskElements.filter((task) => taskIds.has(task.dataset.id)).at(-1);
};

export const addTaskAboveSelectedTask = (text) => {
  const selectedTask = getSelectedTask();
  if (!selectedTask) return;

  const selectedTaskId = selectedTask.dataset.id;

  const sectionItem = selectedTask.closest(`[${ATTR.SECTION_ITEM}]`);

  let newTask = null;

  if (sectionItem) {
    const sectionId = sectionItem.dataset.id;
    if (sectionId) {
      newTask = lists.default.addTaskAboveSelectedTask(
        selectedTaskId,
        text,
        sectionId,
      );
    }
  } else {
    newTask = lists.default.addTaskAboveSelectedTask(selectedTaskId, text);
  }

  const newTaskAboveSelectedTask = performDOMOperationOfAddingNewTask(
    selectedTask,
    newTask,
  );

  if (!newTaskAboveSelectedTask) return;
  const rootParentId = lists.default.getRootParentId(selectedTask.dataset.id);
  if (rootParentId) {
    const rootParentEl = document.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${rootParentId}"]`,
    );
    if (rootParentEl) {
      rootParentEl.before(newTaskAboveSelectedTask);
    }
  }
};

export const addTaskBelowSelectedTask = (text) => {
  const selectedTask = getSelectedTask();
  if (!selectedTask) return;

  const selectedTaskId = selectedTask.dataset.id;

  const sectionItem = selectedTask.closest(`[${ATTR.SECTION_ITEM}]`);

  let newTask = null;

  if (sectionItem) {
    const sectionId = sectionItem.dataset.id;
    if (sectionId) {
      newTask = lists.default.addTaskAboveSelectedTask(
        selectedTaskId,
        text,
        sectionId,
      );
    }
  } else {
    newTask = lists.default.addTaskAboveSelectedTask(selectedTaskId, text);
  }

  const newTaskBelowSelectedTask = performDOMOperationOfAddingNewTask(
    selectedTask,
    newTask,
  );

  const lastTaskElement = getLastTaskElementInTree(selectedTask.dataset.id);

  if (lastTaskElement) lastTaskElement.after(newTaskBelowSelectedTask);
};

export const openKeyboardToAddATask = (e) => {
  if (e.target.dataset.action === CHECK_STATES.ADD_TASK_ABOVE) {
    appStateUi.addTaskModes = ADD_TASK_MODE.ADD_ABOVE;
    toggleKeyboard();
  } else if (e.target.dataset.action === CHECK_STATES.ADD_TASK_BELOW) {
    appStateUi.addTaskModes = ADD_TASK_MODE.ADD_BELOW;
    toggleKeyboard();
  }
};
