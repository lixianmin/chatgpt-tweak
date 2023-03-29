"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarEnable from "@pages/content/widgets/ToolbarEnable.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import ToolbarPrompts from "@pages/content/widgets/ToolbarPrompts.jsx";
import ToolbarOptions from "@pages/content/widgets/ToolbarOptions.jsx";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function Toolbar(props) {

  return <>
    <ShadowBootstrap id={props.id}>
      <Form>
        <Row class="align-items-center">
          <Col xs="auto">
            <ToolbarEnable />
          </Col>
          <Col xs="auto">
            <ToolbarPrompts />
          </Col>
          <Col xs="auto">
            <ToolbarOptions />
          </Col>
        </Row>
      </Form>
    </ShadowBootstrap>
  </>;
}