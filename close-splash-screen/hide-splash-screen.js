import { getCachedElements } from "../get-cached-elements/cached-elements.js";

const hideSplashScreen = () => {
  const elements = getCachedElements();
  if (!elements) return;

  if (elements.splashHeader)
    elements.splashHeader.setAttribute("aria-hidden", "true");

  if (elements.splashHeader) elements.splashHeader.style.animation = "none";

  if (elements.mainPage) elements.mainPage.classList.remove("hidden-main-page");

  setTimeout(() => {
    if (elements.splashHeader)
      elements.splashHeader.classList.add("hide-splash-screen");
  }, 3000);
};

hideSplashScreen();
