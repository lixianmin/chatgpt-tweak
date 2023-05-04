"use strict";
import usePrompts from "@src/dao/Prompts.js";
import PromptItem from "@pages/options/widgets/PromptItem.jsx";
import { Col, Form, Row } from "solid-bootstrap";
import AddPromptItem from "@pages/options/widgets/AddPromptItem.jsx";
import { For } from "solid-js";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptGrid() {
  const prompts = usePrompts();
  let activeIndex = -1;
  let dragToIndex = -1;

  // function reveredPromptList() {
  //   return prompts.getPromptList().slice().reverse();
  // }

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
  }

  function onDragOver(evt) {
    evt.preventDefault();
    const dom = evt.currentTarget;
    const overIndex = getItemIndex(dom);
    if (dragToIndex !== overIndex) {
      dragToIndex = overIndex;
      prompts.swapPromptByIndex(activeIndex, overIndex);
      // console.log("activeIndex=", activeIndex, "overIndex=", overIndex);
    }
  }

  function onDragEnd(evt) {
    evt.preventDefault();
    activeIndex = -1;
    dragToIndex = -1;
  }

  // 通过在一行中把所有的column都放进来，然后设置 md='auto'，可以进行自动排版
  return <>
    <Form>
      <Row>
        <Col md="auto">
          <AddPromptItem prompts={prompts} />
        </Col>
        <div>
          <For each={prompts.getPromptList()}>{(prompt, reverseIndex) => {
            return <Col md="auto" onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
              <PromptItem prompts={prompts} reverseIndex={reverseIndex()}></PromptItem>
            </Col>;
          }}</For>
        </div>
      </Row>
    </Form>
  </>;
}
