"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import PromptDropdown from "@pages/content/widgets/PromptDropdown.jsx";
import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarEnable from "@pages/content/widgets/ToolbarEnable.jsx";

export default function Toolbar(props) {
  return <>
    <ShadowBootstrap id={props.id}>
      <div>
        <ToolbarEnable />
        <PromptDropdown />
      </div>
    </ShadowBootstrap>
  </>;
}