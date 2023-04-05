/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function getInputBox(): HTMLTextAreaElement {
  const inputBox = document.querySelector("textarea");
  return inputBox;
}

export function getFooter(): HTMLDivElement | null {
  return document.querySelector("div[class*='absolute bottom-0']");
}

export function getSubmitButton(): HTMLButtonElement {
  const inputBox = getInputBox();
  if (!inputBox) {
    return null;
  }

  const parent = inputBox.parentNode;
  if (!parent) {
    return null;
  }

  const button = parent.querySelector("button");
  return button;
}