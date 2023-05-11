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
import { createFactoryBase } from "@pages/content/sites/FactoryBase.js";

export function createChatgptFactory() {
  const base = createFactoryBase();
  let inputBox = null;

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