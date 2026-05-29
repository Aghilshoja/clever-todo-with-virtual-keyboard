/*
 * Expands task text width to fill remaining toolbar space.
 * Makes the entire text area clickable for editing.
 * Called when toolbar opens and edit page opens
 */
export const adjustActiveTaskTextWidth = () => {
  const toolbar = document.querySelector(".toolbar-action--active");
  if (!toolbar) return;
  const taskTextEl = toolbar.querySelector(".task__toolbar-task-text");
  const importantButtonTask = toolbar.querySelector(".task__toolbar-important");
  const toolbarCheckbox = toolbar.querySelector(".task__toolbar-task-checkbox");
  const completedTaskCheckbox = toolbar.querySelector(
    ".task__toolbar-completed-task-checkbox",
  );
  const toolbarOfAllList = toolbarCheckbox || completedTaskCheckbox;
  if (!taskTextEl || !importantButtonTask || !toolbarOfAllList) return;
  const totalOffsetWidth =
    importantButtonTask.offsetWidth + toolbarOfAllList.offsetWidth;
  taskTextEl.style.width = `calc(100% - ${totalOffsetWidth}px)`;
};

export const revealToolbar = (e) => {
  const isSelectedTaskActive = document.querySelector(
    ".main-page__count-selected-tasks--active",
  );
  if (isSelectedTaskActive) return;
  if (
    e.target.closest(".task") &&
    !e.target.closest(".task__main-task-checkbox") &&
    !e.target.closest(".task__completed-main-task-checkbox")
  ) {
    const taskItem = e.target.closest(".task");
    if (!taskItem) return;
    const toolbarClosure = taskItem.querySelector(".close-toolbar");
    if (!toolbarClosure) return;
    toolbarClosure.classList.add("close-toolbar--active");
    const toolbar = taskItem.querySelector(".task__toolbar-actions");
    if (!toolbar) throw new Error("toolbar was not found");
    toolbar.classList.add("toolbar-action--active");
    adjustActiveTaskTextWidth();
  }
};

export const revealManu = (e) => {
  if (e.target.closest(".task__more-options")) {
    const taskItem = e.target.closest(".task");
    if (!taskItem) return;
    const manu = taskItem.querySelector(".task__manu");
    if (!manu) throw new Error("manu was not found");
    manu.classList.add("manu--active");
  }
};
