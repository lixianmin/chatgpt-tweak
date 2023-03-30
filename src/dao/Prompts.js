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

  function _getPromptByName(name) {
    for (let v of promptList.getStorage()) {
      if (v.name === name) {
        return v;
      }
    }
  }

  function _getPromptByIndex(index) {
    const list = promptList.getStorage();
    if (index >= 0 && index < list.length) {
      return list[index];
    }
  }

  function _setPromptByIndex(index, prompt) {
    const list = promptList.getStorage();
    if (index >= 0 && list.length) {
      list[index] = prompt;
      promptList.setStorage(list);
    }
  }

  function _addPrompt(name, prompt) {
    const list = promptList.getStorage();
    list.push({ name, prompt });
    promptList.setStorage(list);
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
    const prompt = _getPromptByName(name);
    // console.log("prompt", prompt, "name", name);
    const currentTime = formatDateTime(new Date());

    const text = _replaceVariables(prompt.prompt, {
      "{query}": query,
      "{current_time}": currentTime
    });

    return text;
  }

  return {
    getCurrentPromptName: () => currentPromptName.getStorage(),
    setCurrentPromptName: (name) => currentPromptName.setStorage(name),
    addPrompt: _addPrompt,
    getAllPrompts: () => promptList.getStorage(),
    setPromptByIndex: _setPromptByIndex,
    getPromptByIndex: _getPromptByIndex,
    compilePrompt: _compilePrompt
  };
}