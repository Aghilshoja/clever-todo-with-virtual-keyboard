import { getCachedElements } from "./get-cached-element.js";
import { getCompletedListContainer } from "./complete-mode.js";
export const uupdatePaddingOfListDynamicallyBasedOnBottomNavbar = (
  listContainer,
) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  const completedListContainer = getCompletedListContainer();
  if (!completedListContainer) return;
  const isCompletedListActive =
    completedListContainer.listWrapper.classList.contains(
      "completed-default-tasks--active",
    );
  if (isCompletedListActive) {
    completedListContainer.listWrapper.style.paddingBottom = `${elements.navigation.offsetHeight}px`;
    listContainer.style.paddingTop = `${elements.mainPageFlexContainer.offsetHeight}px`;
    listContainer.style.paddingBottom = `0px`;
  } else if (listContainer && !isCompletedListActive) {
    listContainer.style.paddingBottom = `${elements.navigation.offsetHeight}px`;
    listContainer.style.paddingTop = `${elements.mainPageFlexContainer.offsetHeight}px`;
  }
};
