/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { createDelayed } from "@src/core/Tools.ts";

export function useInputBox() {
  const inputBox = document.querySelector("div[role=\"textbox\"]")?.firstElementChild;
  if (!inputBox) {
    return null;
  }

  const placeholder = document.querySelector("div[class=\"ql-placeholder\"]").firstElementChild;

  function getDom() {
    return inputBox.parentElement;
  }

  function setText(text) {
    inputBox.textContent = text;
  }

  function getText() {
    return inputBox.textContent;
  }

  function focus() {
    inputBox.parentElement.focus();
  }

  function blur() {
    inputBox.parentElement.blur();
  }

  function setSelectionRange(start, end) {
    // 设置div中的cursor位置
    const range = document.createRange();
    range.setStart(inputBox.firstChild, start);
    range.setEnd(inputBox.firstChild, end);

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
    setText: setText,
    getText: getText,
    focus: focus,
    blur: blur,
    setSelectionRange: setSelectionRange,
    setPlaceholder: setPlaceholder,
    getPlaceholder: getPlaceholder
  };
}