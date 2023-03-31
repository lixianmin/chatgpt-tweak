"use strict";
import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default async function createStoreBrowserStorage(key, initialValue = undefined) {
  const obj = await Browser.storage.sync.get([key]);
  const loaded = obj[key];

  let current = loaded ? JSON.parse(loaded) : initialValue;
  const [state, setState] = createStore(current);

  createEffect(() => {
    const next = JSON.stringify(state);
    Browser.storage.sync.set({ [key]: next }).then();
  });

  return [state, setState];
}