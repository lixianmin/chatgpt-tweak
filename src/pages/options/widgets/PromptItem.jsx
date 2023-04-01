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
  let textControl;

  function onClickSave() {
    // console.log("textarea.value:", textarea.value);
    const next = { name: currentPrompt.name, text: textControl.value };
    prompts.setPromptByIndex(promptIndex, next);
  }

  function onClickReset() {
    textControl.value = currentPrompt.text;
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
