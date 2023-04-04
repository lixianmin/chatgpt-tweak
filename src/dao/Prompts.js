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
    addBuiltinPrompts();
    setPromptState("current", promptState.list[0].name);
  }

  function addBuiltinPrompts() {
    addPrompt({
      name: "Translator",
      text: "{current_time}\nFirstly, you must firstly rephrase what I will say into elegant English. Secondly, if I am asking a question, please answer it in a new paragraph. What I will say is:\n\n{query}"
    });

    addPrompt({
      name: "Coder",
      text: "{current_time}\nSuppose you are a professional coder. Firstly, you must rephrase my question in elegant English." +
        "Secondly, if I ask you program questions, you must provide some code examples besides answer my question." +
        "At last, after answering my questions, you must provide at least 3 related urls. " +
        "my question is: \n\n{query}"
    });
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