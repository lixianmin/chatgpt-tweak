import { getCurrentLanguageName, getLocaleLanguage, getTranslation, localizationKeys } from "@src/core/Locale";
import usePrompts from "@src/dao/Prompts";

export const SAVED_PROMPTS_KEY = "saved_prompts";

export interface Prompt {
  uuid?: string,
  name: string,
  text: string
}

const removeCommands = (query: string) => query.replace(/\/page:(\S+)\s+/g, "").replace(/\/site:(\S+)\s+/g, "");

const prompts = usePrompts();

export const compilePrompt = async (query: string) => {
  const currentName = prompts.getCurrentName();
  const currentPrompt = await prompts.loadPrompt(currentName);

  const now = new Date();
  let currentTime = now.toISOString().slice(0, 19).replace("T", " ");

  const prompt = replaceVariables(currentPrompt, {
    "{query}": removeCommands(query),
    "{current_time}": currentTime
  });

  // console.log(`prompt= ${prompt}`)
  return prompt;
};

const replaceVariables = (prompt: string, variables: { [key: string]: string }) => {
  let newPrompt = prompt;
  for (const key in variables) {
    try {
      newPrompt = newPrompt.replaceAll(key, variables[key]);
    } catch (error) {
      console.info("WebChatGPT error --> API error: ", error);
    }
  }
  return newPrompt;
};

export const getDefaultPrompt = () => {
  return {
    name: "Default prompt",
    text: getTranslation(localizationKeys.defaultPrompt, "en") + (getLocaleLanguage() !== "en" ? `\nReply in ${getCurrentLanguageName()}` : ""),
    uuid: "default"
  };
};

const getDefaultEnglishPrompt = () => {
  return { name: "Default English", text: getTranslation(localizationKeys.defaultPrompt, "en"), uuid: "default_en" };
};

export const getSavedPrompts = async (addDefaults = true) => {
  const data = localStorage.getItem(SAVED_PROMPTS_KEY) ?? [];
  const savedPrompts = data[SAVED_PROMPTS_KEY] || [];

  if (addDefaults) {
    return addDefaultPrompts(savedPrompts);
  }

  return savedPrompts;
};

function addDefaultPrompts(prompts: Prompt[]) {

  if (getLocaleLanguage() !== "en") {
    addPrompt(prompts, getDefaultEnglishPrompt());
  }
  addPrompt(prompts, getDefaultPrompt());
  return prompts;

  function addPrompt(prompts: Prompt[], prompt: Prompt) {
    const index = prompts.findIndex((i: Prompt) => i.uuid === prompt.uuid);
    if (index >= 0) {
      prompts[index] = prompt;
    } else {
      prompts.unshift(prompt);
    }
  }
}