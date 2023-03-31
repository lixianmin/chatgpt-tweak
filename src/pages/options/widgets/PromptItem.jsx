"use strict";

import { Button, Card, CloseButton, Col, Form, Row } from "solid-bootstrap";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptItem(props) {
  const prompts = props.prompts;
  const promptIndex = props.promptIndex;

  const currentPrompt = prompts.getPromptByIndex(promptIndex);
  let textarea;

  function onClickSave() {
    // console.log("textarea.value:", textarea.value);
    const next = { name: currentPrompt.name, prompt: textarea.value };
    prompts.setPromptByIndex(promptIndex, next);
  }

  function onClickReset() {
    textarea.value = currentPrompt.prompt;
  }

  function onClickDelete() {
    prompts.deletePromptByIndex(promptIndex);
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
            <Form.Control type="text" placeholder="Name" value={currentPrompt.name} />
          </Col>
          <Col xs="1">
            <CloseButton onClick={onClickDelete} />
          </Col>
        </Row>

        <Form.Control ref={textarea} as="textarea" rows={3} value={currentPrompt.prompt} />

        <Button variant="outline-primary" size="sm" onClick={onClickSave}>Save</Button>
        <Button variant="outline-danger" size="sm" onClick={onClickReset}>Reset</Button>
      </Card.Body>
    </Card>
  </>;
}
