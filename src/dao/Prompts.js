"use strict";
/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { formatDateTime } from "@src/core/Time.js";
import useBrowserStorage from "@src/core/BrowserStorage.js";

// 这个原来是用dexie来存储的，但是因为加载的时候会消耗30ms，导致chatgpt已经收到数据了，但textarea.value还没设置成功。所以改为localStorage试试
const currentPromptName = await useBrowserStorage("tweak-current-prompt-name");
const promptList = await useBrowserStorage("tweak-prompt-list", []);

export default function usePrompts() {
  // 初始的时候默认加一个当前的prompt
  if (!currentPromptName.getStorage()) {
    const name = "default";
    const prompt = "{current_time}\nAfter answer my question, you must provide 3 related urls, my question is:\n{query}";

    currentPromptName.setStorage(name);
    _addPrompt(name, prompt);
  }

  function _loadPrompt(name) {
    for (let item of promptList.getStorage()) {
      if (item.name === name) {
        return item.prompt;
      }
    }

    return "";
  }

  function _addPrompt(name, prompt) {
    const list = promptList.getStorage();
    list.push({ name, prompt });
    promptList.setStorage(list);
  }

  function _updatePrompt(name, prompt) {
    const list = promptList.getStorage();
    for (let item of list) {
      if (item.name === name) {
        item.prompt = prompt;
        promptList.setStorage(list);
        break;
      }
    }
  }

  function _replaceVariables(prompt, variables) {
    let newPrompt = prompt;
    for (const key in variables) {
      try {
        newPrompt = newPrompt.replaceAll(key, variables[key]);
      } catch (err) {
        console.log(err);
      }
    }
    return newPrompt;
  }

  function _compilePrompt(query) {
    const name = currentPromptName.getStorage();
    const prompt = _loadPrompt(name);
    const currentTime = formatDateTime(new Date());

    const nextPrompt = _replaceVariables(prompt, {
      "{query}": query,
      "{current_time}": currentTime
    });

    return nextPrompt;
  }

  return {
    getCurrentPromptName: () => currentPromptName.getStorage(),
    setCurrentPromptName: (name) => currentPromptName.setStorage(name),
    loadPrompt: _loadPrompt,
    loadAllPrompts: () => promptList.getStorage(),
    addPrompt: _addPrompt,
    updatePrompt: _updatePrompt,
    compilePrompt: _compilePrompt
  };
}