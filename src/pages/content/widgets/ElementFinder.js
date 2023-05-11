/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { formatDateTime } from "@src/core/Time";
import { createSiteFactory } from "@pages/content/sites/SiteFactory.js";

const factory = createSiteFactory();

function createPrintDiv() {
  const panel = factory.getConsolePanel();
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