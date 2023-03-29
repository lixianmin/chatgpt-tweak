"use strict";

import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

Browser.runtime.onMessage.addListener((request) => {
  if (request === "open.options.page") {
    Browser.runtime.openOptionsPage().then();
  }
});