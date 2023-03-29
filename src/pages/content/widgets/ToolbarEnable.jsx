"use strict";
import { ToggleButton } from "solid-bootstrap";
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

  function enableText() {
    return enable() ? "Disable" : "Enable";
  }

  createEffect(() => {
    config.toolbarEnable.set(enable());
  });

  return <>
    <ToggleButton
      id="tweak-toggle-check"
      type="checkbox"
      variant="secondary"
      checked={enable()}
      value="1"
      onChange={(evt) => setEnable(evt.currentTarget.checked)}
    >
      {enableText()}
    </ToggleButton>
  </>;
}