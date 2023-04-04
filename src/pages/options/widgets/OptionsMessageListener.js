"use strict";

import { mountMessageListener } from "@src/core/MessageBus.js";
import { CommandType } from "@src/common/Consts.js";
import usePrompts from "@src/dao/Prompts.js";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function mountOptionsMessageListener() {
  const prompts = usePrompts();

  mountMessageListener(request => {
    switch (request.cmd) {
      case CommandType.setCurrentPrompt:
        console.log("mountMessageListener", request.name);
        prompts.setCurrentPrompt(request.name);
        break;
    }
  });
}