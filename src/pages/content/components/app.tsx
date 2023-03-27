import "@src/styles/index.css";
import styles from "./App.module.css";
import { onMount } from "solid-js";
import { getSubmitButton, getTextArea } from "@pages/content/components/elementFinder";
import { getUserConfig } from "@src/dao/user_config";

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

        textarea.value = "";

        const userConfig = await getUserConfig();

        isProcessing = true;

        if (!userConfig.webAccess) {
          textarea.value = query;
          pressEnter();
          isProcessing = false;
          return;
        }

        textarea.value = "";

        try {
          // textarea.value = await compilePrompt(query);
          pressEnter();
          isProcessing = false;

        } catch (error) {
          isProcessing = false;
          showErrorMessage(error);
        }
      }
    }

    textarea.addEventListener("keydown", onSubmit);
    btnSubmit.addEventListener("click", onSubmit);
  });

  return (
    <div class="fixed right-5 top-20 z-[2000] w-80 rounded-xl bg-white">
      <div class={styles.App}>
      </div>
    </div>
  );
};

export default App;
