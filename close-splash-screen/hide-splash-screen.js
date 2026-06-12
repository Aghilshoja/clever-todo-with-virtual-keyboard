import { getCachedElements } from "../shared-components/get-cached-element.js";

/* data attribute to get elements without relying CSS classes that makes JavaScript tightly coupled to CSS */
export const SPLSASH_HEADER_ATTR = {
  SPLASH_HEADER: "data-splash-header",
  LOADING: "data-loading",
  MAIN_PAGE: "data-main-page",
};

const ATTRI_STATES = {
  SPLASH_HEADER: "splashHeaderState",
  MAIN_PAGE: "mainPageState",
};

const HIDDEN = {
  SPLASH_HEADER: "hidden",
};

const VISIBLE = {
  MAIN_PAGE: "visible",
};

const ANIMATION_NAME = "processing";

const hideSplashHeader = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");

  if (!elements.loaderDot) throw new Error("required DOM does not exist");

  // all loader dots share the samw animation timeline.
  // we listen to the first one as the lifecycle source
  elements.loaderDot.addEventListener("animationend", (e) => {
    if (e.animationName === ANIMATION_NAME) {
      if (elements.splashHeader) {
        elements.splashHeader.style.animation = "none";
        elements.splashHeader.setAttribute("aria-hidden", "true");
        elements.splashHeader.dataset[ATTRI_STATES.SPLASH_HEADER] =
          HIDDEN.SPLASH_HEADER; // Immediately stop animations and hide the splash header using inline styles since it is a fixed page
      }

      if (elements.mainPage)
        elements.mainPage.dataset[ATTRI_STATES.MAIN_PAGE] = VISIBLE.MAIN_PAGE;
    }
  });
};

hideSplashHeader();
