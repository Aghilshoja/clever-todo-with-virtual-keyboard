import {
  EDIT_MODES,
  UNDO_STATES,
  SELECTION_BAR,
  DELETION_MODES,
  ADD_TASK_MODE,
} from "../../constants/todo-constants.js";

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
    hasTime: null,
    dueDate: null,
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
  addTaskModes: ADD_TASK_MODE.REGULAR,
  draftedDate: null,
  hasTime: null,
  timeRemoval: false,
  activeTaskId: null,
  currentMinute: 0,
  currentHour: 12,
  originalHour: null,
  originalMinute: null,
};
