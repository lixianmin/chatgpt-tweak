"use strict";

import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

Browser.runtime.onMessage.addListener((request) => {
  // 这个openOptionsPage()方法只能background里调用，为什么还不清楚
  if (request === "open.options.page") {
    Browser.runtime.openOptionsPage().then();
  }
});