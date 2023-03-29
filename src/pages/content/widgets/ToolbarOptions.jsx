"use strict";
import Browser from "webextension-polyfill";
import { Icons } from "@src/core/widgets/Icons.jsx";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarOptions() {
  return <>
    <div onClick={() => Browser.runtime.sendMessage("open.options.page")}>
      {Icons.tune}
    </div>
  </>;
}