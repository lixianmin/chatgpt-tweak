"use strict";

import Browser from "webextension-polyfill";
import * as LocaleZh from "./locale_zh.json";

/********************************************************************
 created:    2023-04-03
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const languageTable = {
  en: { name: "English", config: {} },  // 英文，直接使用key作为本地化语言自身
  zh: { name: "中文", config: LocaleZh.default }
};

let currentLanguage = languageTable.zh;

function getBrowserLanguage() {
  return Browser.i18n.getUILanguage().split("-")[0];
}

function setCurrentLanguage(language) {
  currentLanguage = languageTable[language] ?? languageTable.en;
}

function getLocalText(key) {
  const config = currentLanguage.config;
  return config[key] ?? key;
}

export const _T = getLocalText;

export const Locale = {
  languageTable: languageTable,
  getCurrentLanguage: () => currentLanguage,
  setCurrentLanguage: setCurrentLanguage,
  getBrowserLanguage: getBrowserLanguage
};