"use strict";
/********************************************************************
 created:    2023-05-11
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { render } from "solid-js/web";
import HeadBar from "@pages/content/widgets/HeadBar.jsx";
import FootBar from "@pages/content/widgets/FootBar.jsx";
import { useTextarea } from "@pages/content/sites/Textarea.js";
import { createFactoryBase } from "@pages/content/sites/FactoryBase.js";

export function createBardFactory() {
  const base = createFactoryBase();
  let inputBox = null;

  function getInputBox() {
    if (!inputBox) {
      inputBox = useTextarea(document);
    }
    return inputBox;
  }

  function getSubmitButton() {
    const button = document.querySelector("button[aria-label=\"Send message\"]");
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
    base.dispatchEventAsInput(getInputBox().getDom());  // 通过input事件激活发送
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