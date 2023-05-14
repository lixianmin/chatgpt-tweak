"use strict";
import { Form } from "solid-bootstrap";
import useUserConfig from "@src/dao/UserConfig.js";
import { _T } from "@src/common/Locale.js";

/********************************************************************
 created:    2023-05-14
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function FootBarGoogle() {
  const config = useUserConfig();

  function onClick(evt) {
    config.setGoogleEnable(evt.target.checked);
  }

  return <>
    <Form.Check
      type="switch"
      label={_T("google")}
      onClick={onClick}
      checked={config.isGoogleEnable()}
    />
  </>;
}