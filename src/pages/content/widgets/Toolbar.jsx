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
import { createDelayed } from "@src/core/Tools.ts";
import { _T } from "@src/common/Locale.js";
import { createEffect } from "solid-js";
import { checkBuiltinCommands, fetchCommandHint } from "@pages/content/widgets/Commands.js";

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

  const tempIntputData = {
    ok: false,
    text: ""
  };

  // 如果焦点不在inputBox，则回车时获得焦点
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter" && evt.target !== inputBox) {
      inputBox.focus();
      evt.preventDefault();
    }
  });

  createEffect(() => {
    // 这里需要设置成响应式的
    inputBox.placeholder = _T("↑↓:histories Tab:complete Enter:send");
  });

  function pressEnter() {
    inputBox.focus();
    const enterEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      // key: "Enter",  // 这个key:"Enter"，会导致inputBox中多一个换行出来，其它的好像没有作用
      code: "Enter"
    });
    inputBox.dispatchEvent(enterEvent);
  }

  function onKeyDownTab(evt) {
    const query = inputBox.value;
    const hint = fetchCommandHint(query);
    if (hint !== query) {
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
      default:
      // console.log("evt", evt);
    }

    if (tempIntputData.ok && (evt.key !== "ArrowUp" && evt.key !== "ArrowDown")) {
      tempIntputData.ok = false;
    }
  }

  const delayedSetCursor = createDelayed((position) => {
    inputBox.setSelectionRange(position, position);
  });

  function onKeyDownArrow(evt) {
    const isArrowUp = evt.key === "ArrowUp";
    const isArrowDown = !isArrowUp;

    if (!tempIntputData.ok) {
      tempIntputData.ok = true;
      tempIntputData.text = inputBox.value;
    }

    const step = isArrowUp ? -1 : 1;
    let nextText = historyStore.move(step);
    if (isArrowDown && tempIntputData.ok && nextText === "") {
      nextText = tempIntputData.text;
    }

    // 按bash中history的操作习惯, 如果是arrow down的话, 最后一个应该是""
    if (nextText !== "" || isArrowDown) {
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

        if (checkBuiltinCommands(query)) {
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