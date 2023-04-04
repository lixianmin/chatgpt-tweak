"use strict";

import { ButtonGroup, Dropdown, DropdownButton } from "solid-bootstrap";
import { For, Show } from "solid-js";
import { _T, Locale } from "@src/common/Locale.js";
import { createTabMessageBusChatGPT } from "@src/core/MessageBus.js";
import { CommandType } from "@src/common/Consts.js";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function LanguageSettings() {

  const tabBus = createTabMessageBusChatGPT();

  function onSelectLanguageName(name) {
    // console.log("name", name);
    Locale.setCurrentLanguageByName(name);
    tabBus.broadcastMessage({ cmd: CommandType.setCurrentLanguageByName, name: name });
  }

  return <>
    <DropdownButton variant="light" as={ButtonGroup} title={_T("System Language")} onSelect={onSelectLanguageName}>
      <For each={Object.keys(Locale.languageTable)}>{(languageKey) => {
        const item = Locale.languageTable[languageKey];
        return <Show when={item.name === Locale.getCurrentLanguageName()} keyed fallback={
          <Dropdown.Item eventKey={item.name}>{item.name}</Dropdown.Item>
        }>
          <Dropdown.Item eventKey={item.name} active>{item.name}</Dropdown.Item>
        </Show>;
      }}</For>
    </DropdownButton>
  </>;
}