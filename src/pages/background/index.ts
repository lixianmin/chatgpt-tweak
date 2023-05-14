"use strict";

import { CommandType } from "@src/common/Constants";
import { createTabMessageBusSites } from "@src/core/MessageBus";
import { createGoogle } from "@src/core/Google";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const tabBus = createTabMessageBusSites();
const google = createGoogle();

Browser.runtime.onMessage.addListener(async (request) => {
  switch (request.cmd) {
    case CommandType.openOptionsPage:
      // 这个openOptionsPage()方法只能background里调用，为什么还不清楚
      await Browser.runtime.openOptionsPage();
      break;
    case CommandType.google:
      return await google.search(request.query);
    default:
      // 中转消息到content页面
      tabBus.broadcastMessage(request);
      break;
  }
});