"use strict";
import usePrompts from "@src/dao/Prompts.js";
import PromptItem from "@pages/options/widgets/PromptItem.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import AddPromptItem from "@pages/options/widgets/AddPromptItem.jsx";
import { For } from "solid-js";
import { CommandType } from "@src/common/Constants.js";
import { createTabMessageBusChatGPT } from "@src/core/MessageBus.js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptGrid() {
  const tabBus = createTabMessageBusChatGPT();
  const prompts = usePrompts();

  let activeIndex = -1;
  let dragToIndex = -1;
  let lastOpacity = 0;

  function reveredPromptList() {
    return prompts.getPromptList().slice().reverse();
  }

  function getItemIndex(item) {
    let elem = item;
    let index = -1;
    if (!elem || !elem.parentElement) {
      return index;
    }
    index = 0;
    elem = elem.previousElementSibling;
    while (elem) {
      index++;
      elem = elem.previousElementSibling;
    }
    return index;
  }

  function onDragStart(evt) {
    const dom = evt.currentTarget;
    activeIndex = getItemIndex(dom);
    lastOpacity = dom.style.opacity;
    // console.log("lastOpacity", lastOpacity);
    dom.style.opacity = 0.3;
  }

  function onDragOver(evt) {
    evt.preventDefault();
    const dom = evt.currentTarget;
    const overIndex = getItemIndex(dom);
    if (dragToIndex !== overIndex) {
      // 这里计算reversedINdex不需要用minuend-activeIndex-1, 因为这里面多一个AddPromptItem, 抵消了
      const minuend = prompts.getPromptList().length;
      const index1 = minuend - activeIndex;
      const index2 = minuend - overIndex;
      prompts.swapPromptByIndex(index1, index2);
      tabBus.broadcastMessage({ cmd: CommandType.swapPromptByIndex, index1, index2 });
      // console.log("activeIndex=", activeIndex, "overIndex=", overIndex);

      dragToIndex = overIndex;
      activeIndex = overIndex;
    }
  }

  function onDragEnd(evt) {
    evt.preventDefault();
    activeIndex = -1;
    dragToIndex = -1;

    const dom = evt.currentTarget;
    dom.style.opacity = lastOpacity;
  }

  // 通过在一行中把所有的column都放进来，然后设置 md='auto'，可以进行自动排版
  return <>
    <Form>
      <Row>
        <Col md="auto">
          <AddPromptItem prompts={prompts} />
        </Col>
        <For each={reveredPromptList()}>{(prompt, reverseIndex) => {
          return <Col md="auto" onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
            <PromptItem prompts={prompts} reverseIndex={reverseIndex()}></PromptItem>
          </Col>;
        }}</For>
      </Row>
    </Form>
  </>;
}
