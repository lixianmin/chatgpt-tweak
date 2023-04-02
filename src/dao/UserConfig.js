"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import useLocalStorage from "@src/core/LocalStorage.js";
import { getSystemLanguage } from "@src/common/Locale.ts";

export default function useUserConfig() {
  const toolbarEnable = useLocalStorage("tweak-toolbar-enable", true);
  const language = useLocalStorage("tweak-language", getSystemLanguage());
  return {
    toolbarEnable,
    language
  };
}