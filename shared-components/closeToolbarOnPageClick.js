import {
  ATTR,
  ACTIONS,
  ATTR_STATES,
  ACTIVE,
  INACTIVE,
  CHECK_STATES,
  OPEN,
  CLOSED,
} from "../constants/todo-constants.js";

export const closeToolbar = (e) => {
  if (
    e.target.closest(
      `[${CHECK_STATES.TOOLBAR_OVERLAY_STATE}='${ACTIVE.TOOLBAR_OVERLAY}']`,
    ) ||
    e.target.closest(`[${ACTIONS.CLOSE_TOOLBAR}]`)
  ) {
    const taskItem = e.target.closest(`[${ATTR.TASK_ITEM}]`);
    if (!taskItem) return;
    const menu = taskItem.querySelector(
      `[${CHECK_STATES.TOOLBAR_MENU}='${OPEN.TASK_MENU}']`,
    );
    const toolbar = taskItem.querySelector(
      `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
    );
    const toolbarClosure = taskItem.querySelector(
      `[${CHECK_STATES.TOOLBAR_OVERLAY_STATE}='${ACTIVE.TOOLBAR_OVERLAY}']`,
    );

    if (menu) menu.dataset[ATTR_STATES.TASK_MENU] = CLOSED.TASK_MENU;
    else if (toolbar && toolbarClosure) {
      toolbar.dataset[ATTR_STATES.TASK_TOOLBAR] = CLOSED.TASK_TOOLBAR;
      toolbarClosure.dataset[ATTR_STATES.TOOLBAR_OVERLAY] =
        INACTIVE.TOOLBAR_OVERLAY;
    }
  }
};
