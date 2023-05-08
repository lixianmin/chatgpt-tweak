"use strict";

import Browser from "webextension-polyfill";
import { onCleanup, onMount } from "solid-js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function createTabMessageBusSites() {
  return createTabMessageBus({ url: ["https://chat.openai.com/*", "https://app.slack.com/*"] });
}

export function createTabMessageBus(queryInfo) {
  function broadcastMessage(message) {
    // 使用这个方法，需要在manifest.ts文件中加入tabs权限，同时需要重启npm run dev，否则不生效
    // 如果报Browser.tabs是undefined, 说明可能需要通过Browser.runtime.sendMessage中转一下, 参考:manifest.ts中关于tabs权限部分的说明和background下的index.ts文件
    Browser.tabs.query(queryInfo).then(tabs => {
      for (let tab of tabs.values()) {
        Browser.tabs.sendMessage(tab.id, message).then().catch(err => {
          // 这个方法在option page中好像一直在报错，但好像暂时没有发现什么副作用:
          // Error: Could not establish connection. Receiving end does not exist.
          // console.log(err);
        });
      }
    });
  }

  return {
    broadcastMessage: broadcastMessage
  };
}

export function mountMessageListener(callback) {
  onMount(() => {
    Browser.runtime.onMessage.addListener(callback);
    onCleanup(() => Browser.runtime.onMessage.removeListener(callback));
  });
}