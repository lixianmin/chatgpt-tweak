"use strict";

import { createSignal, splitProps } from "solid-js";
import { Button } from "solid-bootstrap";

/********************************************************************
 created:    2023-04-02
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/


export default function IconButton(props) {
  const [localProps, otherProps] = splitProps(props, ["disabled"]); // 直接解构会导致signal失去响应性，参考：https://www.solidjs.com/tutorial/props_split?solved
  const { color = "white", hoverColor = "silver", children, ...buttonProps } = otherProps;
  const [iconColor, setIconColor] = createSignal(color);

  function onMouseEnter() {
    setIconColor(hoverColor);
  }

  function onMouseLeave() {
    setIconColor(color);
  }

  return <>
    <Button style={{ background: "transparent", border: "none", color: iconColor() }} {...buttonProps}
            disabled={localProps.disabled}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
    >
      {children}
    </Button>
  </>;
}

