"use strict";

import { Form } from "solid-bootstrap";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptItem(props) {
  return <Form>
    {props.name}
    {props.prompt}
  </Form>;
}
