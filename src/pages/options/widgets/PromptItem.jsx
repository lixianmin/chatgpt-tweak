"use strict";

import { Button, Card, CloseButton, Col, Form, Row } from "solid-bootstrap";
import { CommandType } from "@src/common/Consts.js";
import { createTabBusChatGPT } from "@src/core/TabBus.js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const tabBus = createTabBusChatGPT();

export default function PromptItem(props) {
  const prompts = props.prompts;
  const list = prompts.getPromptList();
  const currentPrompt = prompts.getPromptByIndex(list.length - props.reverseIndex - 1);
  let textControl;

  function getPromptIndex() {
    // 这个index，因为可以多次删除或新建，因此会变化，因此需要每次重新获取
    return prompts.indexOfByName(currentPrompt.name);
  }

  function onClickSave() {
    // console.log("textarea.value:", textarea.value);
    const index = getPromptIndex();
    if (index >= 0) {
      const next = { name: currentPrompt.name, text: textControl.value };
      prompts.setPromptByIndex(index, next);
    }
  }

  function onClickReset() {
    textControl.value = currentPrompt.text;
  }

  function onClickDelete() {
    // 这个index，因为可以删除多次，因此会变化，因此需要每次重新获取
    const index = getPromptIndex();
    if (index >= 0) {
      prompts.deletePromptByIndex(index);
      tabBus.broadcastMessage({ cmd: CommandType.deletePromptByIndex, index });
    }
  }

  return <>
    <Card
      border="success"
      style={{ width: "18rem" }}
      class="m-2"
    >

      <Card.Body>
        <Row>
          <Col xs="10">
            <Card.Subtitle>{currentPrompt.name}</Card.Subtitle>
          </Col>
          <Col xs="1">
            <CloseButton onClick={onClickDelete} disabled={currentPrompt.name === prompts.getCurrentPrompt()} />
          </Col>
        </Row>

        <Form.Control ref={textControl} as="textarea" rows={3} value={currentPrompt.text} />

        <Button variant="outline-primary" size="sm" onClick={onClickSave}>Save</Button>
        <Button variant="outline-danger" size="sm" onClick={onClickReset}>Reset</Button>
      </Card.Body>
    </Card>
  </>;
}
