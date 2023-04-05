"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import ToolbarEnable from "@pages/content/widgets/ToolbarEnable.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import ToolbarPrompts from "@pages/content/widgets/ToolbarPrompts.jsx";
import ToolbarOptions from "@pages/content/widgets/ToolbarOptions.jsx";
import { getInputBox, getSubmitButton, printText } from "@pages/content/widgets/ElementFinder";
import useUserConfig from "@src/dao/UserConfig.js";
import usePrompts from "@src/dao/Prompts.js";
import { useHistoryStore } from "@src/dao/HistoryStore.js";
import { createDelayed, longestCommonPrefix } from "@src/core/Tools.ts";
import { formatDateTime } from "@src/core/Time.js";
import { _T } from "@src/common/Locale.js";
import { createEffect } from "solid-js";

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
  document.addEventListener("keydown", () => inputBox.focus()); // 如果焦点不在inputBox，则回车时获得焦点

  createEffect(() => {
    // 这里需要设置成响应式的
    inputBox.placeholder = _T("↑↓:histories Tab:complete Enter:send");
  });

  function printHistory() {
    const list = historyStore.getHistoryList();
    const currentTime = formatDateTime(new Date());
    let result = currentTime + "\n\n history commands: \n\n";
    for (let i = 0; i < list.length; i++) {
      result += `${i + 1}. ${list[i]} \n`;
    }

    printText(result);
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

  function onKeyDownTab(evt) {
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
    }

    evt.preventDefault();
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
        onKeyDownTab(evt);
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

  function checkHistoryExpansion(query) {
    if (query.startsWith("!")) {
      const index = Number(query.substring(1)) - 1;
      if (!Number.isNaN(index)) {
        query = historyStore.getHistory(index);
        inputBox.value = query;
      }
    }

    return query;
  }

  function onSubmit() {
    if (!isProcessing) {
      let query = inputBox.value.trim();
      if (query !== "") {
        query = checkHistoryExpansion(query);
        historyStore.add(query);

        // 如果是history命令，则打印
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