"use strict";
import { createEffect, createSignal } from "solid-js";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-31
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default async function createSignalBrowserStorage(key, initialValue = undefined) {
  const obj = await Browser.storage.sync.get([key]);

  let current = obj[key] ?? initialValue;
  const [getter, setter] = createSignal(current);

  createEffect(() => {
    const target = getter()
    if (Array.isArray(target) && target.length) {

    }

    Browser.storage.sync.set({ [key]: getter() }).then();
  });

  return [getter, setter];
}