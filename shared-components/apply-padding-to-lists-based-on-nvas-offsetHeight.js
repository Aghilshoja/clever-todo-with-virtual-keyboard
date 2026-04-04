import { getCachedElements } from "./get-cached-element.js";

export const uupdatePaddingOfListDynamicallyBasedOnBottomNavbar = (
  listContainer,
) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  if (listContainer) {
    listContainer.style.paddingBottom = `${elements.navigation.offsetHeight}px`;
    listContainer.style.paddingTop = `${elements.mainPageFlexContainer.offsetHeight}px`;
  }
};
