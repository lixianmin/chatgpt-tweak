"use strict";

import ShadowBootstrap from "@src/core/widgets/ShadowBootstrap.jsx";
import FootBarEnable from "@pages/content/widgets/FootBarEnable.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import FootBarOptions from "@pages/content/widgets/FootBarOptions.jsx";
import useUserConfig from "@src/dao/UserConfig.js";
import usePrompts from "@src/dao/Prompts.js";
import { useHistoryStore } from "@src/dao/HistoryStore.js";
import { createDelayed, longestCommonPrefix } from "@src/core/Tools.ts";
import { _T } from "@src/common/Locale.js";
import { createEffect } from "solid-js";
import { checkBuiltinCommands, fetchCommandHint } from "@pages/content/widgets/Commands.js";
import { addEventListener } from "@src/core/EventListener.js";
import { map } from "lodash-es";
import { createSiteFactory } from "@pages/content/sites/SiteFactory.js";
import { CommandType, Constants } from "@src/common/Constants.js";
import Browser from "webextension-polyfill";
import mountContentMessageListener from "@pages/content/widgets/ContentMessageListener.js";

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
  const factory = createSiteFactory();

  const inputBox = factory.getInputBox();
  const btnSubmit = factory.getSubmitButton();

  const tempIntputData = {
    ok: false,
    text: ""
  };

  function createListeners() {
    let list = [];

    function attachEventListeners() {
      list = [
        addEventListener(inputBox.getDom(), "keydown", onKeyDown, true),
        // addEventListener(btnSubmit, "click", onSubmit),
        // 如果焦点不在inputBox，则回车时获得焦点
        addEventListener(document, "keydown", (evt) => {
          if (evt.key === "Enter" && evt.target !== inputBox.getDom()) {
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
  const originalPlaceholder = inputBox.getPlaceholder();
  createEffect(() => {
    if (userConfig.isToolbarEnable()) {
      listeners.attachEventListeners();
      inputBox.setPlaceholder(_T("input.box.placeholder"));
    } else {
      listeners.detachEventListeners();
      inputBox.setPlaceholder(originalPlaceholder);
    }
  });

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
    const query = inputBox.getText();
    if (query.length > 0) {
      const c = query[0];
      if (c === Constants.PromptKey) {
        const prefix = query.substring(1);
        const candidates = fetchPromptCandidates(prefix);
        // 如果有多个candidates，或者只有一个但跟prefix的值不一样，则设置为hint
        if (candidates.length >= 2 || candidates.length === 1 && candidates[0].name !== prefix) {
          const hint = longestCommonPrefix(map(candidates, "name"));
          const next = Constants.PromptKey + hint;
          inputBox.setHtml(next);
          delayedMoveCursorToEnd();
        } else if (candidates.length === 1) { // 否则，展开当前的prompt
          const next = candidates[0].text;
          inputBox.setHtml(next);
          delayedMoveCursorToEnd();
        }
      } else if (c === "!") {
        checkHistoryExpansion(query);
        delayedMoveCursorToEnd();
      } else if (c >= "a" && c <= "z") {
        const hint = fetchCommandHint(query);
        if (hint !== query) {
          inputBox.setHtml(hint);
          delayedMoveCursorToEnd();
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
    const query = inputBox.getText();
    if (query.startsWith(Constants.PromptKey)) {
      const list = prompts.getPromptList();
      const hints = [];
      const prefix = inputBox.getText().substring(1);
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
    const query = inputBox.getText();
    // console.log("key", key);
    if (query === "" || key === Constants.PromptKey || key === "Backspace" || key === "Enter") {
      // 因为inputBox.value总是慢上一帧，所以延迟一帧处理
      setTimeout(() => {
        const query = inputBox.getText();
        const visible = query.startsWith(Constants.PromptKey);
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
    // 1. 如果使用默认onKeyDown, 则inputBox.value总是慢一帧，缺少evt.key的操作结果, 这要到onKeyUp事件中才能体现出来
    // 2. 当设置addEventListener()的第3个参数为true的时候, 可以在 evt.key==='Enter' 的时候拿到inputBox中的数据,
    //    直接修改inputBox.value, 不用发送click button的事件, 等待原始page中的onkeydown事件发送即可
    // 3. 如果是输入中文的过程中，收到了escape等按键事件，则不处理
    if (evt.isComposing) {
      return;
    }

    switch (evt.key) {
      case "Enter":
        onSubmit(evt);
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
      // console.warn("evt", evt);
    }

    checkPromptHintsVisible(evt);

    if (tempIntputData.ok && (evt.key !== "ArrowUp" && evt.key !== "ArrowDown")) {
      tempIntputData.ok = false;
    }
  }

  const delayedMoveCursorToEnd = createDelayed(() => {
    inputBox.moveCursorToEnd();
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
      tempIntputData.text = inputBox.getText();
    }

    const step = isArrowUp ? -1 : 1;
    let nextText = historyStore.move(step);
    if (isArrowDown && tempIntputData.ok && nextText === "") {
      nextText = tempIntputData.text;
    }

    // 按bash中history的操作习惯, 如果是arrow down的话, 最后一个应该是""
    if (nextText !== "" || isArrowDown) {
      inputBox.setHtml(nextText);
      delayedMoveCursorToEnd();
    }

    evt.preventDefault();
  }

  function checkHistoryExpansion(query) {
    if (query.startsWith("!")) {
      const index = Number(query.substring(1)) - 1;
      if (!Number.isNaN(index)) {
        query = historyStore.getHistory(index);
        inputBox.setHtml(query);
      }
    }

    return query;
  }

  function checkPromptExpansion(query) {
    if (query.startsWith(Constants.PromptKey)) {
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
      const next = Constants.PromptKey + currentHint.name;
      if (next.startsWith(inputBox.getText())) {
        inputBox.setHtml(next);
      }
    }
  }

  function checkBroadcastChat(evt, queryText) {
    const isSecondHand = evt.detail === Constants.BroadcastChatSecondhandFlag;
    if (!isSecondHand) {
      const host = window.location.host;
      Browser.runtime.sendMessage({
        cmd: CommandType.broadcastChat,
        host: host,
        ctrlKey: evt.ctrlKey,
        queryText: queryText
      });
    }
  }

  function onSubmit(evt) {
    checkInputCurrentHint();

    if (!isProcessing) {
      let queryText = inputBox.getText();
      if (queryText !== "") {
        let queryHtml = inputBox.getHtml();
        checkBroadcastChat(evt, queryText);
        // console.warn("queryHtml", queryHtml);

        const nextQueryText = checkHistoryExpansion(queryText);
        const isExpanded = nextQueryText !== queryText;
        if (isExpanded) {
          queryHtml = nextQueryText;
        }

        historyStore.add(queryHtml);
        if (checkBuiltinCommands(queryText)) {
          inputBox.setHtml("");
          return;
        }

        // todo 这里是如果出现了以?开头的, 则展开成prompt写进来
        // queryText = checkPromptExpansion(queryText);

        isProcessing = true;
        // 只有按下ctrl键时, 才使用prompt重写
        if (evt.ctrlKey) {
          const compiled = prompts.compilePrompt(queryHtml);
          inputBox.setHtml(compiled);
          // console.warn("queryHtml", queryHtml, "compiled", compiled);
        }

        // 如果只使用Enter的话, 就不再需要主动发一次button click; 但如果是Ctrl+Enter, 就需要啦
        // 另外, 如果是claude收到chatgpt发来的secondhand事件的话, 也需要发一个button click的消息
        // 到目前为止, 似乎任何情况下都可以考虑发一个button click出去
        setTimeout(() => {
          factory.sendChat();
          isProcessing = false;
        });
      }
    }
  }
}

export default function FootBar(props) {
  initInputBox();
  mountContentMessageListener();

  return <>
    <ShadowBootstrap id={props.id}>
      <Form>
        <Row class="align-items-center">
          <Col xs="auto">
            <FootBarEnable />
          </Col>
          <Col xs="auto">
            <FootBarOptions />
          </Col>
        </Row>
      </Form>
    </ShadowBootstrap>
  </>;
}