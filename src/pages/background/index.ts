"use strict";

import Browser from "webextension-polyfill";
import { CommandType } from "@src/common/Constants";
import { createTabMessageBusSites } from "@src/core/MessageBus";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const tabBus = createTabMessageBusSites();

Browser.runtime.onMessage.addListener((request) => {
  switch (request.cmd) {
    case CommandType.openOptionsPage:
      // 这个openOptionsPage()方法只能background里调用，为什么还不清楚
      Browser.runtime.openOptionsPage().then();
      break;
    default:
      // 中转消息到content页面
      tabBus.broadcastMessage(request);
      break;
  }
});