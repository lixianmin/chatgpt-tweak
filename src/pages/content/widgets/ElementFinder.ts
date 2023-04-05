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

function getConsolePanel(): any {
  const panel = document.querySelector("div[class*='react-scroll-to-bottom']")?.firstChild?.firstChild;
  return panel;
}

export function printHtml(html) {
  const panel = getConsolePanel();
  if (panel && panel.children) {
    const div = document.createElement("div");
    div.innerHTML = html;

    const children = panel.children;
    const insertIndex = children.length - 1;
    const pivot = children[insertIndex];
    panel.insertBefore(div, pivot);
  }
}

export function printText(text) {
  const panel = getConsolePanel();
  if (panel && panel.children) {
    const div = document.createElement("div");
    div.innerText = text;
    div.style.marginTop = "2rem";
    div.style.marginLeft = "6rem";

    const children = panel.children;
    const insertIndex = children.length - 1;
    const pivot = children[insertIndex];
    panel.insertBefore(div, pivot);
  }
}