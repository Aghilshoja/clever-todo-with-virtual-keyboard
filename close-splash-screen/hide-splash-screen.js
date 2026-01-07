import { getCachedElements } from "../cached-elements/get-cached-elements.js";

const hideSplashHeader = () => {
  const elements = getCachedElements();
  if (!elements) return;

  setTimeout(() => {
    // Immediately stop animations and hide splash header from screen readers
    if (elements.splashHeader) {
      elements.splashHeader.style.animation = "none";
      elements.splashHeader.setAttribute("aria-hidden", "true");
      elements.splashHeader.style.display = "none"; // Immediately stop animations and hide the splash header using inline styles since it is a fixed page
    }

    if (elements.mainPage) {
      elements.mainPage.classList.remove("hidden-main-page");
      elements.mainPage.classList.add("main-page");
    }
  }, 2000);
};

hideSplashHeader();
