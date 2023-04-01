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
const [promptState, setPromptState] = await createStoreBrowserStorage("tweak-prompt-data", { current: "", list: [] });

export default function usePrompts() {
  // 初始的时候默认加一个当前的prompt
  if (!promptState.current) {
    const name = "default";
    const text = "{current_time}\nAfter answer my question, you must provide 3 related urls, my question is:\n{query}";

    setPromptState("current", name);
    _addPrompt({ name, text });
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
      setPromptState(produce(draft => {
          draft.list.splice(index, 1);
        })
      );
    }
  }

  function _setPromptByIndex(index, prompt) {
    const list = promptState.list;
    if (index >= 0 && index < list.length) {
      setPromptState(produce(draft => {
        draft.list[index] = prompt;
        // console.log("draft", draft, "index", index, "prompt", prompt);
      }));
    }
  }

  function _addPrompt(prompt) {
    setPromptState(produce(draft => {
      draft.list.push(prompt);
      console.log("draft.list", draft.list);
    }));
  }

  function _replaceVariables(text, variables) {
    let next = text;
    for (const key in variables) {
      try {
        next = next.replaceAll(key, variables[key]);
      } catch (err) {
        console.log(err);
      }
    }
    return next;
  }

  function _compilePrompt(query) {
    const current = promptState.current;
    const prompt = _getPromptByName(current);
    const currentTime = formatDateTime(new Date());

    const text = _replaceVariables(prompt.text, {
      "{query}": query,
      "{current_time}": currentTime
    });

    return text;
  }

  return {
    getCurrentPrompt: () => promptState.current,
    setCurrentPrompt: (name) => setPromptState("current", name),
    addPrompt: _addPrompt,
    getPromptList: () => promptState.list,
    setPromptByIndex: _setPromptByIndex,
    getPromptByIndex: _getPromptByIndex,
    deletePromptByIndex: _deletePromptByIndex,
    compilePrompt: _compilePrompt
  };
}