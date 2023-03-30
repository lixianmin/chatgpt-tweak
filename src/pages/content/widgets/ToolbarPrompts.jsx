"use strict";

import { Form } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { createEffect, createSignal, For } from "solid-js";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarPrompts() {
  const prompts = usePrompts();
  const [currentPromptName, setCurrentPromptName] = createSignal(prompts.getCurrentPromptName());
  createEffect(() => {
    prompts.setCurrentPromptName(currentPromptName());
  });

  function onClickItem(evt) {
    const name = evt.target.name;
    setCurrentPromptName(name);
    removeFocusFromCurrentElement();
  }

  function removeFocusFromCurrentElement() {
    document.activeElement?.blur();
  }

  return <>
    <Form.Select>
      <For each={prompts.getAllPrompts()}>{(prompt, index) => {
        return <Show when={currentPromptName() === prompt.name} fallback={
          <option onClick={onClickItem} name={prompt.name}>{prompt.name}</option>
        } keyed>
          <option>{prompt.name}</option>
        </Show>;
      }
      }</For>
    </Form.Select>
  </>;
}

