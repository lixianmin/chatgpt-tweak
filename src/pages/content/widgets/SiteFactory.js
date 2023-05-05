/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

function chatgptFactory() {
  function getInputBox() {
    return document.querySelector("textarea");
  }

  function getSubmitButton() {
    const inputBox = getInputBox();
    if (!inputBox) {
      return null;
    }

    const parent = inputBox.parentNode;
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

function claudeFactory() {
  function getInputBox() {
    return document.querySelector("div[aria-label=\"Message to Claude\"]").firstElementChild;
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

export function createSiteFactory() {
  const host = window.location.host;
  switch (host) {
    case "chat.openai.com":
      return chatgptFactory();
    case "app.slack.com":
      return claudeFactory();
    default:
      return null;
  }
}