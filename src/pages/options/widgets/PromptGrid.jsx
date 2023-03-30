"use strict";
import usePrompts from "@src/dao/Prompts.js";
import { For } from "solid-js";
import PromptItem from "@pages/options/widgets/PromptItem.jsx";
import { Form } from "solid-bootstrap";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptGrid(props) {
  const prompts = usePrompts();

  return <>
    <Form>
      <For each={prompts.getAllPrompts()}>{(prompt, index) => {
        return <PromptItem promptIndex={index()}></PromptItem>;
      }}</For>
    </Form>
  </>;
}
