"use strict";

import { Button, ButtonGroup } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { For, Show } from "solid-js";
import { CommandType as Consts } from "@src/common/Consts.js";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
export default function ToolbarTopPrompts() {
  const prompts = usePrompts();
  let divList;

  function onClick(evt) {
    // console.log("evt.target.value", evt.target.value);
    let name = evt.target.value;
    if (prompts.getCurrentPrompt() === name) {
      prompts.setCurrentPrompt("");
    } else {
      prompts.setCurrentPrompt(name);
    }

    removeFocusFromCurrentElement();

    // 通知options page
    Browser.runtime.sendMessage({ cmd: Consts.setCurrentPrompt, name });
  }

  function removeFocusFromCurrentElement() {
    document.activeElement?.blur();
  }

  function getPromptButtonName(prompt) {
    const name = prompt.name;
    if (prompts.getCurrentPrompt() === name) {
      return name + " ♧";
    }

    return name;
  }

  function getPromptButtonVariant(prompt, index) {
    const hintIndex = prompts.getCurrentHintIndex();
    // console.log("hintIndex", hintIndex, "index", index());

    if (hintIndex === index()) {
      return "success";
    } else {
      return "primary";
    }
  }

  return <>
    <div ref={divList}
         style="position: relative; left: 0; top:0; z-index: 1;">
      <Show when={prompts.getHintsVisible()} keyed>
        <ButtonGroup vertical>
          <For each={prompts.getHints()}>{(prompt, index) => {
            return <Button size="sm" onClick={onClick} value={prompt.name}
                           variant={getPromptButtonVariant(prompt, index)}
                           style="text-align: left;">{getPromptButtonName(prompt)}</Button>;
          }}</For>
        </ButtonGroup>
      </Show>
    </div>
  </>;
}

