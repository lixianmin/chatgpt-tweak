"use strict";

import { onMount } from "solid-js";
import { render } from "solid-js/web";

/********************************************************************
 created:    2023-03-29
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function ShadowBootstrap(props) {
  let my;
  onMount(() => {
    if (my) {
      const shadowRoot = my.attachShadow({ mode: "open" });
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
      shadowRoot.append(link);

      render(() => props.children, shadowRoot);
    }
  });

  return <>
    <div id={props.id} ref={my}>
    </div>
  </>;
}