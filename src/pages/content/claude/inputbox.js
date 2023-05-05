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

  function setText(text) {
    inputBox.firstElementChild.textContent = text;
  }

  function getText() {
    return inputBox.firstElementChild.textContent;
  }

  function focus() {
    inputBox.focus();
  }

  function blur() {
    inputBox.blur();
  }

  function setSelectionRange(start, end) {
    // 设置div中的cursor位置
    const range = document.createRange();
    const node = inputBox.firstElementChild.firstChild;
    range.setStart(node, start);
    range.setEnd(node, end);

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