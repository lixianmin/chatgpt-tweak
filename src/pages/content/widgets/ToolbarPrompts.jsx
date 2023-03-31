"use strict";

import { Button, Form } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { createEffect, createSignal, For, Show } from "solid-js";

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

  function onChange(evt) {
    const name = evt.target.value;
    setCurrentPromptName(name);

    removeFocusFromCurrentElement();
  }

  function removeFocusFromCurrentElement() {
    document.activeElement?.blur();
  }

  function onClickAdd() {
    prompts.addPrompt("hello", "world");
  }

  return <>
    <Button onClick={onClickAdd}>Add</Button>
    <Form.Select onChange={onChange}>
      <For each={prompts.getAllPrompts().slice().reverse()}>{(prompt, index) => {
        return <Show when={currentPromptName() === prompt.name} fallback={
          <option name={prompt.name}>{prompt.name}</option>
        } keyed>
          <option selected="true">{prompt.name}</option>
        </Show>;
      }}</For>
    </Form.Select>
  </>;
}

