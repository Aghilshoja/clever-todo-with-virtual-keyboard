import { uupdatePaddingOfListDynamicallyBasedOnBottomNavbar } from "../apply-padding-to-lists-based-on-nvas-offsetHeight.js";
import { truncateTaskDescription, truncateTaskText } from "../truncate-task.js";

const updateTodoLayout = (listContainer) => {
  uupdatePaddingOfListDynamicallyBasedOnBottomNavbar(listContainer);
  truncateTaskText();
  truncateTaskDescription();
};

export const registerLayoutObserver = (listContainer) => {
  document.addEventListener("DOMContentLoaded", () => {
    updateTodoLayout(listContainer);
  });

  const resizeObserver = new ResizeObserver(() => {
    updateTodoLayout(listContainer);
  });

  resizeObserver.observe(document.body);
};
