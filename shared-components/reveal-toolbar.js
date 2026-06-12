import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  OPEN,
  CHECK_STATES,
} from "../constants/todo-constants.js";
import { getCachedElements } from "./get-cached-element.js";

const elements = getCachedElements();

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

export const revealToolbar = (e) => {
  if (!elements.selectionBar) return;
  const isSelectionModeActive =
    elements.selectionBar.dataset[ATTR_STATES.SELECTION_BAR] ===
    ACTIVE.SELECTION_BAR;
  if (isSelectionModeActive) return;
  if (
    e.target.closest(`[${ATTR.TASK_ITEM}]`) &&
    !e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`) &&
    !e.target.closest(`[${ACTIONS.UNCOMPLETE_TASK}]`)
  ) {
    const taskItem = e.target.closest(`[${ATTR.TASK_ITEM}]`);
    if (!taskItem) return;
    const toolbarClosure = taskItem.querySelector(`[${ACTIONS.CLOSE_TOOLBAR}]`);
    if (!toolbarClosure) return;
    toolbarClosure.dataset[ATTR_STATES.TOOLBAR_OVERLAY] =
      ACTIVE.TOOLBAR_OVERLAY;
    const toolbar = taskItem.querySelector(`[${ATTR.TASK_TOOLBAR}]`);
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
