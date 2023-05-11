"use strict";
/********************************************************************
 created:    2023-05-10
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { useInputBox } from "@pages/content/sites/bing/inputbox.js";
import { render } from "solid-js/web";
import FootBar from "@pages/content/widgets/FootBar.jsx";
import HeadBar from "@pages/content/widgets/HeadBar.jsx";
import { renderBefore } from "@src/core/Tools.ts";

export function createBingFactory() {
  let inputBox = null;

  function getShadowRoot() {
    const shadowRoot = document.querySelector("cib-serp[class='cib-serp-main']")?.shadowRoot?.querySelector("cib-action-bar")?.shadowRoot;
    return shadowRoot;
  }

  function getInputBox() {
    if (!inputBox) {
      const shadowRoot = getShadowRoot();
      inputBox = useInputBox(shadowRoot);
    }
    return inputBox;
  }

  function getSubmitButton() {
    const shadowRoot = getShadowRoot();
    const button = shadowRoot?.querySelector("button[class=\"button primary\"]");
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
    // 通过input事件激活发送
    const inputBox = getInputBox();
    const inputEvent = new KeyboardEvent("input", { bubbles: true, cancelable: true });
    inputBox.getDom().dispatchEvent(inputEvent);

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