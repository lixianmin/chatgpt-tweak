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

export function createClaudeFactory() {
  let inputBox = null;

  function getShadowRoot() {
    return document;
  }

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
    // inputBox.focus();
    // const enterEvent = new KeyboardEvent("keydown", {
    //   bubbles: true,
    //   cancelable: true,
    //   // key: "Enter",  // 这个key:"Enter"，会导致inputBox中多一个换行出来，其它的好像没有作用
    //   code: "Enter"
    // });
    // inputBox.getDom().dispatchEvent(enterEvent);

    // 给发送按钮发送一个click事件
    const btnSubmit = getSubmitButton();
    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    btnSubmit.dispatchEvent(clickEvent);
  }

  return {
    getShadowRoot: getShadowRoot,
    getInputBox: getInputBox,
    getSubmitButton: getSubmitButton,
    getConsolePanel: getConsolePanel,
    attachTweakUI: attachTweakUI,
    sendChat: sendChat
  };
}