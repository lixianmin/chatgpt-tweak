"use strict";
/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { formatDateTime } from "@src/core/Time.js";
import createStoreBrowserStorage from "@src/core/StoreBrowserStorage.js";
import { produce } from "solid-js/store";

// 这个原来是用dexie来存储的，但是因为加载的时候会消耗30ms，导致chatgpt已经收到数据了，但textarea.value还没设置成功。所以改为localStorage试试
const [promptState, setPromptState] = await createStoreBrowserStorage("tweak-prompt-data", { name: "", list: [] });

export default function usePrompts() {
  // 初始的时候默认加一个当前的prompt
  if (!promptState.name) {
    const name = "default";
    const prompt = "{current_time}\nAfter answer my question, you must provide 3 related urls, my question is:\n{query}";

    setPromptState("name", name);
    _addPrompt(name, prompt);
  }

  function _getPromptByName(name) {
    for (let item of promptState.list) {
      if (item.name === name) {
        return item;
      }
    }
  }

  function _getPromptByIndex(index) {
    const list = promptState.list;
    if (index >= 0 && index < list.length) {
      return list[index];
    }
  }

  function _deletePromptByIndex(index) {
    const list = promptState.list;
    if (index >= 0 && index < list.length) {
      setPromptState(
        produce((draft) => {
          draft.list.splice(index, 1);
        })
      );
    }
  }

  function _setPromptByIndex(index, prompt) {
    const list = promptState.list;
    if (index >= 0 && list.length) {
      setPromptState("list", index, "prompt", prompt);
    }
  }

  function _addPrompt(name, prompt) {
    setPromptState("list", list => [...list, { name, prompt }]);
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
    const name = promptState.name;
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
    getCurrentPromptName: () => promptState.name,
    setCurrentPromptName: (name) => setPromptState("name", name),
    addPrompt: _addPrompt,
    getPromptList: () => promptState.list,
    setPromptByIndex: _setPromptByIndex,
    getPromptByIndex: _getPromptByIndex,
    deletePromptByIndex: _deletePromptByIndex,
    compilePrompt: _compilePrompt
  };
}