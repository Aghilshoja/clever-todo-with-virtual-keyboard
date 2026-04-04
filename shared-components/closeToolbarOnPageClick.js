export const closeToolbar = (e) => {
  if (
    e.target.closest(".close-toolbar--active") ||
    e.target.closest(".task__inbox-btn")
  ) {
    const taskItem = e.target.closest(".task");
    if (!taskItem) return;
    const manu = taskItem.querySelector(".manu--active");
    const toolbar = taskItem.querySelector(".toolbar-action--active");
    const toolbarClosure = taskItem.querySelector(".close-toolbar--active");

    if (manu) manu.classList.remove("manu--active");
    else if (toolbar && toolbarClosure) {
      toolbar.classList.remove("toolbar-action--active");
      toolbarClosure.classList.remove("close-toolbar--active");
    }
  }
};
