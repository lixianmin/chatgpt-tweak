"use strict";

import { Locale } from "@src/common/Locale.js";
import { mountMessageListener } from "@src/core/MessageBus.js";
import { CommandType } from "@src/common/Consts.js";
import usePrompts from "@src/dao/Prompts.js";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function mountContentMessageListener() {
  const prompts = usePrompts();

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
    }
  });
}