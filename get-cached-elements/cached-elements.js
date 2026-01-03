export const getCachedElements = () => {
  const elements = {
    splashHeader: document.querySelector(".splash-header"),
    mainPage: document.querySelector(".hidden-main-page"),
  };
  return elements;
};
