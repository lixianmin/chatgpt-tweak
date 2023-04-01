"use strict";

import { Badge, Button, Card, Col, Form, Row } from "solid-bootstrap";
import { createSignal } from "solid-js";
import Browser from "webextension-polyfill";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function AddPromptItem(props) {
  const prompts = props.prompts;
  const [showWarning, setShowWarning] = createSignal(false);
  const [disableAddButton, setDisableAddButton] = createSignal(true);
  const [nameSignal, setNameSignal] = createSignal("");

  let nameControl;
  let textControl;

  function onInputName() {
    const name = nameControl.value.trim();
    const last = prompts.getPromptByName(name);
    // console.log("name: ", name, "last: ", last);

    const warning = !!last;
    setShowWarning(warning);
    if (warning) {
      setNameSignal(name);
      // console.log("warning name:", name, "nameSignal():", nameSignal());
    }
    checkDisableAddButton();
  }

  function onInputText() {
    checkDisableAddButton();
  }

  function onClickAdd() {
    // console.log("textarea.value:", textarea.value);
    const name = nameControl.value.trim();
    const text = textControl.value.trim();

    if (!name || !text || name.length === 0 || text.length === 0) {
      console.log("name:", name, "text:", text);
      return;
    }

    const newPrompt = { name, text };
    prompts.addPrompt(newPrompt);

    nameControl.value = "";
    textControl.value = "";

    setDisableAddButton(true);
    notifyAddNewPrompt(newPrompt);
  }

  function notifyAddNewPrompt(newPrompt) {
    // Browser.runtime.sendMessage({ cmd: "add.new.prompt" });
    Browser.tabs.query({ url: "https://chat.openai.com/*" }).then(tabs => {
      for (let tab of tabs.values()) {
        Browser.tabs.sendMessage(tab.id, { cmd: "add.new.prompt", newPrompt }).then();
      }
    });
  }

  function checkDisableAddButton() {
    const name = nameControl.value.trim();
    const text = textControl.value.trim();
    const disable = !name || !text || showWarning();

    // console.log("!name", !name, "!text", !text, "showWarning", showWarning());
    setDisableAddButton(disable);
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
            <Form.Control ref={nameControl} type="text" placeholder="Name" onInput={onInputName} />
          </Col>
        </Row>

        <Form.Control ref={textControl} as="textarea" rows={3} placeholder="Prompt text" onInput={onInputText} />

        <Row>
          <h5>
            <Badge bg="warning" hidden={!showWarning()}>The name="{nameSignal()}" already exists</Badge>
          </h5>
        </Row>
        <Button variant="outline-primary" size="sm" onClick={onClickAdd} disabled={disableAddButton()}>Add</Button>
      </Card.Body>
    </Card>
  </>;
}
