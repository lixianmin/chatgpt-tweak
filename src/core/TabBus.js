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
    // 使用这个方法，需要在manifest.ts文件中加入tabs权限，同时需要重启npm run dev，否则不生效
    // todo 这个方法在option page中好像一直在报错
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