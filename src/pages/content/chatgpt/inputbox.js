"use strict";

/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function useInputBox() {
  const inputBox = document.querySelector("textarea");
  if (!inputBox) {
    return null;
  }

  function getDom() {
    return inputBox;
  }

  function setText(text) {
    inputBox.value = text;
  }

  function getText() {
    return inputBox?.value;
  }

  function focus() {
    inputBox.focus();
  }

  function blur() {
    inputBox.blur();
  }

  function moveCursorToEnd() {
    const textLength = inputBox.value.length;
    inputBox.setSelectionRange(textLength, textLength);
  }

  function setPlaceholder(text) {
    inputBox.placeholder = text;
  }

  function getPlaceholder() {
    return inputBox.placeholder;
  }

  return {
    getDom: getDom,
    setText: setText,
    getText: getText,
    focus: focus,
    blur: blur,
    moveCursorToEnd: moveCursorToEnd,
    setPlaceholder: setPlaceholder,
    getPlaceholder: getPlaceholder
  };
}