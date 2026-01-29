import { getCachedElements } from "../cached-elements/get-cached-elements.js";

const hideSplashHeader = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");

  if (!elements.loeaderDot) throw new Error("required DOM does not exist");

  // all loader dots share the samw animation timeline.
  // we listen to the first one as the lifecycle source
  elements.loeaderDot.addEventListener("animationend", (e) => {
    if (e.animationName === "processing") {
      if (elements.splashHeader) {
        elements.splashHeader.style.animation = "none";
        elements.splashHeader.setAttribute("aria-hidden", "true");
        elements.splashHeader.style.display = "none"; // Immediately stop animations and hide the splash header using inline styles since it is a fixed page
      }

      if (elements.mainPage) {
        elements.mainPage.classList.remove("hidden-main-page");
        elements.mainPage.classList.add("main-page");
      }
    }
  });
};

hideSplashHeader();
