"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import Dexie from "dexie";
import useLocalStorage from "@src/core/LocalStorage.js";

export default function usePrompts() {
  const db = new Dexie("tweak-prompts");
  db.version(1).stores({
    prompts: "++id, name, prompt",
    current: "promptId, name"
  });

  // 初始的时候默认加一个当前的prompt
  const currentName = useLocalStorage("tweak-current-prompt");
  if (!currentName.get()) {
    const name = "default";
    const prompt = "{current_time}\nAfter answer my question, you must provide 3 related urls, my question is:\n{query}";

    currentName.set(name);
    _addPrompt(name, prompt).then();
  }

  async function _loadPrompt(name) {
    const item = await db.prompts.where({ name }).first();
    return item ? item.prompt : "";
  }

  async function _loadAllPrompts() {
    const items = await db.prompts.toArray();
    return items;
  }

  async function _addPrompt(name, prompt) {
    await db.prompts.add({ name, prompt });
  }

  async function _updatePrompt(name, prompt) {
    await db.prompts.where({ name }).modify({ prompt });
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

  async function _compilePrompt(query) {
    const name = currentName.get();
    const prompt = await _loadPrompt(name);

    const now = new Date();
    let currentTime = now.toISOString().slice(0, 19).replace("T", " ");

    const nextPrompt = _replaceVariables(prompt, {
      "{query}": query,
      "{current_time}": currentTime
    });

    return nextPrompt;
  }

  return {
    getCurrentName: () => currentName.get(),
    setCurrentName: (name) => currentName.set(name),
    loadPrompt: _loadPrompt,
    loadAllPrompts: _loadAllPrompts,
    addPrompt: _addPrompt,
    updatePrompt: _updatePrompt,
    compilePrompt: _compilePrompt
  };
}