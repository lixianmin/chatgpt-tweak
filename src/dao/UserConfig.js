"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import createStoreBrowserStorage from "@src/core/StoreBrowserStorage.js";
import { produce } from "solid-js/store";

const [configState, setConfigState] = await createStoreBrowserStorage("tweak-user-config", {
  toolbarEnable: true
});

function setToolbarEnable(enable) {
  setConfigState(produce(draft => {
      draft.toolbarEnable = enable;
    }
  ));
}

export default function useUserConfig() {
  return {
    toolbarEnable: configState.toolbarEnable,
    setToolbarEnable: setToolbarEnable
  };
}