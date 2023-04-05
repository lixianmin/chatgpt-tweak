"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarEnable from "@pages/content/widgets/ToolbarEnable.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import ToolbarPrompts from "@pages/content/widgets/ToolbarPrompts.jsx";
import ToolbarOptions from "@pages/content/widgets/ToolbarOptions.jsx";
import { getInputBox, getSubmitButton } from "@pages/content/widgets/ElementFinder";
import useUserConfig from "@src/dao/UserConfig.js";
import usePrompts from "@src/dao/Prompts.js";
import { useHistoryStore } from "@src/dao/HistoryStore.js";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function Toolbar(props) {
  const prompts = usePrompts();
  const historyStore = useHistoryStore();
  let isProcessing = false;

  const inputBox = getInputBox();
  const btnSubmit = getSubmitButton();
  inputBox.addEventListener("keydown", onKeyDown);
  btnSubmit.addEventListener("click", onSubmit);

  function pressEnter() {
    inputBox.focus();
    const enterEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter"
    });
    inputBox.dispatchEvent(enterEvent);
  }

  function onKeyDown(evt) {
    switch (evt.key) {
      case "Enter":
        if (!evt.shiftKey && !evt.isComposing) {
          onSubmit();
        }
        break;
      case "ArrowUp":
      case "ArrowDown":
        onKeyDownArrow(evt);
        break;
    }
  }

  function onKeyDownArrow(evt) {
    const step = evt.key === "ArrowUp" ? -1 : 1;
    const nextText = historyStore.move(step);

    // 按bash中history的操作习惯, 如果是arrow down的话, 最后一个应该是""
    if (nextText !== "" || step === 1) {
      inputBox.value = nextText;
      // delayedSetCursor(nextText.length);
    }

    evt.preventDefault();
  }

  function onSubmit() {
    if (!isProcessing) {
      const query = inputBox.value.trim();
      if (query !== "") {
        isProcessing = true;
        const userConfig = useUserConfig();
        if (userConfig.toolbarEnable) {
          inputBox.value = prompts.compilePrompt(query);
          // console.log(`textarea.value=${textarea.value}`);
        }

        pressEnter();
        isProcessing = false;
      }
    }
  }

  return <>
    <ShadowBootstrap id={props.id}>
      <Form>
        <Row class="align-items-center">
          <Col xs="auto">
            <ToolbarEnable />
          </Col>
          <Col xs="auto">
            <ToolbarPrompts />
          </Col>
          <Col xs="auto">
            <ToolbarOptions />
          </Col>
        </Row>
      </Form>
    </ShadowBootstrap>
  </>;
}