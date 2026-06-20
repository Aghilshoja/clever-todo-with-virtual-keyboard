import { TaskList } from "../todos-model/todos-model.js";
import { renderTasks, activeUlId } from "../shared-components/render-tasks.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";
import { addTask } from "../shared-components/add-task.js";
import { highlighActiveList } from "../shared-components/highlight-active-list.js";
import {
  revealToolbar,
  revealManu,
} from "../shared-components/reveal-toolbar.js";
import { closeToolbar } from "../shared-components/closeToolbarOnPageClick.js";
import { uupdatePaddingOfListDynamicallyBasedOnBottomNavbar } from "../shared-components/apply-padding-to-lists-based-on-nvas-offsetHeight.js";
import {
  warnDeletion,
  deleteTask,
  closeWarningDeletionPopup,
} from "../shared-components/delete-mode.js";
import { duplicateTask } from "../shared-components/duplicate-mode.js";
import { implementEditAndDescriptionMode } from "../shared-components/handle-edit-and-description-modes.js";
import { saveEditedTask } from "../shared-components/handle-edit-and-description-modes.js";
import { editDescriptionAndTask } from "../shared-components/dom-operations/operation-on-dom-on-switch-between-edit-and-description-modes.js";
import { exitEditMode } from "../shared-components/handle-edit-and-description-modes.js";
import {
  truncateTaskDescription,
  truncateTaskText,
} from "../shared-components/truncate-task.js";
import {
  completeTask,
  showNumberOfCompletedTasks,
} from "../shared-components/complete-mode.js";
import { handleUndoCompletingAndUncompleting } from "../shared-components/undo-completed-task.js";
import { moveTaskFromCompletedToActive } from "../shared-components/move-task-rrom-completed-to-active.js";
import {
  dragStart,
  dragOver,
  draggedEnter,
  draggedLeave,
  dropTarget,
  draggedEndTask,
} from "../shared-components/drag-and-drop.js";
import {
  toggleOptions,
  triggerTaskSelectionUi,
  selectTasks,
  toggleOptionsOfSelectedTasks,
  handleExitSelectionClick,
} from "../shared-components/select-tasks.js";
import {
  ATTR,
  DELETION_MODES,
  EDIT_MODES,
  SELECTION_BAR,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import {
  deleteSeveralTasks,
  showSeveralTasksWarning,
} from "../shared-components/delete-several-tasks.js";
import { duplicateSeveralTasks } from "../shared-components/duplicate-several-tasks.js";
import { handleSeveralTasksCompletionOrUncompletion } from "../shared-components/handle-several-tasks-completion-or-uncompletion.js";
import { handleSeveralCompletedAndUncompletedTasksUndo } from "../shared-components/handle-several-completed-and-uncompleted-tasks-undo.js";

export const lists = {
  default: new TaskList("default"),
};

export const appStateUi = {
  taskId: null,
  activeMode: EDIT_MODES.NO_MODES,
  taskObjectToEdit: null,
  lastClickedElement: {
    lastEl: null,
    updatedInput: null,
  },
  undoOperation: {
    previousEl: null,
    nextEl: null,
    removedEl: null,
    taskObject: null,
    taskObjectIndex: null,
    originalTaskObject: null,
    undoType: UNDO_STATES.NO_UNDO,
  },
  taskSelectionMode: SELECTION_BAR.ACTIVE_LIST,
  selectedTasksCounter: 0,
  deletionMode: DELETION_MODES,
  // snapshots are used for undo operation
  snapshots: {
    domSnapshot: null,
    dataSnapshot: null,
    IdsOfSelectedTasks: null,
  },
};

const handleListChange = (listChange, eachTask) => {
  if (listChange.id !== activeUlId.ul) return;

  renderTasks(listChange.getTasks(), eachTask);
};

lists.default.subscribe(handleListChange);

export const addListeners = (list) => {
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
};

const addDragAndDropListeners = (list) => {
  list.addEventListener("dragstart", dragStart);
  list.addEventListener("dragover", dragOver);
  list.addEventListener("dragenter", draggedEnter);
  list.addEventListener("dragleave", draggedLeave);
  list.addEventListener("drop", dropTarget);
  list.addEventListener("dragend", draggedEndTask);
};

const initTodo = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM wasn't found");
  const {
    warningPopup,
    undoCompletedTask,
    dropDownList,
    selectionBar,
    navigation,
    submitTask,
    batchDeleteTasks,
    batchDuplicateTasks,
    batchCompletedTasks,
  } = elements;

  if (
    !warningPopup ||
    !undoCompletedTask ||
    !dropDownList ||
    !selectionBar ||
    !navigation ||
    !submitTask ||
    !batchDeleteTasks ||
    !batchDuplicateTasks ||
    !batchCompletedTasks
  )
    return;
  // Highlight default on load
  highlighActiveList();

  const listContainer = document.querySelector(`
  [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);
  if (!listContainer) return;
  const nextElementSibling = listContainer.nextElementSibling;
  if (!nextElementSibling) return;
  const completedList = nextElementSibling.querySelector("ul");
  if (!completedList) return;
  addListeners(listContainer);
  addListeners(completedList);
  addDragAndDropListeners(listContainer);
  addDragAndDropListeners(completedList);
  warningPopup.addEventListener("click", deleteTask);
  undoCompletedTask.addEventListener(
    "click",
    handleUndoCompletingAndUncompleting,
  );
  undoCompletedTask.addEventListener(
    "click",
    handleSeveralCompletedAndUncompletedTasksUndo,
  );

  document.addEventListener("click", toggleOptions);
  dropDownList.addEventListener("click", triggerTaskSelectionUi);
  document.addEventListener("click", toggleOptionsOfSelectedTasks);
  selectionBar.addEventListener("click", handleExitSelectionClick);
  batchDeleteTasks.addEventListener("click", showSeveralTasksWarning);
  batchDuplicateTasks.addEventListener("click", duplicateSeveralTasks);
  batchCompletedTasks.addEventListener(
    "click",
    handleSeveralTasksCompletionOrUncompletion,
  );
  warningPopup.addEventListener("click", deleteSeveralTasks);
  warningPopup.addEventListener("click", closeWarningDeletionPopup);

  // Navigation Click
  navigation.addEventListener("click", (e) => {
    const listBtn = e.target.closest("[data-id]");
    if (!listBtn) return;

    activeUlId.ul = listBtn.dataset.id;

    if (!lists[activeUlId.ul]) return;

    renderTasks(lists.default.getTasks());
  });

  submitTask.addEventListener("click", addTask);

  document.addEventListener("DOMContentLoaded", () => {
    uupdatePaddingOfListDynamicallyBasedOnBottomNavbar(listContainer);
    truncateTaskText();
    truncateTaskDescription();
  });

  // Update padding whenever the navbar resizes
  const resizeObserver = new ResizeObserver((entries) => {
    uupdatePaddingOfListDynamicallyBasedOnBottomNavbar(listContainer);
    truncateTaskText();
    truncateTaskDescription();
  });

  resizeObserver.observe(document.body);
};

initTodo();
