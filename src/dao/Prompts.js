"use strict";
/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { formatDateTime } from "@src/core/Time.js";
import createStoreBrowserStorage from "@src/core/StoreBrowserStorage.js";
import { createStore, produce } from "solid-js/store";

// 这个原来是用dexie来存储的，但是因为加载的时候会消耗30ms，导致chatgpt已经收到数据了，但textarea.value还没设置成功。所以改为localStorage试试
const [promptStorage, setPromptStorage] = await createStoreBrowserStorage("tweak-prompt-data", {
  current: "",
  list: []
});

const [promptState, setPromptState] = createStore({
  hintsVisible: false,
  hints: []
});

export default function usePrompts() {
  // 初始的时候默认加一个当前的prompt
  if (promptStorage.list.length === 0) {
    addBuiltinPrompts();
    // setPromptStorage("current", promptStorage.list[0].name);
  }

  function addBuiltinPrompts() {
    addPrompt({
      name: "translator",
      text: "{time}\nFirstly, you must firstly rephrase what I will say into elegant English. Secondly, if I am asking a question, please answer it in a new paragraph. What I will say is:\n\n{query}"
    });

    // addPrompt({
    //   name: "empty",
    //   text: "{query}"
    // });

    // addPrompt({
    //   name: "coder",
    //   text: "{time}\nSuppose you are a professional coder. Firstly, you must rephrase my question in elegant English." +
    //     "Secondly, if I ask you program questions, you must provide some code examples besides answer my question." +
    //     "At last, after answering my questions, you must provide at least 3 related urls. " +
    //     "my question is: \n\n{query}"
    // });
  }

  function getPromptByName(name) {
    for (let item of promptStorage.list) {
      if (item.name === name) {
        return item;
      }
    }
  }

  function indexOfByName(name) {
    const list = promptStorage.list;
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
    const list = promptStorage.list;
    if (index >= 0 && index < list.length) {
      return list[index];
    }
  }

  function deletePromptByName(name) {
    const index = indexOfByName(name);
    deletePromptByIndex(index);
  }

  function deletePromptByIndex(index) {
    const list = promptStorage.list;
    if (index >= 0 && index < list.length) {
      setPromptStorage(produce(draft => {
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
    const list = promptStorage.list;
    if (index >= 0 && index < list.length) {
      setPromptStorage(produce(draft => {
        draft.list[index] = prompt;
        // console.log("draft", draft, "index", index, "prompt", prompt);
      }));
    }
  }

  function addPrompt(prompt) {
    setPromptStorage(produce(draft => {
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
    const current = promptStorage.current;
    if (current) {
      const prompt = getPromptByName(current);
      const time = formatDateTime(new Date());

      const text = _replaceVariables(prompt.text, {
        "{query}": query,
        "{time}": time
      });

      return text;
    }

    return query;
  }

  function setHints(list) {
    setPromptState(produce(draft => {
      draft.hints = list;
    }));
  }

  return {
    getCurrentPrompt: () => promptStorage.current,
    setCurrentPrompt: (current) => setPromptStorage("current", current),
    addPrompt: addPrompt,
    getPromptList: () => promptStorage.list,
    getPromptByName: getPromptByName,
    setPromptByName: setPromptByName,
    getPromptByIndex: getPromptByIndex,
    deletePromptByName: deletePromptByName,
    getHintsVisible: () => promptState.hintsVisible,
    setHintsVisible: (visible) => setPromptState("hintsVisible", visible),
    getHints: () => promptState.hints,
    setHints: setHints,
    compilePrompt: compilePrompt
  };
}