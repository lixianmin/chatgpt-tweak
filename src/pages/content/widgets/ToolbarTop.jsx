"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarTopPrompts from "@pages/content/widgets/ToolbarTopPrompts.jsx";

/********************************************************************
 created:    2023-04-21
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ToolbarTop() {
  return <>
    <ShadowBootstrap>
      <ToolbarTopPrompts />
    </ShadowBootstrap>
  </>;
}