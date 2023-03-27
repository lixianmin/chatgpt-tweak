export function getTextArea(): HTMLTextAreaElement {
  const textarea = document.querySelector("textarea");
  if (!textarea) {
    throw new Error("textarea is null");
  }

  return textarea;
}

export function getFooter(): HTMLDivElement | null {
  return document.querySelector("div[class*='absolute bottom-0']");
}

export function getRootElement(): HTMLDivElement | null {
  return document.querySelector("div[id=\"__next\"]");
}

export function getWebChatGPTToolbar(): HTMLElement | null {
  return document.querySelector("div[class*='toolbar']");
}

export function getSubmitButton(): HTMLButtonElement {
  const textarea = getTextArea();
  // @ts-ignore
  return textarea.parentNode.querySelector("button");
}