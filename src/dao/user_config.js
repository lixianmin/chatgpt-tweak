/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { defaults } from "lodash-es";
import { getSystemLanguage } from "@src/core/localization";

const defaultConfig = {
  webAccess: true,
  region: "wt-wt",
  language: getSystemLanguage(),
  promptUUID: "default"
};

export async function getUserConfig() {
  const config = localStorage.getItem("defaultConfig");
  // 如果config里有的，用config里的；如果config里面没有的，用defaultConfig里的
  return defaults(config, defaultConfig);
}

export async function updateUserConfig(config) {
  // await Browser.storage.sync.set(config);
  localStorage.setItem("defaultConfig", config);
}