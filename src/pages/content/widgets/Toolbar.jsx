"use strict";
/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import PromptDropdown from "@pages/content/widgets/PromptDropdown.jsx";
import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarEnable from "@pages/content/widgets/ToolbarEnable.jsx";
import { ButtonGroup } from "solid-bootstrap";

export default function Toolbar(props) {
  return <>
    <ShadowBootstrap id={props.id}>
      <ButtonGroup class="mb-2"> 
        <ToolbarEnable />
        <PromptDropdown />
      </ButtonGroup>
    </ShadowBootstrap>
  </>;
}