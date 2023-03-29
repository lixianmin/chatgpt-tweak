"use strict";

import { Button, Card } from "solid-bootstrap";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptItem(props) {
  return <>
    <Card bg="secondary"
          text="dark"
          style={{ width: "18rem" }}
          class="m-2"
    >
      <Card.Header>{props.name}</Card.Header>
      <Card.Body>
        <Card.Text>
          {props.prompt}
        </Card.Text>
        <Button variant="secondary">Edit</Button>
      </Card.Body>
    </Card>
  </>;
}
