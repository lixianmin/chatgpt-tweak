/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { defaults } from "lodash-es";
import { getSystemLanguage } from "@src/core/Locale";
import ls from "localstorage-slim";

const defaultConfig = {
  webAccess: true,
  region: "wt-wt",
  language: getSystemLanguage(),
  promptUUID: "default"
};

const configKey = "configKey";

export function getUserConfig() {
  const config = ls.get(configKey)
  // 如果config里有的，用config里的；如果config里面没有的，用defaultConfig里的
  return defaults(config, defaultConfig)
}

export function updateUserConfig(config) {
  ls.set(configKey, config);
}