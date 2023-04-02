"use strict";

import Browser from "webextension-polyfill";
import { onCleanup, onMount } from "solid-js";

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

  function mountListener(callback) {
    onMount(() => {
      Browser.runtime.onMessage.addListener(callback);
      onCleanup(() => Browser.runtime.onMessage.removeListener(callback));
    });
  }

  return {
    broadcastMessage: broadcastMessage,
    mountListener: mountListener
  };
}