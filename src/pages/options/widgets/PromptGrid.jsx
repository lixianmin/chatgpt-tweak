"use strict";
import usePrompts from "@src/dao/Prompts.js";
import { onMount } from "solid-js";
import PromptItem from "@pages/options/widgets/PromptItem.jsx";
import { Card, Col, Form, Row } from "solid-bootstrap";
import AddPromptItem from "@pages/options/widgets/AddPromptItem.jsx";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function PromptGrid() {
  const prompts = usePrompts();
  const cardsData = prompts.getPromptList().slice().reverse();
  let colNum = 1;

  function calculateColNum() {
    const pageWidth = window.innerWidth;
    const cardWidthInt = 1;
    const cardMarginInt = 1;
    colNum = Math.floor(pageWidth / (cardWidthInt + 2 * cardMarginInt));
    console.log("innerWidth=", pageWidth, "colNum=", colNum);
  }

  onMount(() => {
    calculateColNum();
    window.addEventListener("resize", calculateColNum);
  });

  calculateColNum();
  const rowNum = Math.ceil(cardsData.length / colNum);
  const rows = Array.from({ length: rowNum }, (_, rowIndex) => {
    const start = rowIndex * colNum;
    const end = start + colNum;
    return cardsData.slice(start, end).map((prompt, colIndex) => (
      <Col md="auto">
        <Card>
          <PromptItem prompts={prompts} reverseIndex={start + colIndex}></PromptItem>
        </Card>
      </Col>
    ));
  });

  return <>
    <Form>
      <AddPromptItem prompts={prompts} />
      {rows.map((cols) => {
        return <Row>{cols}</Row>;
      })}
    </Form>
  </>;
}
