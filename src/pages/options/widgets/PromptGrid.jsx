"use strict";
import usePrompts from "@src/dao/Prompts.js";
import { For } from "solid-js";
import PromptItem from "@pages/options/widgets/PromptItem.jsx";
import { Form } from "solid-bootstrap";
import AddPromptItem from "@pages/options/widgets/AddPromptItem.jsx";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptGrid() {
  const prompts = usePrompts();

  return <>
    <Form>
      <AddPromptItem prompts={prompts} />
      <For each={prompts.getPromptList().slice().reverse()}>{(prompt, reverseIndex) => {
        return <PromptItem prompts={prompts} reverseIndex={reverseIndex()}></PromptItem>;
      }}</For>
    </Form>
  </>;
}
