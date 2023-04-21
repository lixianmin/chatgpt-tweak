"use strict";
import { Form } from "solid-bootstrap";
import useUserConfig from "@src/dao/UserConfig.js";
import { _T } from "@src/common/Locale.js";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarBottomEnable() {
  const config = useUserConfig();

  function onClick(evt) {
    config.setToolbarEnable(evt.target.checked);
  }

  return <>
    <Form.Check
      type="switch"
      label={_T("switch tweak")}
      onClick={onClick}
      checked={config.isToolbarEnable()}
    />
  </>;
}