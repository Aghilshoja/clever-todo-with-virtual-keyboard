export const truncateTaskText = () => {
  const taskEl = document.querySelectorAll(".task__text");
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
  const descriptionEl = document.querySelectorAll(".task__description");
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
