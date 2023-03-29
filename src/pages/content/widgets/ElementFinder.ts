export function getTextarea(): HTMLTextAreaElement {
  const textarea = document.querySelector("textarea");
  return textarea;
}

export function getFooter(): HTMLDivElement | null {
  return document.querySelector("div[class*='absolute bottom-0']");
}

export function getSubmitButton(): HTMLButtonElement {
  const textarea = getTextarea();
  if (!textarea) {
    return null;
  }

  const parent = textarea.parentNode;
  if (!parent) {
    return null;
  }

  const button = parent.querySelector("button");
  return button;
}