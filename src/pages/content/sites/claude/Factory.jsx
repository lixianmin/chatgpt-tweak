"use strict";
/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { useInputBox } from "@pages/content/sites/claude/InputBox.js";
import { render } from "solid-js/web";
import HeadBar from "@pages/content/widgets/HeadBar.jsx";
import FootBar from "@pages/content/widgets/FootBar.jsx";
import { createFactoryBase } from "@pages/content/sites/FactoryBase.js";

export function createClaudeFactory() {
  const base = createFactoryBase();
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

  function attachTweakUI(toolbarId) {
    const inputBox = getInputBox();

    if (inputBox) {
      const toolbars = document.querySelectorAll("div[role=\"toolbar\"]");
      const footBar = toolbars[toolbars.length - 1];
      render(() => <HeadBar />, footBar.parentElement);
      render(() => <FootBar id={toolbarId} />, footBar.parentElement.parentElement.parentElement);
    }
  }

  function sendChat() {
    base.dispatchEventAsClick(getSubmitButton()); // 给发送按钮发送一个click事件
  }

  return Object.assign(base, {
    getInputBox: getInputBox,
    getSubmitButton: getSubmitButton,
    getConsolePanel: getConsolePanel,
    attachTweakUI: attachTweakUI,
    sendChat: sendChat
  });
}