"use strict";
import { TbSettings } from "solid-icons/tb";
import IconButton from "@src/core/widgets/IconButton.jsx";
import Browser from "webextension-polyfill";
import { CommandType } from "@src/common/Constants.js";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function FootBarOptions() {
  // 因为是自定义控件，所以还需要兼顾chatgpt处于dark mode还是light mode
  return <>
    <IconButton color="#0fcaf0" hoverColor="#0d6efd"
                onClick={() => Browser.runtime.sendMessage({ cmd: CommandType.openOptionsPage })}
    >
      <TbSettings size="32" />
    </IconButton>
  </>;
}