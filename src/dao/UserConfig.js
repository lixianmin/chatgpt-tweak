"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { getSystemLanguage } from "@src/core/Locale";
import useLocalStorage from "@src/core/LocalStorage.js";

export default function useUserConfig() {
  const defaultConfig = {
    region: "wt-wt"
  };

  const toolbarEnable = useLocalStorage("tweak-toolbar-enable", true);
  const language = useLocalStorage("tweak-language", getSystemLanguage());
  return {
    toolbarEnable,
    language
  };
}