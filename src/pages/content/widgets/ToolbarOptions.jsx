"use strict";
import Browser from "webextension-polyfill";
import { Icons } from "@src/core/widgets/Icons.jsx";
import { Button } from "solid-bootstrap";
import { CommandType } from "@src/common/Consts.js";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarOptions() {
  return <>
    <Button variant="outline-secondary"
            onClick={() => Browser.runtime.sendMessage({ cmd: CommandType.openOptionsPage })}>
      {Icons.tune}
    </Button>
  </>;
}