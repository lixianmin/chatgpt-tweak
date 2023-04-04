"use strict";

import Browser from "webextension-polyfill";
import * as LocaleEn from "./locale_en.json";
import * as LocaleZh from "./locale_zh.json";
import createStoreBrowserStorage from "@src/core/StoreBrowserStorage.js";
import { produce } from "solid-js/store";

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

const browserLanguage = getBrowserLanguage();

// 指的是en, zh这样的，而不是『English』、『中文』 这样的
const [localeState, setLocaleState] = await createStoreBrowserStorage("tweak-locale", {
  languageKey: browserLanguage
  // languageValue: languageTable[browserLanguage] 这个不应该序列化，因为这个新建和修改太频繁啦
});

// console.log(`browserLanguage=${browserLanguage}`, "localState=", localeState);
// console.log("languageKey=", localeState.languageKey, "languageValue=", localeState.languageValue);

function getBrowserLanguage() {
  const uiLanguage = Browser.i18n.getUILanguage();
  const languageKey = uiLanguage.split("-")[0];
  // console.log(`uiLanguage=${uiLanguage}, languageKey=${languageKey}, languageValue=${languageTable[languageKey]}`);
  return languageKey;
}

function getCurrentLanguageName() {
  return languageTable[localeState.languageKey].name;
}

function setCurrentLanguageByName(name) {
  let languageKey = "en";
  for (let [k, v] of Object.entries(languageTable)) {
    if (v.name === name) {
      languageKey = k;
      break;
    }
  }

  setLocaleState(produce(draft => {
    draft.languageKey = languageKey;
    draft.languageValue = languageTable[languageKey];
  }));
}

// 导出_T()方法，用于获取本地化的文本
export function _T(original) {
  const value = languageTable[localeState.languageKey];
  // console.log("value", value);
  const config = value.config.default;
  // console.log(config)
  return config[original] ?? original;
}

export const Locale = {
  languageTable: languageTable,
  getCurrentLanguageName: getCurrentLanguageName,
  setCurrentLanguageByName: setCurrentLanguageByName
};