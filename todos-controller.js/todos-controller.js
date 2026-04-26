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
import { warnDeletion, deleteTask } from "../shared-components/delete-mode.js";
import { duplicateTask } from "../shared-components/duplicate-mode.js";
import { implementEditAndDescriptionMode } from "../shared-components/handle-edit-and-description-modes.js";
import { saveEditedTask } from "../shared-components/handle-edit-and-description-modes.js";
import { editDescriptionAndTask } from "../shared-components/dom-operations/operation-on-dom-on-switch-between-edit-and-description-modes.js";
import { exitEditMode } from "../shared-components/handle-edit-and-description-modes.js";
export const lists = {
  default: new TaskList("default"),
};

export const appStateUi = {
  taskId: null,
  activeMode: "none",
  activePlaceholder: "Enter-a-task",
  taskObjectToEdit: null,
  lastClickedElement: {
    lastEl: null,
    updatedInput: null,
  },
};

const handleListChange = (listChange, eachTask) => {
  if (listChange.id !== activeUlId.ul) return;

  renderTasks(listChange.getTasks(), eachTask);
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
  listContainer.addEventListener("click", warnDeletion);
  listContainer.addEventListener("click", duplicateTask);
  listContainer.addEventListener("click", implementEditAndDescriptionMode);
  listContainer.addEventListener("click", saveEditedTask);
  listContainer.addEventListener("click", editDescriptionAndTask);
  listContainer.addEventListener("click", exitEditMode);
  elements.warningPopup.addEventListener("click", deleteTask);

  // Navigation Click
  elements.navigation.addEventListener("click", (e) => {
    const listBtn = e.target.closest("[data-id]");
    if (!listBtn) return;

    activeUlId.ul = listBtn.dataset.id;

    if (!lists[activeUlId.ul]) return;

    renderTasks();
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
