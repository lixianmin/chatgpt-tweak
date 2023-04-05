"use strict";
import PromptGrid from "@pages/options/widgets/PromptGrid.jsx";
import { Button, ButtonGroup } from "solid-bootstrap";
import LanguageSettings from "@pages/options/widgets/LanguageSettings.jsx";
import mountOptionsMessageListener from "@pages/options/widgets/OptionsMessageListener.js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const Options = () => {
  mountOptionsMessageListener();

  return <>
    <ButtonGroup>
      <Button variant="light" href="https://github.com/lixianmin/chatgpt-tweak">GitHub</Button>
      <LanguageSettings />
    </ButtonGroup>
    <PromptGrid />
  </>;
};

export default Options;
