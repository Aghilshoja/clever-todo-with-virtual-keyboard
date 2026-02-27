import { TaskList } from "../todos-model/todos-model.js";
import { renderTasks, activeUlId } from "../shared-components/render-tasks.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";
import { addTask } from "../shared-components/add-task.js";
import { highlighActiveList } from "../shared-components/highlight-active-list.js";

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

  // Navigation Click
  elements.navigation.addEventListener("click", (e) => {
    const listBtn = e.target.closest("[data-id]");
    if (!listBtn) return;

    activeUlId.ul = listBtn.dataset.id;

    if (!lists[activeUlId.ul]) return;

    renderTasks(lists.default.getTasks());
  });

  elements.submitTask.addEventListener("click", addTask);
};

initTodo();
