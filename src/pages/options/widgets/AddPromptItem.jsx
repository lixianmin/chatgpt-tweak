"use strict";

import { Alert, Button, Card, Col, Form, Row } from "solid-bootstrap";
import { createSignal } from "solid-js";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function AddPromptItem(props) {
  const prompts = props.prompts;
  const [showWarning, setShowWarning] = createSignal(false);

  let nameControl;
  let textControl;

  function onChangeName() {
    const name = nameControl.value.trim();
    const last = prompts.getPromptByName(name);
    // console.log("name: ", name, "last", last);
    const warning = !!last;
    setShowWarning(warning);
  }

  function onClickAdd() {
    // console.log("textarea.value:", textarea.value);
    const name = nameControl.value.trim();
    const text = textControl.value.trim();
    if (!name || !text || name.length === 0 || text.length === 0) {
      return;
    }

    const next = { name, text };
    prompts.addPrompt(next);

    nameControl.value = "";
    textControl.value = "";
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
            <Form.Control ref={nameControl} type="text" placeholder="Name" onChange={onChangeName} />
          </Col>
        </Row>

        <Form.Control ref={textControl} as="textarea" rows={3} placeholder="Prompt text" />
        <Alert variant="warning" show={showWarning()}>
          A prompt with the same name already exists
        </Alert>
        <Button variant="outline-primary" size="sm" onClick={onClickAdd} disabled={showWarning()}>Add</Button>
      </Card.Body>
    </Card>
  </>;
}
