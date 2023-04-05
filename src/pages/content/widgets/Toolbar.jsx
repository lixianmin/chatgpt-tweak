"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarEnable from "@pages/content/widgets/ToolbarEnable.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import ToolbarPrompts from "@pages/content/widgets/ToolbarPrompts.jsx";
import ToolbarOptions from "@pages/content/widgets/ToolbarOptions.jsx";
import { getConsolePanel, getInputBox, getSubmitButton } from "@pages/content/widgets/ElementFinder";
import useUserConfig from "@src/dao/UserConfig.js";
import usePrompts from "@src/dao/Prompts.js";
import { useHistoryStore } from "@src/dao/HistoryStore.js";
import { createDelayed, longestCommonPrefix } from "@src/core/Tools.ts";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

function initInputBox() {
  const prompts = usePrompts();
  const historyStore = useHistoryStore();
  let isProcessing = false;

  const inputBox = getInputBox();
  const btnSubmit = getSubmitButton();
  inputBox.addEventListener("keydown", onKeyDown);
  btnSubmit.addEventListener("click", onSubmit);

  function printHtml(html) {
    const panel = getConsolePanel();
    if (panel && panel.children) {
      const div = document.createElement("div");
      div.innerHTML = html;

      const children = panel.children;
      const insertIndex = children.length - 1;
      const pivot = children[insertIndex];
      panel.insertBefore(div, pivot);
    }
  }

  function printHistory() {
    const list = historyStore.getHistoryList();
    let result = "<ol>";
    for (let i = 0; i < list.length; i++) {
      result += `<li>${i + 1}. ${list[i]}</li>`;
    }

    result += "</ol>";
    printHtml(result);
  }

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

  function completeCommandHints(evt) {
    const query = inputBox.value;
    const commandList = ["history"];

    const candidateList = [];
    for (let v of commandList.values()) {
      if (v.startsWith(query)) {
        candidateList.push(v);
      }
    }

    // console.log("candidateList", candidateList);
    if (candidateList.length > 0) {
      const hint = longestCommonPrefix(candidateList);
      inputBox.value = hint;
      delayedSetCursor(hint.length);

      evt.preventDefault();
    }
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
      case "Tab":
        completeCommandHints(evt);
        break;
    }
  }

  const delayedSetCursor = createDelayed((position) => {
    inputBox.setSelectionRange(position, position);
  });

  function onKeyDownArrow(evt) {
    const step = evt.key === "ArrowUp" ? -1 : 1;
    const nextText = historyStore.move(step);

    // 按bash中history的操作习惯, 如果是arrow down的话, 最后一个应该是""
    if (nextText !== "" || step === 1) {
      inputBox.value = nextText;
      delayedSetCursor(nextText.length);
    }

    evt.preventDefault();
  }

  function onSubmit() {
    if (!isProcessing) {
      const query = inputBox.value.trim();
      if (query !== "") {
        historyStore.add(query);

        if (query === "history") {
          printHistory();
          inputBox.value = "";
          return;
        }

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
}

export default function Toolbar(props) {
  initInputBox();

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