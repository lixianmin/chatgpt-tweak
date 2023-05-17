"use strict";
/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { render } from "solid-js/web";
import HeadBar from "@pages/content/widgets/HeadBar.jsx";
import FootBar from "@pages/content/widgets/FootBar.jsx";
import { useTextarea } from "@pages/content/sites/Textarea.js";
import { dispatchEventAsClick } from "@pages/content/sites/SiteTools.js";
import { emptyMethod } from "@src/core/Tools";

export function createChatgptFactory() {
  let inputBox = null;

  function getShadowRoot() {
    return document;
  }

  function getInputBox() {
    if (!inputBox) {
      inputBox = useTextarea(document);
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

  function attachTweakUI(toolbarId) {
    const inputBox = getInputBox();
    const btnSubmit = getSubmitButton();

    if (inputBox && btnSubmit) {
      const dom = inputBox.getDom();
      render(() => <HeadBar />, dom.parentElement.parentElement.firstElementChild);
      render(() => <FootBar id={toolbarId} />, dom.parentElement.parentElement);
    }
  }

  function sendChat() {
    // 解决chatgpt被动发送的时候submit button是disabled的问题
    const submitButton = getSubmitButton();
    submitButton.disabled = false;

    // 给发送按钮发送一个click事件
    dispatchEventAsClick(submitButton);
  }

  return {
    getShadowRoot: getShadowRoot,
    getInputBox: getInputBox,
    getSubmitButton: getSubmitButton,
    getConsolePanel: getConsolePanel,
    attachTweakUI: attachTweakUI,
    sendChat: sendChat,
    checkWaitOneFrame: emptyMethod
  };
}