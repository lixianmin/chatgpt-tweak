/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { formatDateTime } from "@src/core/Time";

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

function createPrintDiv() {
  const panel = getConsolePanel();
  if (panel && panel.children) {
    const div = document.createElement("div");
    div.style.margin = "2rem auto 2rem 6rem"; // top right bottom left

    const children = panel.children;
    const insertIndex = children.length - 1;
    const pivot = children[insertIndex];
    panel.insertBefore(div, pivot);

    return div;
  }
}

export function printHtml(html) {
  const div = createPrintDiv();
  if (div) {
    div.innerHTML = html;
  }
}

export function printText(text) {
  const div = createPrintDiv();
  if (div) {
    div.innerText = text;
  }
}

export function printHtmlWithTimestamp(html) {
  const currentTime = formatDateTime(new Date());
  const output = currentTime + "\n" + html;
  printHtml(output);
}

export function printTextWithTimestamp(text) {
  const currentTime = formatDateTime(new Date());
  const output = currentTime + "\n" + text;
  printText(output);
}