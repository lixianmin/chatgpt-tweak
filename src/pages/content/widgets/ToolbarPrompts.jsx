"use strict";

import { Button, ButtonGroup } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";
import { createEffect, For, Show } from "solid-js";
import { CommandType as Consts } from "@src/common/Consts.js";
import Browser from "webextension-polyfill";
import { getInputBox } from "@pages/content/widgets/ElementFinder.ts";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
export default function ToolbarPrompts() {
  const inputBox = getInputBox();
  const inputBoxParentHeight = inputBox.parentElement.offsetHeight;

  const prompts = usePrompts();
  let divList;

  createEffect(() => {
    const promptList = prompts.getHints();  // 这个用途目前就是为了触发createEffect()，以前用hints的数量来计算divList的高度，现在发现不需要
    // const buttonHeight = 37.58;  // small button，这个数值是从dev tools中测量出来的
    let delta = inputBoxParentHeight - divList.clientHeight;

    // 如果有Voice Control for chatgpt这个插件，则需要调整一下高度
    if (document.getElementById("sai-root")) {
      delta -= inputBoxParentHeight;
    }

    // console.log("delta", delta, "list", promptList.length, "inputBoxParentHeight", inputBoxParentHeight);
    divList.style.top = delta + "px";
  });

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
         style="position: absolute; left: 0; z-index: 1;">
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

