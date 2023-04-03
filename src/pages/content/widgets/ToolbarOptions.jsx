"use strict";
import { TbSettings } from "solid-icons/tb";
import IconButton from "@src/core/widgets/IconButton.jsx";
import Browser from "webextension-polyfill";
import { CommandType } from "@src/common/Consts.js";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarOptions() {
  return <>
    <IconButton color="white" hoverColor="silver"
                onClick={() => Browser.runtime.sendMessage({ cmd: CommandType.openOptionsPage })}
    >
      <TbSettings size="32" />
    </IconButton>
  </>;
}