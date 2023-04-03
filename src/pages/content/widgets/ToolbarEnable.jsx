"use strict";
import { Form } from "solid-bootstrap";
import { createEffect, createSignal } from "solid-js";
import useUserConfig from "@src/dao/UserConfig.js";
import { _T } from "@src/common/Locale.js";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarEnable() {
  const config = useUserConfig();
  const [enable, setEnable] = createSignal(config.toolbarEnable);

  createEffect(() => {
    config.setToolbarEnable(enable());
  });

  return <>
    <Form.Check
      type="switch"
      id="tweak-switch"
      label={_T("switch tweak")}
      onClick={(evt) => setEnable(evt.target.checked)}
      checked={enable()}
    />
  </>;
}