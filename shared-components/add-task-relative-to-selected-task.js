import {
  ACTIONS,
  ADD_TASK_MODE,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
} from "../constants/todo-constants.js";
import { toggleKeyboard } from "../keyboard-view/toggle-keyboard.js";
import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";

const performDOMOperationOfAddingNewTask = (selectedTask, newTask) => {
  const cloneSelectedTask = selectedTask.cloneNode(true);
  cloneSelectedTask.dataset.id = newTask.id;
  delete cloneSelectedTask.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK];

  const taskTextEls = cloneSelectedTask.querySelectorAll(
    `[${ATTR.MAIN_TASK_TEXT}], [${ATTR.TASK_TEXT}]`,
  );

  taskTextEls.forEach((task) => {
    task.textContent = newTask.text;
    task.dataset.truncateText = newTask.text;
  });

  const children = cloneSelectedTask.querySelectorAll(`[data-id]`);

  children.forEach((el) => (el.dataset.id = newTask.id));

  return cloneSelectedTask;
};

const getSelectedTask = () => {
  return document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );
};

export const addTaskAboveSelectedTask = (text) => {
  const selectedTask = getSelectedTask();
  if (!selectedTask) return;

  const selectedTaskId = selectedTask.dataset.id;

  const newTask = lists.default.addTaskAboveSelectedTask(selectedTaskId, text);

  const newTaskAboveSelectedTask = performDOMOperationOfAddingNewTask(
    selectedTask,
    newTask,
  );
  if (!newTaskAboveSelectedTask) return;
  selectedTask.before(newTaskAboveSelectedTask);
};

export const addTaskBelowSelectedTask = (text) => {
  const selectedTask = getSelectedTask();
  if (!selectedTask) return;

  const selectedTaskId = selectedTask.dataset.id;

  const newTask = lists.default.addTaskBelowSelectedTask(selectedTaskId, text);

  const newTaskBelowSelectedTask = performDOMOperationOfAddingNewTask(
    selectedTask,
    newTask,
  );

  selectedTask.after(newTaskBelowSelectedTask);
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
