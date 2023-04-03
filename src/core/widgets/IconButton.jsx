"use strict";

import { createSignal } from "solid-js";
import { Button } from "solid-bootstrap";

/********************************************************************
 created:    2023-04-02
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/


export default function IconButton(props) {
  const { color = "white", hoverColor = "silver", children, ...buttonProps } = props;
  const [iconColor, setIconColor] = createSignal(color);

  function onMouseEnter() {
    setIconColor(hoverColor);
  }

  function onMouseLeave() {
    setIconColor(color);
  }

  return (
    <Button style={{ background: "transparent", border: "none", color: iconColor() }} {...buttonProps}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
    >
      {children}
    </Button>
  );
}

