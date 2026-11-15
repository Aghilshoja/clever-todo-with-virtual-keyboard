import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  OPEN,
  CHECK_STATES,
  CLOSED,
  INACTIVE,
} from "../constants/todo-constants.js";
import { elements } from "../todos-controller/todos-controller.js";

/*
 * Expands task text width to fill remaining toolbar space.
 * Makes the entire text area clickable for editing.
 * Called when toolbar opens and edit page opens
 */
export const adjustActiveTaskTextWidth = () => {
  const toolbar = document.querySelector(
    `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
  );
  if (!toolbar) return;
  const taskTextEl = toolbar.querySelector(`[${ATTR.TASK_TEXT}]`);

  const importantButtonTask = toolbar.querySelector(
    `[${ACTIONS.IMPORTANT_TASK}]`,
  );

  const toolbarCheckbox = toolbar.querySelector(`[${ACTIONS.COMPLETE_TASK}]`);

  const completedTaskCheckbox = toolbar.querySelector(
    `[${ACTIONS.UNCOMPLETE_TASK}]`,
  );

  const toolbarOfAllList = toolbarCheckbox || completedTaskCheckbox;

  if (!taskTextEl || !importantButtonTask || !toolbarOfAllList) return;
  const totalOffsetWidth =
    importantButtonTask.offsetWidth + toolbarOfAllList.offsetWidth;
  taskTextEl.style.width = `calc(100% - ${totalOffsetWidth}px)`;
};

const closePreviousOpenToolbar = () => {
  const toolbars = document.querySelectorAll(
    `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
  );
  toolbars.forEach((el) => {
    el.dataset[ATTR_STATES.TASK_TOOLBAR] = CLOSED.TASK_TOOLBAR;
    const removeToolbarOverlay = el.previousElementSibling;
    if (removeToolbarOverlay)
      removeToolbarOverlay.dataset[ATTR_STATES.TOOLBAR_OVERLAY] =
        INACTIVE.TOOLBAR_OVERLAY;
  });
};

export const revealToolbar = (e) => {
  const isSelectionModeActive =
    elements.selectionBar.dataset[ATTR_STATES.SELECTION_BAR] ===
    ACTIVE.SELECTION_BAR;
  if (isSelectionModeActive) return;
  if (
    e.target.closest(`[${ATTR.TASK_ITEM}]`) &&
    !e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`) &&
    !e.target.closest(`[${ACTIONS.UNCOMPLETE_TASK}]`) &&
    !e.target.closest(`[${ACTIONS.SUBTASK_TOGGLER}]`)
  ) {
    closePreviousOpenToolbar();
    const taskItem = e.target.closest(`[${ATTR.TASK_ITEM}]`);
    if (!taskItem) return;
    const mainTaskItem = document.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${taskItem.dataset.id}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    );

    if (!mainTaskItem) return;
    const toolbarClosure = mainTaskItem.querySelector(
      `[${ACTIONS.CLOSE_TOOLBAR}]`,
    );
    if (!toolbarClosure) return;
    toolbarClosure.dataset[ATTR_STATES.TOOLBAR_OVERLAY] =
      ACTIVE.TOOLBAR_OVERLAY;
    const toolbar = mainTaskItem.querySelector(`[${ATTR.TASK_TOOLBAR}]`);
    if (!toolbar) throw new Error("toolbar was not found");
    toolbar.dataset[ATTR_STATES.TASK_TOOLBAR] = OPEN.TASK_TOOLBAR;
    adjustActiveTaskTextWidth();
  }
};

export const revealManu = (e) => {
  if (e.target.closest(`[${ACTIONS.OPEN_TOOLBAR_MENU}]`)) {
    const taskItem = e.target.closest(`[${ATTR.TASK_ITEM}]`);
    if (!taskItem) return;
    const menu = taskItem.querySelector(`[${ATTR.TOOLBAR_MENU}]`);
    if (!menu) throw new Error("manu was not found");
    menu.dataset[ATTR_STATES.TASK_MENU] = OPEN.TASK_MENU;
  }
};
