import { onMount } from "solid-js";
import { getSubmitButton, getTextarea } from "@pages/content/widgets/ElementFinder";
import useUserConfig from "@src/dao/UserConfig";
import Toolbar from "@pages/content/widgets/Toolbar";
import usePrompts from "@src/dao/Prompts";
import { render } from "solid-js/web";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const App = () => {
  const toolbarId = "tweak-toolbar";
  let isProcessing = false;
  const prompts = usePrompts();

  function pressEnter() {
    const textarea = getTextarea();
    if (textarea) {
      textarea.focus();
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter"
      });
      textarea.dispatchEvent(enterEvent);
    }
  }

  async function onSubmit(event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && event.shiftKey && event.key === "Enter") {
      return;
    }

    if (event instanceof KeyboardEvent && event.key === "Enter" && event.isComposing) {
      return;
    }

    const textarea = getTextarea();
    if (textarea && (event.type === "click" || (event instanceof KeyboardEvent && event.key === "Enter")) && !isProcessing) {
      const query = textarea.value.trim();
      if (query !== "") {
        isProcessing = true;
        const userConfig = useUserConfig();
        if (userConfig.toolbarEnable) {
          textarea.value = prompts.compilePrompt(query);
          // console.log(`textarea.value=${textarea.value}`);
        }

        pressEnter();
        isProcessing = false;
      }
    }
  }

  function attachTweakUI() {
    const textarea = getTextarea();
    const btnSubmit = getSubmitButton();
    if (!textarea || !btnSubmit) {
      return;
    }

    textarea.addEventListener("keydown", onSubmit);
    btnSubmit.addEventListener("click", onSubmit);

    render(() => <Toolbar id={toolbarId} />, textarea.parentElement.parentElement);
  }

  function checkAttachTweakUI() {
    try {
      // 因为chatgpt的页面变来变去，重新加载什么的都很多，发现哪怕使用MutationObserver也抓不住。定期轮询是最稳定的
      setInterval(() => {
        const toolbar = document.getElementById(toolbarId);
        if (!toolbar) {
          attachTweakUI();
        }
      }, 200);
    } catch (err) {
      console.error(err);
    }
  }

  onMount(() => {
    checkAttachTweakUI();
  });

  return <>
  </>;
};

export default App;
