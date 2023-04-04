"use strict";

import { Button, ButtonGroup, Dropdown, DropdownButton } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { For, Show } from "solid-js";
import { CommandType } from "@src/common/Consts.js";
import { createTabBusChatGPT } from "@src/core/TabBus.js";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
export default function ToolbarPrompts() {
  const prompts = usePrompts();
  const tabBus = createTabBusChatGPT();

  // todo 修改语言的时候，content界面没有收到
  tabBus.mountListener(request => {
    switch (request.cmd) {
      case CommandType.addPrompt:
        prompts.addPrompt(request.newPrompt);
        break;
      case CommandType.deletePromptByName:
        prompts.deletePromptByName(request.name);
        break;
      case CommandType.savePrompt:
        prompts.setPromptByName(request.name, request.prompt);
        break;
    }
  });

  // function onChange(evt) {
  //   const name = evt.target.value;
  //   prompts.setCurrentPrompt(name);
  //
  //   removeFocusFromCurrentElement();
  // }

  function onSelectPromptName(name) {
    prompts.setCurrentPrompt(name);
    removeFocusFromCurrentElement();
  }

  function removeFocusFromCurrentElement() {
    document.activeElement?.blur();
  }

  return <>
    <DropdownButton variant="outline-success"
                    as={ButtonGroup}
                    title={prompts.getCurrentPrompt()}
                    onSelect={onSelectPromptName}>
      <For each={prompts.getPromptList()}>{(prompt, index) => {
        return <Show when={prompts.getCurrentPrompt() === prompt.name} keyed fallback={
          <Dropdown.Item eventKey={prompt.name}>{prompt.name}</Dropdown.Item>
        }>
          <Dropdown.Item eventKey={prompt.name} active>{prompt.name}</Dropdown.Item>
        </Show>;
      }}</For>
      <Button variant="outline-info" style={{ background: "transparent", border: "none" }}
              onClick={() => Browser.runtime.sendMessage({ cmd: CommandType.openOptionsPage })}>
        + New Prompt
      </Button>
    </DropdownButton>

    {/*<Form.Select onChange={onChange}>*/}
    {/*  <For each={prompts.getPromptList()}>{(prompt, index) => {*/}
    {/*    return <Show when={prompts.getCurrentPrompt() === prompt.name} fallback={*/}
    {/*      <option name={prompt.name}>{prompt.name}</option>*/}
    {/*    } keyed>*/}
    {/*      <option selected="true">{prompt.name}</option>*/}
    {/*    </Show>;*/}
    {/*  }}</For>*/}
    {/*</Form.Select>*/}
  </>;
}

