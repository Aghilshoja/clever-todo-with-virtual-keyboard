import { elements } from "../../todos-controller.js/todos-controller.js";
import { openKeyboardToAddATask } from "../add-task-relative-to-selected-task.js";
import { addTask } from "../add-task.js";
import { closeToolbar } from "../closeToolbarOnPageClick.js";
import { completeTask } from "../complete-mode.js";
import { showCostumeCalendar } from "../costume-calendar/calendar-controller.js";
import {
  closeWarningDeletionPopup,
  deleteTask,
  warnDeletion,
} from "../delete-mode.js";
import {
  deleteSeveralTasks,
  showSeveralTasksWarning,
} from "../delete-several-tasks.js";
import { editDescriptionAndTask } from "../dom-operations/operation-on-dom-on-switch-between-edit-and-description-modes.js";
import {
  draggedEndTask,
  draggedEnter,
  draggedLeave,
  dragOver,
  dragStart,
  dropTarget,
} from "../drag-and-drop.js";
import { duplicateTask } from "../duplicate-mode.js";
import { duplicateSeveralTasks } from "../duplicate-several-tasks.js";
import {
  exitEditMode,
  implementEditAndDescriptionMode,
  saveEditedTask,
} from "../handle-edit-and-description-modes.js";
import { handleMultipleTasksUndo } from "../handle-several-completed-and-uncompleted-tasks-undo.js";
import { handleSeveralTasksCompletionOrUncompletion } from "../handle-several-tasks-completion-or-uncompletion.js";
import { handleSeveralTasksCompletion } from "../handle-several-tasks-completion.js";
import { moveTaskFromCompletedToActive } from "../move-task-rrom-completed-to-active.js";
import { revealManu, revealToolbar } from "../reveal-toolbar.js";
import {
  handleExitSelectionClick,
  selectTasks,
  toggleBatchOptions,
  toggleOptionsOfSelectedTasks,
  toggleSelectionBarMenu,
  triggerTaskSelectionUi,
} from "../select-tasks.js";
import { showCalendar } from "../set-due-date-on-multiple-tasks.js";
import { handleUndoCompletingAndUncompleting } from "../undo-completed-task.js";

export const registerTodoListeners = () => {
  elements.warningPopup.addEventListener("click", deleteTask);
  elements.undoCompletedTask.addEventListener(
    "click",
    handleUndoCompletingAndUncompleting,
  );
  elements.undoCompletedTask.addEventListener("click", handleMultipleTasksUndo);

  document.addEventListener("click", toggleBatchOptions);
  document.addEventListener("click", toggleSelectionBarMenu);
  elements.dropDownList.addEventListener("click", triggerTaskSelectionUi);
  document.addEventListener("click", toggleOptionsOfSelectedTasks);
  elements.selectionBar.addEventListener("click", handleExitSelectionClick);
  elements.batchDeleteTasks.addEventListener("click", showSeveralTasksWarning);
  elements.batchDuplicateTasks.addEventListener("click", duplicateSeveralTasks);
  elements.batchCompletedTasks.addEventListener(
    "click",
    handleSeveralTasksCompletionOrUncompletion,
  );
  elements.warningPopup.addEventListener("click", deleteSeveralTasks);
  elements.warningPopup.addEventListener("click", closeWarningDeletionPopup);

  elements.selectionBarMenu.addEventListener("click", openKeyboardToAddATask);
  elements.batchDueDateBtn.addEventListener("click", showCalendar);
  elements.submitTask.addEventListener("click", addTask);
};

export const addTaskListeners = (list) => {
  list.addEventListener("click", revealManu);
  list.addEventListener("click", revealToolbar);
  list.addEventListener("click", closeToolbar);
  list.addEventListener("click", warnDeletion);
  list.addEventListener("click", duplicateTask);
  list.addEventListener("click", implementEditAndDescriptionMode);
  list.addEventListener("click", saveEditedTask);
  list.addEventListener("click", editDescriptionAndTask);
  list.addEventListener("click", exitEditMode);
  list.addEventListener("click", completeTask);
  list.addEventListener("click", moveTaskFromCompletedToActive);
  list.addEventListener("click", selectTasks);
  list.addEventListener("click", showCostumeCalendar);
};

export const addDragAndDropListeners = (list) => {
  list.addEventListener("dragstart", dragStart);
  list.addEventListener("dragover", dragOver);
  list.addEventListener("dragenter", draggedEnter);
  list.addEventListener("dragleave", draggedLeave);
  list.addEventListener("drop", dropTarget);
  list.addEventListener("dragend", draggedEndTask);
};
