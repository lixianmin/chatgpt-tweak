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

const invalidCurrentHintIndex = -9999;
const [promptState, setPromptState] = createStore({
  hintsVisible: false,
  hints: [],
  currentHintIndex: invalidCurrentHintIndex
});

export default function usePrompts() {
  // 初始的时候默认加一个当前的prompt
  if (promptStorage.list.length === 0) {
    addBuiltinPrompts();
    // setPromptStorage("current", promptStorage.list[0].name);
  }

  function addBuiltinPrompts() {
    // 这次改写移除了prompt中的xml的tag, 因为claude会过滤这些tag导致发不出来
    addPrompt({
      name: "translator",
      text: "{time}\n" +
        "Rephrase the text delimited by triple backticks into elegant English. And then if this text is a question, answer the question.\n\n" +
        "using the following format:\n" +
        "1. Rephrased: [rephrased text]\n" +
        "2. Answer: [answer of the question]\n\n" +
        "TEXT: ```{query}```"
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

  function swapPromptByIndex(index1, index2) {
    const list = promptStorage.list;
    if (index1 !== index2 && index1 >= 0 && index1 < list.length && index2 >= 0 && index2 < list.length) {
      setPromptStorage(produce(draft => {
          const list = draft.list;
          const temp = list[index1];
          list[index1] = list[index2];
          list[index2] = temp;
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

  function setHintsVisible(visible) {
    setPromptState(produce(draft => {
      draft.hintsVisible = visible;
      draft.currentHintIndex = invalidCurrentHintIndex;
    }));
  }

  function setHints(list) {
    setPromptState(produce(draft => {
      draft.hints = list;
    }));
  }

  function moveCurrentHintIndex(step) {
    setPromptState(produce(draft => {
      const maxIndex = draft.hints.length - 1;
      if (draft.currentHintIndex === invalidCurrentHintIndex) {
        const isArrowDown = step === 1;
        if (isArrowDown) {
          draft.currentHintIndex = 0;
        } else {
          draft.currentHintIndex = maxIndex;
        }
      } else {
        let nextIndex = draft.currentHintIndex + step;
        if (nextIndex < 0) {
          nextIndex = maxIndex;
        } else if (nextIndex > maxIndex) {
          nextIndex = 0;
        }

        draft.currentHintIndex = nextIndex;
      }

      // console.log("currentHintIndex", draft.currentHintIndex);
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
    setHintsVisible: setHintsVisible,
    getHints: () => promptState.hints,
    setHints: setHints,
    getCurrentHintIndex: () => promptState.currentHintIndex,
    moveCurrentHintIndex: moveCurrentHintIndex,
    compilePrompt: compilePrompt,
    swapPromptByIndex: swapPromptByIndex
  };
}