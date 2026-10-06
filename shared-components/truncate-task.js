import { ACTIONS, ATTR } from "../constants/todo-constants.js";

export const truncateTaskText = () => {
  const taskEl = document.querySelectorAll(`[${ATTR.MAIN_TASK_TEXT}]`);
  if (!taskEl) return;

  const breakpoints = [
    { maxWidth: 400, maxTextLength: 100 },
    { maxWidth: 768, maxTextLength: 150 },
    { maxWidth: 1000, maxTextLength: 400 },
    { maxWidth: 1200, maxTextLength: 450 },
  ];

  const currentBreakpoint = breakpoints.find(
    (bp) => window.innerWidth <= bp.maxWidth,
  );

  const maxLength = currentBreakpoint ? currentBreakpoint.maxTextLength : null;

  taskEl.forEach((taskEl) => {
    const fullText = taskEl.dataset.truncateText;
    if (!fullText) return;

    if (maxLength !== null && fullText.length > maxLength)
      taskEl.textContent = fullText.slice(0, maxLength) + "...";
    else taskEl.textContent = fullText;
  });
};

export const truncateTaskDescription = () => {
  const descriptionEl = document.querySelectorAll(
    `[${ATTR.MAIN_TASK_DESCRIPTION}]`,
  );
  if (!descriptionEl) return;

  const breakpoints = [
    { maxWidth: 400, maxTextLength: 40 },
    { maxWidth: 768, maxTextLength: 90 },
    { maxWidth: 1000, maxTextLength: 180 },
    { maxWidth: 1200, maxTextLength: 230 },
  ];

  const currentBreakpoint = breakpoints.find(
    (bp) => window.innerWidth <= bp.maxWidth,
  );

  const maxLength = currentBreakpoint ? currentBreakpoint.maxTextLength : null;

  descriptionEl.forEach((desEl) => {
    const fullText = desEl.dataset.truncateText;
    if (!fullText) return;

    if (maxLength !== null && fullText.length > maxLength)
      desEl.textContent = fullText.slice(0, maxLength) + "...";
    else desEl.textContent = fullText;
  });
};

const SECTION_NAME_BREAKPOINTS = [
  { maxWidth: 400, maxTextLength: 12 },
  { maxWidth: 768, maxTextLength: 18 },
  { maxWidth: 1000, maxTextLength: 24 },
  { maxWidth: 1200, maxTextLength: 30 },
];

const SECTION_DESCRIPTION_BREAKPOINTS = [
  { maxWidth: 400, maxTextLength: 20 },
  { maxWidth: 768, maxTextLength: 40 },
  { maxWidth: 1000, maxTextLength: 60 },
  { maxWidth: 1200, maxTextLength: 80 },
];

export const truncateSectionName = () => {
  const nameEls = document.querySelectorAll(`[${ACTIONS.EDIT_SECTION_NAME}]`);
  if (!nameEls.length) return;

  const bp = SECTION_NAME_BREAKPOINTS.find(
    (b) => window.innerWidth <= b.maxWidth,
  );
  const maxLength = bp ? bp.maxTextLength : null;

  nameEls.forEach((el) => {
    const fullText = el.dataset.truncateText;
    if (!fullText) return;

    el.textContent =
      maxLength !== null && fullText.length > maxLength
        ? fullText.slice(0, maxLength) + "..."
        : fullText;
  });
};

export const truncateSectionDescription = () => {
  const descEls = document.querySelectorAll(
    `[${ACTIONS.EDIT_SECTION_DESCRIPTION}]`,
  );

  if (!descEls.length) return;

  const bp = SECTION_DESCRIPTION_BREAKPOINTS.find(
    (b) => window.innerWidth <= b.maxWidth,
  );
  const maxLength = bp ? bp.maxTextLength : null;

  descEls.forEach((el) => {
    const fullText = el.dataset.truncateText;

    if (!fullText) return;
    el.textContent =
      maxLength !== null && fullText.length > maxLength
        ? fullText.slice(0, maxLength) + "..."
        : fullText;
  });
};
