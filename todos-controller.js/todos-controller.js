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
export const lists = {
  default: new TaskList("default"),
};

const handleListChange = (listChange) => {
  if (listChange.id !== activeUlId.ul) return;

  renderTasks(listChange.getTasks());
};

lists.default.subscribe(handleListChange);

const initTodo = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM wasn't found");

  // Highlight default on load
  highlighActiveList();

  const listContainer = document.querySelector(`
    .list[data-id="${activeUlId.ul}"]`);

  listContainer.addEventListener("click", revealManu);
  listContainer.addEventListener("click", revealToolbar);
  listContainer.addEventListener("click", closeToolbar);

  // Navigation Click
  elements.navigation.addEventListener("click", (e) => {
    const listBtn = e.target.closest("[data-id]");
    if (!listBtn) return;

    activeUlId.ul = listBtn.dataset.id;

    if (!lists[activeUlId.ul]) return;

    renderTasks(lists.default.getTasks());
  });

  elements.submitTask.addEventListener("click", addTask);

  document.addEventListener("DOMContentLoaded", () => {
    uupdatePaddingOfListDynamicallyBasedOnBottomNavbar(listContainer);
  });

  // Update padding whenever the navbar resizes
  const resizeObserver = new ResizeObserver((entries) => {
    uupdatePaddingOfListDynamicallyBasedOnBottomNavbar(listContainer);
  });

  resizeObserver.observe(elements.navigation);
};

initTodo();
