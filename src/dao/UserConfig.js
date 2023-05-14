"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import createStoreBrowserStorage from "@src/core/StoreBrowserStorage.js";
import { produce } from "solid-js/store";

const [configState, setConfigState] = await createStoreBrowserStorage("tweak-user-config", {
  toolbarEnable: true,
  googleEnable: false
});

function setToolbarEnable(enable) {
  setConfigState(produce(draft => {
      draft.toolbarEnable = enable;
    }
  ));
}

function setGoogleEnable(enable) {
  setConfigState(produce(draft => {
      draft.googleEnable = enable;
    }
  ));
}

export default function useUserConfig() {
  return {
    isToolbarEnable: () => configState.toolbarEnable,
    setToolbarEnable: setToolbarEnable,
    isGoogleEnable: () => configState.googleEnable,
    setGoogleEnable: setGoogleEnable
  };
}