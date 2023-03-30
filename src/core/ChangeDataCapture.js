"use strict";
import { createEffect, createSignal } from "solid-js";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function createChangeDataCapture() {
  const [getter, setter] = createSignal(false);

  return {
    onSignal: function(handler) {
      createEffect(() => {
        getter();
        handler();
      });
    },
    signal: function() {
      setter(!getter());
    }
  };
}