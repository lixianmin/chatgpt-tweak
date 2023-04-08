"use strict";

import { Button, ButtonGroup } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { createEffect, For, Show } from "solid-js";
import { CommandType as Consts } from "@src/common/Consts.js";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
export default function ToolbarPrompts() {
  const prompts = usePrompts();
  let divList;

  createEffect(() => {
    const promptList = prompts.getPromptList();
    const buttonHeight = 46.33;
    const delta = -buttonHeight * (promptList.length - 1);
    // console.log("delta", delta, "list", promptList.length);
    divList.style.top = delta + "px";
  });

  function onClick(evt) {
    let name = evt.target.value;
    prompts.setCurrentPrompt(name);
    removeFocusFromCurrentElement();

    // 通知options page
    Browser.runtime.sendMessage({ cmd: Consts.setCurrentPrompt, name });
  }

  function removeFocusFromCurrentElement() {
    document.activeElement?.blur();
  }

  return <>
    <div ref={divList}
         style="position: absolute; left: 0; z-index: 1;">
      <Show when={prompts.getVisible()} keyed>
        <ButtonGroup vertical>
          <For each={prompts.getPromptList()}>{(prompt, index) => {
            return <Show when={prompts.getCurrentPrompt() === prompt.name} keyed fallback={
              <Button onClick={onClick} value={prompt.name}>{prompt.name}</Button>
            }>
              <Button onClick={onClick} value={prompt.name} active>{prompt.name}</Button>
            </Show>;
          }}</For>
        </ButtonGroup>
      </Show>
    </div>

    {/*<DropdownButton variant="outline-info"*/}
    {/*                as={ButtonGroup}*/}
    {/*                size="sm"*/}
    {/*                title={prompts.getCurrentPrompt()}*/}
    {/*                onSelect={onSelectPromptName}>*/}
    {/*  <For each={prompts.getPromptList()}>{(prompt, index) => {*/}
    {/*    return <Show when={prompts.getCurrentPrompt() === prompt.name} keyed fallback={*/}
    {/*      <Dropdown.Item eventKey={prompt.name}>{prompt.name}</Dropdown.Item>*/}
    {/*    }>*/}
    {/*      <Dropdown.Item eventKey={prompt.name} active>{prompt.name}</Dropdown.Item>*/}
    {/*    </Show>;*/}
    {/*  }}</For>*/}
    {/*  <Button variant="outline-info" style={{ background: "transparent", border: "none" }}*/}
    {/*          onClick={() => Browser.runtime.sendMessage({ cmd: CommandType.openOptionsPage })}>*/}
    {/*    {_T("+ New Prompt")}*/}
    {/*  </Button>*/}
    {/*</DropdownButton>*/}
  </>;
}

