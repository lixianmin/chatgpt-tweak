"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import useLocalStorage from "@src/core/LocalStorage.js";
import { formatDateTime } from "@src/core/Time.js";

export default function usePrompts() {
  // 这个原来是用dexie来存储的，但是因为加载的时候会消耗30ms，导致chatgpt已经收到数据了，但textarea.value还没设置成功。所以改为localStorage试试

  const currentPromptName = useLocalStorage("tweak-current-prompt-name");
  const promptList = useLocalStorage("tweak-prompt-list", []);

  // 初始的时候默认加一个当前的prompt
  if (!currentPromptName.get()) {
    const name = "default";
    const prompt = "{current_time}\nAfter answer my question, you must provide 3 related urls, my question is:\n{query}";

    currentPromptName.set(name);
    _addPrompt(name, prompt);
  }

  function _loadPrompt(name) {
    for (let item of promptList.get()) {
      if (item.name === name) {
        return item.prompt;
      }
    }

    return "";
  }

  function _addPrompt(name, prompt) {
    const list = promptList.get();
    list.push({ name, prompt });
    promptList.set(list);
  }

  function _updatePrompt(name, prompt) {
    const list = promptList.get();
    for (let item of list) {
      if (item.name === name) {
        item.prompt = prompt;
        promptList.set(list);
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
    const name = currentPromptName.get();
    const prompt = _loadPrompt(name);
    const currentTime = formatDateTime(new Date());

    const nextPrompt = _replaceVariables(prompt, {
      "{query}": query,
      "{current_time}": currentTime
    });

    return nextPrompt;
  }

  return {
    getCurrentName: () => currentPromptName.get(),
    setCurrentName: (name) => currentPromptName.set(name),
    loadPrompt: _loadPrompt,
    loadAllPrompts: () => promptList.get(),
    addPrompt: _addPrompt,
    updatePrompt: _updatePrompt,
    compilePrompt: _compilePrompt
  };
}