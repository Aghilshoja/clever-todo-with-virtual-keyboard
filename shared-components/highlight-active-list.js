import { activeUlId } from "./render-tasks.js";

export const highlighActiveList = () => {
  // Remove highlight from currently highlighted element
  const currentHighlighted = document.querySelector(".highlight-list");
  if (currentHighlighted) currentHighlighted.classList.remove("highlight-list");

  const newActiveBtn = document.querySelector(`
  nav .navigation[data-id="${activeUlId.ul}"]`);

  if (newActiveBtn) newActiveBtn.classList.add("highlight-list");
};
