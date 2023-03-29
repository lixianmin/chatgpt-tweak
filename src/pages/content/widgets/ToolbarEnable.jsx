"use strict";
import { Form } from "solid-bootstrap";
import { createEffect, createSignal } from "solid-js";
import useUserConfig from "@src/dao/UserConfig.js";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarEnable() {
  const config = useUserConfig();
  const [enable, setEnable] = createSignal(config.toolbarEnable.get());

  createEffect(() => {
    config.toolbarEnable.set(enable());
  });

  return <>
    <Form.Check inline
      type="switch"
      id="tweak-switch"
      label="switch tweak"
      onClick={(evt) => setEnable(evt.target.checked)}
      checked={enable()}
    />
  </>;
}