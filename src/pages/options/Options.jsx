"use strict";
import PromptGrid from "@pages/options/widgets/PromptGrid.jsx";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "solid-bootstrap";
import { createEffect, createSignal, For, Show } from "solid-js";
import { _T, Locale } from "@src/common/Locale.js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const Options = () => {
  const [currentLanguage, setCurrentLanguage] = createSignal(Locale.getCurrentLanguage());

  function onSelectLanguage(language) {
    setCurrentLanguage(language);
    console.log(language)
  }

  createEffect(() => {
    Locale.setCurrentLanguage(currentLanguage());
  });

  return <>
    <ButtonGroup>
      <Button variant="light" href="https://github.com/lixianmin/chatgpt-tweak">GitHub</Button>
      <DropdownButton variant="light" as={ButtonGroup} title={_T("System Language")} onSelect={onSelectLanguage}>
        <For each={Object.keys(Locale.languageTable)}>{(languageKey) => {
          const item = Locale.languageTable[languageKey];
          return <Show when={item.name === currentLanguage()} keyed fallback={
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
