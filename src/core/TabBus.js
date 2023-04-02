"use strict";

import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function createTabBusChatGPT() {
  return createTabBus({ url: "https://chat.openai.com/*" });
}

export function createTabBus(queryInfo) {

  function broadcastMessage(message) {
    Browser.tabs.query(queryInfo).then(tabs => {
      for (let tab of tabs.values()) {
        Browser.tabs.sendMessage(tab.id, message).then();
      }
    });
  }

  return {
    broadcastMessage: broadcastMessage
  };
}