"use strict";

import { sleep } from "@src/core/Tools";
import { io } from "socket.io-client";

/********************************************************************
 created:    2023-05-17
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function createBotProxy(factory) {
  const socket = io("http://localhost:8888");
  socket.on("ask.question", async (message) => {
    await sendQuestion(message, answer => {
      socket.emit("answer.question", answer);
    });
  });

  function fetchChatList() {
    return document.querySelectorAll("div[class=\"p-rich_text_section\"]");
  }

  async function sendQuestion(message, onAnswer) {
    const inputBox = factory.getInputBox();
    inputBox.setHtml(message);
    await factory.checkWaitOneFrame();
    factory.sendChat();

    while (true) {
      await sleep(200);
      const list = fetchChatList();
      const size = list.length;
      if (size < 2) {
        continue;
      }

      // 先找到questionIndex
      let questionIndex = size - 2;
      while (questionIndex >= 0) {
        const question = list[questionIndex].innerText;
        if (question === message) {
          break;
        }
        questionIndex--;
      }

      const answerIndex = questionIndex + 1;
      const text = list[answerIndex].innerText;
      if (text.endsWith("Typing… (edited) ")) {
        onAnswer(text);
        continue;
      }

      if (text.endsWith(" (edited) ")) {
        onAnswer(text);
        return text;
      }
    }
  }

  return {
    sendQuestion: sendQuestion
  };
}