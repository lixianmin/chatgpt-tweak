"use strict";

import { Dropdown, DropdownButton } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { createEffect, createSignal, For, Show } from "solid-js";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptDropdown() {
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
    <DropdownButton id="dropdown-basic-button" title={currentPromptName()}>
      <For each={prompts.loadAllPrompts()}>{(prompt, index) => {
        return <Show when={currentPromptName() === prompt.name} fallback={
          <Dropdown.Item onClick={onClickItem} name={prompt.name}>{prompt.name}</Dropdown.Item>
        } keyed>
          <Dropdown.Item active>{prompt.name}</Dropdown.Item>
        </Show>;
      }
      }</For>
    </DropdownButton>
  </>;
}

