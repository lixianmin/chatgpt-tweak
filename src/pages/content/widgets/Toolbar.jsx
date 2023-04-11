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
import { createDelayed, longestCommonPrefix } from "@src/core/Tools.ts";
import { _T } from "@src/common/Locale.js";
import { createEffect } from "solid-js";
import { checkBuiltinCommands, fetchCommandHint } from "@pages/content/widgets/Commands.js";
import { addEventListener } from "@src/core/EventListener.js";
import { map } from "lodash-es";

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
      inputBox.placeholder = _T("/prompts ↑↓histories Tab:complete Enter:send");
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

  function fetchPromptCandidates(prefix) {
    const candidates = [];
    for (let v of prompts.getPromptList()) {
      const name = v.name;
      if (name.startsWith(prefix)) {
        candidates.push(v);
      }
    }

    return candidates;
  }

  function onKeyDownTab(evt) {
    const query = inputBox.value;
    if (query.length > 0) {
      const c = query[0];
      if (c === "/") {
        const prefix = query.substring(1);
        const candidates = fetchPromptCandidates(prefix);
        // 如果有多个candidates，或者只有一个但跟prefix的值不一样，则设置为hint
        if (candidates.length >= 2 || candidates.length === 1 && candidates[0].name !== prefix) {
          const hint = longestCommonPrefix(map(candidates, "name"));
          const next = "/" + hint;
          inputBox.value = next;
          delayedSetCursor(next.length);
        } else if (candidates.length === 1) { // 否则，展开当前的prompt
          const next = candidates[0].text;
          inputBox.value = next;
          delayedSetCursor(next.length);
        }
      } else if (c === "!") {
        const next = checkHistoryExpansion(query);
        delayedSetCursor(next.length);
      } else if (c >= "a" && c <= "z") {
        const hint = fetchCommandHint(query);
        if (hint !== query) {
          inputBox.value = hint;
          delayedSetCursor(hint.length);
        }
      }
    }

    evt.preventDefault();
  }

  // 方便其它插件接受焦点在document上时的输入
  function onKeyDownEscape(evt) {
    inputBox.blur();
    // console.log(evt)
    evt.preventDefault();
  }

  function resetHints() {
    const query = inputBox.value;
    if (query.startsWith("/")) {
      const list = prompts.getPromptList();
      const hints = [];
      const prefix = inputBox.value.substring(1);
      const maxSize = 10;

      for (let i = 0; i < list.length; i++) {
        const prompt = list[i];
        if (prompt.name.startsWith(prefix)) {
          hints.push(prompt);
        }

        if (hints.length >= maxSize) {
          break;
        }
      }

      prompts.setHints(hints);
    }
  }

  function checkPromptHintsVisible(evt) {
    const key = evt.key;
    const query = inputBox.value;
    // console.log("key", key);
    if (query === "" || key === "/" || key === "Backspace" || key === "Enter") {
      // 因为inputBox.value总是慢上一帧，所以延迟一帧处理
      setTimeout(() => {
        const query = inputBox.value;
        const visible = query.startsWith("/");
        prompts.setHintsVisible(visible);
        if (visible) {
          resetHints();
        }
      });
    }

    if (prompts.getHintsVisible()) {
      setTimeout(() => {
        resetHints();
      });
    }
  }

  function onKeyDown(evt) {
    // inputBox.value总是慢一帧，缺少evt.key的操作结果
    // console.log('inputBox.value', inputBox.value, 'evt.key:', evt.key)

    switch (evt.key) {
      case "Enter":
        if (!evt.shiftKey && !evt.isComposing) {
          onSubmit(evt);
        }
        break;
      case "ArrowUp":
      case "ArrowDown":
        if (prompts.getHintsVisible()) {
          onKeyDownArrowHints(evt);
        } else {
          onKeyDownArrowHistory(evt);
        }
        break;
      case "Tab":
        onKeyDownTab(evt);
        break;
      case "Escape":
        onKeyDownEscape(evt);
        break;
      default:
      // console.log("evt", evt);
    }

    checkPromptHintsVisible(evt);

    if (tempIntputData.ok && (evt.key !== "ArrowUp" && evt.key !== "ArrowDown")) {
      tempIntputData.ok = false;
    }
  }

  const delayedSetCursor = createDelayed((position) => {
    inputBox.setSelectionRange(position, position);
  });

  function onKeyDownArrowHints(evt) {
    const isArrowUp = evt.key === "ArrowUp";
    const step = isArrowUp ? -1 : 1;
    prompts.moveCurrentHintIndex(step);
    evt.preventDefault();
  }

  function onKeyDownArrowHistory(evt) {
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

  function checkPromptExpansion(query) {
    if (query.startsWith("/")) {
      const hint = query.substring(1);
      const list = prompts.getPromptList();
      for (const v of list.values()) {
        if (hint === v.name) {
          return v.text;
        }
      }
    }

    return query;
  }

  function checkInputCurrentHint() {
    if (prompts.getHintsVisible() && prompts.getCurrentHintIndex() >= 0) {
      const hints = prompts.getHints();
      const currentHint = hints[prompts.getCurrentHintIndex()];
      const next = "/" + currentHint.name;
      if (next.startsWith(inputBox.value)) {
        inputBox.value = next;
      }
    }
  }

  function onSubmit(evt) {
    checkInputCurrentHint();

    if (!isProcessing) {
      // todo 刚刚enable toolbar的时候，这个值是empty的，因此无法正确执行
      let query = inputBox.value;
      // console.log("query", query);
      if (query !== "") {
        query = checkHistoryExpansion(query);
        historyStore.add(query);

        if (checkBuiltinCommands(query)) {
          inputBox.value = "";
          return;
        }

        query = checkPromptExpansion(query);

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
        <Row>
          <Col xs="auto">
            <ToolbarPrompts />
          </Col>
        </Row>
        <Row class="align-items-center">
          <Col xs="auto">
            <ToolbarEnable />
          </Col>
          <Col xs="auto">
            <ToolbarOptions />
          </Col>
        </Row>
      </Form>
    </ShadowBootstrap>
  </>;
}