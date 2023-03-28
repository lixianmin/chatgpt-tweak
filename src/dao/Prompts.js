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
  const currentPrompt = useLocalStorage("tweak-current-prompt");
  if (!currentPrompt.get()) {
    const name = "default";
    const prompt = "{current_time}\nAfter answer my question, you must provide 3 related urls, my question is:\n{query}";

    currentPrompt.set(name);
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

  return {
    getCurrentName: () => currentPrompt.get(),
    setCurrentName: (name) => currentPrompt.set(name),
    loadPrompt: _loadPrompt,
    loadAllPrompts: _loadAllPrompts,
    addPrompt: _addPrompt,
    updatePrompt: _updatePrompt
  };
}