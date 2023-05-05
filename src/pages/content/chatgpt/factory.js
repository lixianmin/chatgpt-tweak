"use strict";
/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { useInputBox } from "@pages/content/chatgpt/inputbox.js";

export function createChatgptFactory() {
  let inputBox = null;

  function getInputBox() {
    if (!inputBox) {
      inputBox = useInputBox();
    }
    return inputBox;
  }

  function getSubmitButton() {
    const inputBox = getInputBox();
    if (!inputBox) {
      return null;
    }

    const parent = inputBox.getDom().parentNode;
    if (!parent) {
      return null;
    }

    const button = parent.querySelector("button");
    return button;
  }

  function getConsolePanel() {
    const panel = document.querySelector("div[class*='react-scroll-to-bottom']")?.firstChild?.firstChild;
    return panel;
  }

  return {
    getInputBox: getInputBox,
    getSubmitButton: getSubmitButton,
    getConsolePanel: getConsolePanel
  };
}