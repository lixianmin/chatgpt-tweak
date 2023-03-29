"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarEnable from "@pages/content/widgets/ToolbarEnable.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import ToolbarPrompts from "@pages/content/widgets/ToolbarPrompts.jsx";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function Toolbar(props) {
  return <>
    <ShadowBootstrap id={props.id}>
      <Form>
        <Row>
          <Col xs={3}>
            <ToolbarEnable />
          </Col>
          <Col xs={2}>
            <ToolbarPrompts />
          </Col>
        </Row>
      </Form>
    </ShadowBootstrap>
  </>;
}