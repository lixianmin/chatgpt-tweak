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

  function removeInvisible(text) {
    return text.replace(/[\s\n\t ]+/g, "");
  }

  async function sendQuestion(message, onAnswer) {
    const inputBox = factory.getInputBox();
    inputBox.setHtml(message);
    await factory.checkWaitOneFrame();
    factory.sendChat();

    const compactMessage = removeInvisible(message);

    while (true) {
      await sleep(100);
      const list = fetchChatList();
      const size = list.length;
      if (size < 2) {
        continue;
      }

      // 先找到questionIndex
      let questionIndex = size - 2;
      let isFound = false;
      while (questionIndex >= 0) {
        const question = removeInvisible(list[questionIndex].innerText);
        if (question === compactMessage) {
          isFound = true;
          break;
        }
        questionIndex--;
      }

      // console.warn("not found");
      if (!isFound) {
        continue;
      }

      const answerIndex = questionIndex + 1;
      const text = list[answerIndex].innerText;
      // console.warn("text", text);

      if (text.endsWith("Typing… (edited) ")) {
        // onAnswer(text);
        continue;
      }

      const trimEnd = " (edited) ";
      if (text.endsWith(trimEnd)) {
        const answer = removeInvisible(text.substring(0, text.length - trimEnd.length));
        // console.warn("answer", answer);
        onAnswer(answer);
        return answer;
      }
    }
  }

  return {
    sendQuestion: sendQuestion
  };
}