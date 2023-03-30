"use strict";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default async function useBrowserStorage(key, initialValue = undefined) {
  const obj = await Browser.storage.sync.get([key]);
  let current = obj[key];
  if (!current) {
    current = initialValue;
  }

  return {
    getStorage(defaultValue = initialValue) {
      return current ?? defaultValue;
    },
    setStorage(value) {
      current = value;
      Browser.storage.sync.set({ [key]: value }).then();
    }
  };
}