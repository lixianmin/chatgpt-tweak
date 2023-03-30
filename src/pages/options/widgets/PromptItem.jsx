"use strict";

import { Button, Card } from "solid-bootstrap";
import { createSignal, Show } from "solid-js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptItem(props) {

  const [editing, setEditing] = createSignal(false);

  function onClickSave() {
    setEditing(false);
  }

  function onClickCancel() {
    setEditing(false);
  }

  function onClickEdit() {
    setEditing(true);
  }

  return <>
    <Card
      border="success"
      style={{ width: "18rem" }}
      class="m-2"
    >
      <Card.Header>{props.name}</Card.Header>
      <Card.Body>
        <Card.Text>
          {props.prompt}
        </Card.Text>

        <Show when={editing()} fallback={<>
          <Button variant="outline-secondary" onClick={onClickEdit}>Edit</Button>
        </>} keyed>
          <Button variant="outline-secondary" onClick={onClickSave}>Save</Button>
          <Button variant="outline-secondary" onClick={onClickCancel}>Cancel</Button>
        </Show>

      </Card.Body>
    </Card>
  </>;
}
