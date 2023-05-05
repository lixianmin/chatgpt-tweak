/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { useInputBox } from "@pages/content/claude/inputbox.js";

export function createClaudeFactory() {
  let inputBox = null;

  function getInputBox() {
    if (!inputBox) {
      inputBox = useInputBox();
    }
    return inputBox;
  }

  function getSubmitButton() {
    const button = document.querySelector("button[data-qa=\"texty_send_button\"]");
    return button;
  }

  function getConsolePanel() {
    const panel = document.querySelector("div[data-qa=\"message_pane\"]");
    return panel;
  }

  return {
    getInputBox: getInputBox,
    getSubmitButton: getSubmitButton,
    getConsolePanel: getConsolePanel
  };
}