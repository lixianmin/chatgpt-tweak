"use strict";
/********************************************************************
 created:    2023-05-10
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { render } from "solid-js/web";
import FootBar from "@pages/content/widgets/FootBar.jsx";
import HeadBar from "@pages/content/widgets/HeadBar.jsx";
import { emptyMethod, renderBefore } from "@src/core/Tools.ts";
import { useTextarea } from "@pages/content/sites/Textarea.js";
import { dispatchEventAsClick, dispatchEventAsInput } from "@pages/content/sites/SiteTools.js";

export function createBingFactory() {
  let inputBox = null;

  function getShadowRoot() {
    const shadowRoot = document.querySelector("cib-serp[class='cib-serp-main']")?.shadowRoot?.querySelector("cib-action-bar")?.shadowRoot;
    return shadowRoot;
  }

  function getInputBox() {
    if (!inputBox) {
      const shadowRoot = getShadowRoot();
      inputBox = useTextarea(shadowRoot);
    }
    return inputBox;
  }

  function getSubmitButton() {
    const shadowRoot = getShadowRoot();
    // 现在多了一个语音输入的按钮, 所以获取逻辑需要修订一下
    const button = shadowRoot?.querySelectorAll("button[class=\"button primary\"]")[1];
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
      const parent = dom.parentElement;
      renderBefore(() => <HeadBar />, parent);
      render(() => <FootBar id={toolbarId} />, parent);
    }
  }

  function sendChat() {
    dispatchEventAsInput(getInputBox().getDom());  // 通过input事件激活发送
    dispatchEventAsClick(getSubmitButton()); // 给发送按钮发送一个click事件
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