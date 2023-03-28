"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { getSystemLanguage } from "@src/core/Locale";
import useLocalStorage from "@src/core/LocalStorage.js";

export default function createUserConfig() {
  const defaultConfig = {
    region: "wt-wt",
  };

  const webAccess = useLocalStorage("tweak-web-access", true);
  const promptUUID = useLocalStorage("tweak-prompt-uuid", "default");
  const language = useLocalStorage('tweak-language', getSystemLanguage())
  return {
    webAccess,
    promptUUID,
    language,
  };
}