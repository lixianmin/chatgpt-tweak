"use strict";

import { Locale } from "@src/common/Locale.js";
import { mountMessageListener } from "@src/core/MessageBus.js";
import { CommandType, Constants } from "@src/common/Constants.js";
import usePrompts from "@src/dao/Prompts.js";
import { createSiteFactory } from "@pages/content/sites/SiteFactory.js";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function mountContentMessageListener() {
  const prompts = usePrompts();

  const factory = createSiteFactory();
  const inputBox = factory.getInputBox();

  function broadcastChat(request) {
    if (request.host !== window.location.host) {
      inputBox.setHtml(request.queryText);
      // console.warn("request:", request);

      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",  // 这个key:"Enter"，会导致inputBox中多一个换行出来，其它的好像没有作用
        code: "Enter",
        ctrlKey: request.ctrlKey,
        detail: Constants.BroadcastChatSecondhandFlag
      });
      inputBox.getDom().dispatchEvent(enterEvent);
    }
  }

  mountMessageListener(request => {
    switch (request.cmd) {
      case CommandType.addPrompt:
        prompts.addPrompt(request.newPrompt);
        break;
      case CommandType.deletePromptByName:
        prompts.deletePromptByName(request.name);
        break;
      case CommandType.savePrompt:
        prompts.setPromptByName(request.name, request.prompt);
        break;
      case CommandType.setCurrentLanguageByName:
        Locale.setCurrentLanguageByName(request.name);
        break;
      case CommandType.swapPromptByIndex:
        prompts.swapPromptByIndex(request.index1, request.index2);
        break;
      case CommandType.broadcastChat:
        broadcastChat(request);
        break;
      default:
        console.log("leaked request:", request);
        break;
    }
  });
}