"use strict";

/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function useInputBox() {
  const inputBox = document.querySelector("div[role=\"textbox\"]");
  if (!inputBox) {
    return null;
  }

  const placeholder = document.querySelector("div[class=\"ql-placeholder\"]").firstElementChild;

  function getDom() {
    return inputBox;
  }

  function setHtml(html) {
    inputBox.innerHTML = html;
  }

  function getHtml() {
    return inputBox.innerHTML;
  }

  function getText() {
    return inputBox.innerText;
  }

  function focus() {
    inputBox.focus();
  }

  function blur() {
    inputBox.blur();
  }

  function moveCursorToEnd() {
    // 设置div中的cursor位置
    const range = document.createRange();
    const dom = inputBox.lastElementChild;
    const textLength = dom.textContent.length;

    range.setStart(dom.firstChild, textLength);
    range.setEnd(dom.firstChild, textLength);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function setPlaceholder(text) {
    placeholder.textContent = text;
  }

  function getPlaceholder() {
    return placeholder.textContent;
  }

  return {
    getDom: getDom,
    setHtml: setHtml,
    getHtml: getHtml,
    getText: getText,
    focus: focus,
    blur: blur,
    moveCursorToEnd: moveCursorToEnd,
    setPlaceholder: setPlaceholder,
    getPlaceholder: getPlaceholder
  };
}