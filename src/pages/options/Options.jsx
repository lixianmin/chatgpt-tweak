"use strict";
import PromptGrid from "@pages/options/widgets/PromptGrid.jsx";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "solid-bootstrap";
import { For, Show } from "solid-js";
import { _T, Locale } from "@src/common/Locale.js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const Options = () => {
  function onSelectLanguageName(name) {
    Locale.setCurrentLanguageByName(name);
  }

  return <>
    <ButtonGroup>
      <Button variant="light" href="https://github.com/lixianmin/chatgpt-tweak">GitHub</Button>
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
    </ButtonGroup>
    <PromptGrid />
  </>;
};

export default Options;
