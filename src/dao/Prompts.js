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
    // todo 也许可以默认提供好几个prompts
    const name = "related 3 urls";
    const text = "{current_time}\nAfter answering my question, you must provide 3 related urls, my question is:\n{query}";

    setPromptState("current", name);
    addPrompt({ name, text });
  }

  function getPromptByName(name) {
    for (let item of promptState.list) {
      if (item.name === name) {
        return item;
      }
    }
  }

  function indexOfByName(name) {
    const list = promptState.list;
    const size = list.length;
    for (let i = 0; i < size; i++) {
      const item = list[i];
      if (item.name === name) {
        return i;
      }
    }

    return -1;
  }

  function getPromptByIndex(index) {
    const list = promptState.list;
    if (index >= 0 && index < list.length) {
      return list[index];
    }
  }

  function deletePromptByName(name) {
    const index = indexOfByName(name);
    deletePromptByIndex(index);
  }

  function deletePromptByIndex(index) {
    const list = promptState.list;
    if (index >= 0 && index < list.length) {
      setPromptState(produce(draft => {
          draft.list.splice(index, 1);
        })
      );
    }
  }

  function setPromptByName(name, prompt) {
    const index = indexOfByName(name);
    setPromptByIndex(index, prompt);
  }

  function setPromptByIndex(index, prompt) {
    const list = promptState.list;
    if (index >= 0 && index < list.length) {
      setPromptState(produce(draft => {
        draft.list[index] = prompt;
        // console.log("draft", draft, "index", index, "prompt", prompt);
      }));
    }
  }

  function addPrompt(prompt) {
    setPromptState(produce(draft => {
      draft.list.push(prompt);
      // console.log("draft.list", draft.list);
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

  function compilePrompt(query) {
    const current = promptState.current;
    const prompt = getPromptByName(current);
    const currentTime = formatDateTime(new Date());

    const text = _replaceVariables(prompt.text, {
      "{query}": query,
      "{current_time}": currentTime
    });

    return text;
  }

  return {
    getCurrentPrompt: () => promptState.current,
    setCurrentPrompt: (current) => setPromptState("current", current),
    addPrompt: addPrompt,
    getPromptList: () => promptState.list,
    getPromptByName: getPromptByName,
    setPromptByName: setPromptByName,
    getPromptByIndex: getPromptByIndex,
    deletePromptByName: deletePromptByName,
    compilePrompt: compilePrompt
  };
}