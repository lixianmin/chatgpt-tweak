"use strict";

import { Button, Card, Form } from "solid-bootstrap";
import usePrompts from "@src/dao/Prompts.js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptItem(props) {
  const prompts = usePrompts();
  const promptIndex = props.promptIndex;
  const currentPrompt = prompts.getPromptByIndex(promptIndex);
  let textarea;

  function onClickSave() {
    console.log("textarea.value:", textarea.value);
    console.log("currentPrompt.prompt:", currentPrompt.prompt);

    currentPrompt.prompt = textarea.value;
    prompts.setPromptByIndex(promptIndex, currentPrompt);

    console.log("set:", prompts.getPromptByIndex(promptIndex));
  }

  function onClickReset() {
    textarea.value = currentPrompt.prompt;
  }

  return <>
    <Card
      border="success"
      style={{ width: "18rem" }}
      class="m-2"
    >
      <Card.Header>{currentPrompt.name}</Card.Header>
      <Card.Body>
        <Form.Control ref={textarea} as="textarea" rows={3} value={currentPrompt.prompt} />

        <Button variant="outline-primary" onClick={onClickSave}>Save</Button>
        <Button variant="outline-danger" onClick={onClickReset}>Reset</Button>
      </Card.Body>
    </Card>
  </>;
}
