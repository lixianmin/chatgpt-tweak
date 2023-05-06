"use strict";

import { Button, Card, Col, Form, Row } from "solid-bootstrap";
import { CommandType } from "@src/common/Constants.js";
import { createTabMessageBusSites } from "@src/core/MessageBus.js";
import { IoTrash } from "solid-icons/io";
import IconButton from "@src/core/widgets/IconButton.jsx";
import { createSignal, Show } from "solid-js";
import { FiX } from "solid-icons/fi";
import { _T } from "@src/common/Locale.js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const tabBus = createTabMessageBusSites();

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
    tabBus.broadcastMessage({ cmd: CommandType.savePrompt, name: name, prompt: next });
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

  // 如果一个element想被drag必须加上draggable属性
  return <>
    <Card draggable
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
                <FiX size={26} />
              </Show>
            </IconButton>
          </Col>
        </Row>

        <Form.Control ref={textControl} as="textarea" rows={3} value={currentPrompt.text} />

        <Row>
          <Col xs="auto">
            <Button variant="outline-primary" size="sm" onClick={onClickSave}>{_T("Save")}</Button>
          </Col>
          <Col xs="auto">
            <Button variant="outline-danger" size="sm" xs="4" onClick={onClickReset}>{_T("Reset")}</Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </>;
}
