"use strict";

import { Button, Card, Col, Form, Row } from "solid-bootstrap";
import { CommandType } from "@src/common/Consts.js";
import { createTabBusChatGPT } from "@src/core/TabBus.js";
import { IoTrash } from "solid-icons/io";
import IconButton from "@src/core/widgets/IconButton.jsx";
import { createSignal, Show } from "solid-js";
import { ImCross } from "solid-icons/im";

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

  // 删除需要二次确认，否则容易误除
  const [confirmDelete, setConfirmDelete] = createSignal(false);
  
  function onClickSave() {
    // console.log("textarea.value:", textarea.value);
    const name = currentPrompt.name;
    const next = { name: name, text: textControl.value };
    prompts.setPromptByName(name, next);
  }

  function onClickReset() {
    textControl.value = currentPrompt.text;
  }

  function onClickDelete() {
    if (!confirmDelete()) {
      setConfirmDelete(true);
    } else {
      // 这个index，因为可以删除多次，因此会变化，因此需要每次重新获取
      const name = currentPrompt.name;
      prompts.deletePromptByName(name);
      tabBus.broadcastMessage({ cmd: CommandType.deletePromptByName, name });
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
            <IconButton size="sm" color="tomato" hoverColor="darkred" onClick={onClickDelete}
                        disabled={currentPrompt.name === prompts.getCurrentPrompt()}>
              <Show when={confirmDelete()} keyed
                    fallback={
                      <IoTrash size={24} />
                    }
              >
                <ImCross size={20} />
              </Show>
            </IconButton>
          </Col>
        </Row>

        <Form.Control ref={textControl} as="textarea" rows={3} value={currentPrompt.text} />

        <Button variant="outline-primary" size="sm" onClick={onClickSave}>Save</Button>
        <Button variant="outline-danger" size="sm" onClick={onClickReset}>Reset</Button>
      </Card.Body>
    </Card>
  </>;
}
