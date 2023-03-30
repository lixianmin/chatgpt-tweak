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
  const [enable, setEnable] = createSignal(config.toolbarEnable.getStorage());

  createEffect(() => {
    config.toolbarEnable.setStorage(enable());
  });

  return <>
    <Form.Check
      type="switch"
      id="tweak-switch"
      label="switch tweak"
      onClick={(evt) => setEnable(evt.target.checked)}
      checked={enable()}
    />
  </>;
}