"use strict";
import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

// https://github.com/solidjs/solid/issues/1106
// 这个方法，跟unwrap()类型，但返回的对象更加干净
function deepClone(ref) {
  if (typeof ref !== "object") {
    return ref;
  } else {
    const ref2 = Array.isArray(ref) ? [] : {};
    for (const key in ref) {
      if (typeof ref === "object") {
        ref2[key] = deepClone(ref[key]);
      } else {
        ref2[key] = ref[key];
      }
    }
    return ref2;
  }
}

export default async function createStoreBrowserStorage(key, initialValue = undefined) {
  const obj = await Browser.storage.sync.get([key]);
  const loaded = obj[key];
  // console.log("1. loaded:", loaded);
  // console.log("2. initialValue:", initialValue);

  let current = loaded ?? initialValue;
  const [state, setState] = createStore(current);

  createEffect(() => {
    // 这里不能使用unwrap()，否则存储不下来，奇怪
    const cloned = deepClone(state);
    // console.log("6. deepClone", cloned);
    Browser.storage.sync.set({ [key]: cloned }).then();
  });

  return [state, setState];
}