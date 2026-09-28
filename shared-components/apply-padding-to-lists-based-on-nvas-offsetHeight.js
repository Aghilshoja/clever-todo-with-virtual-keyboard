import { elements } from "../todos-controller/todos-controller.js";

export const uupdatePaddingOfListDynamicallyBasedOnBottomNavbar = (
  listContainer,
) => {
  if (listContainer) {
    listContainer.style.paddingBottom = `${elements.navigation.offsetHeight}px`;
    listContainer.style.paddingTop = `${elements.mainPageFlexContainer.offsetHeight}px`;
  }
};
