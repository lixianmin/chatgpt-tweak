import "@src/styles/index.css";
import { onMount } from "solid-js";
import { getSubmitButton, getTextArea } from "@pages/content/widgets/ElementFinder";
import useUserConfig from "@src/dao/UserConfig";
import { compilePrompt } from "@pages/content/widgets/PromptManager";
import Toolbar from "@pages/content/widgets/Toolbar";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const App = () => {
  const toolbarId = "tweak-toolbar";

  function attachTweakUI() {
    let isProcessing = false;
    const textarea = getTextArea();
    const btnSubmit = getSubmitButton();

    function pressEnter() {
      textarea.focus();
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter"
      });
      textarea.dispatchEvent(enterEvent);
    }

    async function onSubmit(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent && event.shiftKey && event.key === "Enter") {
        return;
      }

      if (event instanceof KeyboardEvent && event.key === "Enter" && event.isComposing) {
        return;
      }

      if ((event.type === "click" || (event instanceof KeyboardEvent && event.key === "Enter")) && !isProcessing) {

        const query = textarea.value.trim();
        if (query === "") {
          return;
        }

        isProcessing = true;
        const userConfig = useUserConfig();
        if (!userConfig.webAccess.get()) {
          pressEnter();
          isProcessing = false;
          return;
        }

        try {
          textarea.value = await compilePrompt(query);
          // console.log(`query=${query}, textarea.value=${textarea.value}`);

          pressEnter();
        } catch (err) {
          console.error(err);
        }

        isProcessing = false;
      }
    }

    textarea.addEventListener("keydown", onSubmit);
    btnSubmit.addEventListener("click", onSubmit);

    // 这个after方法接收Node类型，与JSX.Element类型不一样，但是其实可以直接用，加 @ts-ignore解决ide的错误提示
    // @ts-ignore
    textarea.parentElement.after(<Toolbar id={toolbarId} />);
  }

  function checkAttachTweakUI() {
    const intervalId = setInterval(() => {
      attachTweakUI();
      const toolbar1 = document.getElementById(toolbarId);
      if (toolbar1) {
        clearInterval(intervalId);
      }
    }, 200);
  }

  onMount(() => {
    checkAttachTweakUI();
  });

  return <>
  </>;
};

export default App;
