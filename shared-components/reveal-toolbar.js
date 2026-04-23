export const revealToolbar = (e) => {
  if (
    e.target.closest(".task") &&
    !e.target.closest(".task__main-task-checkbox")
  ) {
    const taskItem = e.target.closest(".task");
    if (!taskItem) return;
    const toolbarClosure = taskItem.querySelector(".close-toolbar");
    if (!toolbarClosure) return;
    toolbarClosure.classList.add("close-toolbar--active");
    const toolbar = taskItem.querySelector(".task__toolbar-actions");
    if (!toolbar) throw new Error("toolbar was not found");
    toolbar.classList.add("toolbar-action--active");
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
