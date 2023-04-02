"use strict";

import { Form } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { For, Show } from "solid-js";
import { CommandType } from "@src/common/Consts.js";
import { createTabBusChatGPT } from "@src/core/TabBus.js";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
export default function ToolbarPrompts() {
  const prompts = usePrompts();
  const tabBus = createTabBusChatGPT();

  tabBus.mountListener(request => {
    switch (request.cmd) {
      case CommandType.addPrompt:
        prompts.addPrompt(request.newPrompt);
        break;
      case CommandType.deletePromptByIndex:
        prompts.deletePromptByIndex(request.promptIndex);
        break;
    }
  });

  function onChange(evt) {
    const name = evt.target.value;
    prompts.setCurrentPrompt(name);

    removeFocusFromCurrentElement();
  }

  function removeFocusFromCurrentElement() {
    document.activeElement?.blur();
  }

  return <>
    <Form.Select onChange={onChange}>
      <For each={prompts.getPromptList()}>{(prompt, index) => {
        return <Show when={prompts.getCurrentPrompt() === prompt.name} fallback={
          <option name={prompt.name}>{prompt.name}</option>
        } keyed>
          <option selected="true">{prompt.name}</option>
        </Show>;
      }}</For>
    </Form.Select>
  </>;
}

