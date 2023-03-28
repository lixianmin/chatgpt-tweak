import "@src/styles/index.css";
import { onMount } from "solid-js";
import { getSubmitButton, getTextArea } from "@pages/content/widgets/ElementFinder";
import { getUserConfig } from "@src/dao/UserConfig";
import { compilePrompt } from "@pages/content/widgets/PromptManager";
import Toolbar from "@pages/content/widgets/Toolbar";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const App = () => {
  onMount(() => {
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

    function showErrorMessage(error: any) {
      console.info("WebChatGPT error --> API error: ", error);
      // const div = document.createElement('div')
      // document.body.appendChild(div)
      // render(<ErrorMessage message={error.message}/>, div)
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
        const userConfig = await getUserConfig();
        if (!userConfig.webAccess) {
          pressEnter();
          isProcessing = false;
          return;
        }

        try {
          textarea.value = await compilePrompt(query);
          console.log(`query=${query}, textarea.value=${textarea.value}`);

          pressEnter();
        } catch (error) {
          showErrorMessage(error);
        }

        isProcessing = false;
      }
    }

    textarea.addEventListener("keydown", onSubmit);
    btnSubmit.addEventListener("click", onSubmit);

    // 这个after方法接收Node类型，与JSX.Element类型不一样，但是其实可以直接用，加 @ts-ignore解决ide的错误提示
    // @ts-ignore
    textarea.parentElement.after(<Toolbar id="tweak-toolbar"/>);
  });

  return <>
  </>;
};

export default App;
