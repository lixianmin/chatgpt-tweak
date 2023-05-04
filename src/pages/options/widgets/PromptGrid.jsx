"use strict";
import usePrompts from "@src/dao/Prompts.js";
import PromptItem from "@pages/options/widgets/PromptItem.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import AddPromptItem from "@pages/options/widgets/AddPromptItem.jsx";
import { For } from "solid-js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptGrid() {
  const prompts = usePrompts();

  function reveredPromptList() {
    return prompts.getPromptList().slice().reverse();
  }

  // 通过在一行中把所有的column都放进来，然后设置 md='auto'，可以进行自动排版
  return <>
    <Form>
      <Row>
        <Col md="auto">
          <AddPromptItem prompts={prompts} />
        </Col>
        <For each={reveredPromptList()}>{(prompt, reverseIndex) => {
          return <Col md="auto">
            <PromptItem prompts={prompts} reverseIndex={reverseIndex()}></PromptItem>
          </Col>;
        }}</For>
      </Row>
    </Form>
  </>;
}
