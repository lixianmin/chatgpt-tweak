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
import { addEventListener } from "@src/core/EventListener.js";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

function initInputBox() {
  const prompts = usePrompts();
  const historyStore = useHistoryStore();
  let isProcessing = false;
  const userConfig = useUserConfig();

  const inputBox = getInputBox();
  const btnSubmit = getSubmitButton();

  const tempIntputData = {
    ok: false,
    text: ""
  };

  function createListeners() {
    let list = [];

    function attachEventListeners() {
      list = [
        addEventListener(inputBox, "keydown", onKeyDown),
        addEventListener(btnSubmit, "click", onSubmit),
        // 如果焦点不在inputBox，则回车时获得焦点
        addEventListener(document, "keydown", (evt) => {
          if (evt.key === "Enter" && evt.target !== inputBox) {
            inputBox.focus();
            evt.preventDefault();
          }
        })
      ];
    }

    function detachEventListeners() {
      if (list.length > 0) {
        for (let v of list.values()) {
          v.removeEventListener();
        }
        list = [];
      }
    }

    return { attachEventListeners: attachEventListeners, detachEventListeners: detachEventListeners };
  }

  // 是否添加相关事件
  const listeners = createListeners();
  const originalPlaceholder = inputBox.placeholder;
  createEffect(() => {
    if (userConfig.isToolbarEnable()) {
      listeners.attachEventListeners();
      inputBox.placeholder = _T("↑↓:histories Tab:complete Enter:send");
    } else {
      listeners.detachEventListeners();
      inputBox.placeholder = originalPlaceholder;
    }
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
    } else {
      const next = checkHistoryExpansion(query);
      delayedSetCursor(next.length);
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
      // todo 刚刚enable toolbar的时候，这个值是empty的，因此无法正确执行
      let query = inputBox.value.trim();
      console.log("query", query);
      if (query !== "") {
        query = checkHistoryExpansion(query);
        historyStore.add(query);

        if (checkBuiltinCommands(query)) {
          inputBox.value = "";
          return;
        }

        isProcessing = true;
        inputBox.value = prompts.compilePrompt(query);

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