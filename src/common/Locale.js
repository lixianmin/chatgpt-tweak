"use strict";

import Browser from "webextension-polyfill";
import * as LocaleEn from "./locale_en.json";
import * as LocaleZh from "./locale_zh.json";

/********************************************************************
 created:    2023-04-03
 author:     lixianmin

 英文，直接使用key作为本地化语言自身 ==> 这个方案不行，因为一些按钮的字不能这样设计

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const languageTable = {
  en: { name: "English", config: LocaleEn },
  zh: { name: "中文", config: LocaleZh }
};

let currentLanguage = languageTable.zh;

function getBrowserLanguage() {
  return Browser.i18n.getUILanguage().split("-")[0];
}

function setCurrentLanguage(language) {
  currentLanguage = languageTable[language] ?? languageTable.en;
}

function getLocalText(key) {
  const config = currentLanguage.config.default;
  return config[key] ?? key;
}

export const _T = getLocalText;

export const Locale = {
  languageTable: languageTable,
  getCurrentLanguage: () => currentLanguage.name,
  setCurrentLanguage: setCurrentLanguage,
  getBrowserLanguage: getBrowserLanguage
};