import { onMount } from "solid-js";
import { getSubmitButton, getTextarea } from "@pages/content/widgets/ElementFinder";
import useUserConfig from "@src/dao/UserConfig";
import Toolbar from "@pages/content/widgets/Toolbar";
import usePrompts from "@src/dao/Prompts";
import { render } from "solid-js/web";
import attachTabBusListener from "@pages/content/widgets/ContentMessageListener";

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

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        if (!event.shiftKey && !event.isComposing) {
          onSubmit();
        }
        break;
    }
  }

  function onSubmit() {
    const textarea = getTextarea();
    if (textarea && !isProcessing) {
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

    textarea.addEventListener("keydown", onKeyDown);
    btnSubmit.addEventListener("click", onSubmit);

    render(() => <Toolbar id={toolbarId} />, textarea.parentElement.parentElement);
  }

  function checkAttachTweakUI() {
    try {
      // todo 这里实际上是创建了两个Toolbar，第一个创建了，但是不知道为啥消失不见的
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

  attachTabBusListener();

  return <>
  </>;
};

export default App;
