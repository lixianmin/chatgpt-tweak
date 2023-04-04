"use strict";

import { Badge, Button, Card, Form, Row } from "solid-bootstrap";
import { createSignal } from "solid-js";
import { CommandType } from "@src/common/Consts.js";
import { createTabBusChatGPT } from "@src/core/TabBus.js";
import { _T } from "@src/common/Locale.js";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
const tabBus = createTabBusChatGPT();

export default function AddPromptItem(props) {
  const prompts = props.prompts;
  const [showWarning, setShowWarning] = createSignal(false);
  const [disableAddButton, setDisableAddButton] = createSignal(true);
  // const [nameSignal, setNameSignal] = createSignal("");

  let nameControl;
  let textControl;

  function onInputName() {
    const name = nameControl.value.trim();
    const last = prompts.getPromptByName(name);
    // console.log("name: ", name, "last: ", last);

    const warning = !!last;
    setShowWarning(warning);
    if (warning) {
      // setNameSignal(name);
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
    tabBus.broadcastMessage({ cmd: CommandType.addPrompt, newPrompt });
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
        <Form.Control ref={nameControl} type="text" placeholder={_T("Name of the prompt")} onInput={onInputName} />
        <Form.Control ref={textControl} as="textarea" rows={3} placeholder={_T("Full content of the prompt")}
                      onInput={onInputText} />

        <Row>
          <h5>
            <Badge bg="warning" hidden={!showWarning()}>{_T("The same name already exists")}</Badge>
          </h5>
        </Row>
        <Button variant="outline-primary" size="sm" onClick={onClickAdd}
                disabled={disableAddButton()}>{_T("Add")}</Button>
      </Card.Body>
    </Card>
  </>;
}
