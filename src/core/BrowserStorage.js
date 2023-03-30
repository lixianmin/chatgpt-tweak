"use strict";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

function isEmptyOrNull(o) {
  if (o) {
    for (let k in o) {
      return false;
    }
  }

  return true;
}

export default async function useBrowserStorage(key, initialValue = undefined) {
  let currentValue = await Browser.storage.sync.get([key]);
  if (isEmptyOrNull(currentValue)) {
    currentValue = initialValue;
  }

  return {
    getStorage(defaultValue = initialValue) {
      return currentValue ?? defaultValue;
    },
    setStorage(value) {
      currentValue = value;
      Browser.storage.sync.set({ key: value }).then();
    }
  };
}