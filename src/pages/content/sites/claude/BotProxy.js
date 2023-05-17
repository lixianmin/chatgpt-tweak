"use strict";

import { sleep } from "@src/core/Tools";

/********************************************************************
 created:    2023-05-17
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function createBotProxy(factory) {
  function fetchChatList() {
    return document.querySelectorAll("div[class=\"p-rich_text_section\"]");
  }

  async function sendQuestion(message) {
    const inputBox = factory.getInputBox();
    inputBox.setHtml(message);
    // await factory.checkWaitOneFrame()
    factory.sendChat();

    while (true) {
      await sleep(200);
      const list = fetchChatList();
      if (list.length === 0) {
        continue;
      }

      const text = list[list.length - 1].innerText;
      if (text.endsWith("Typing… (edited) ")) {
        continue;
      }

      if (text.endsWith(" (edited) ")) {
        return text;
      }
    }
  }

  return {
    sendQuestion: sendQuestion
  };
}