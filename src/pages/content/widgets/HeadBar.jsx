"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import HeadBarPrompts from "@pages/content/widgets/HeadBarPrompts.jsx";

/********************************************************************
 created:    2023-04-21
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function HeadBar() {
  return <>
    <ShadowBootstrap>
      <HeadBarPrompts />
    </ShadowBootstrap>
  </>;
}