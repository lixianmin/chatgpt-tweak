"use strict";

/********************************************************************
 created:    2023-05-11
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function createFactoryBase() {
  function getShadowRoot() {
    return document;
  }

  // function sendChat() {
  //   // inputBox.focus();
  //   // const enterEvent = new KeyboardEvent("keydown", {
  //   //   bubbles: true,
  //   //   cancelable: true,
  //   //   // key: "Enter",  // 这个key:"Enter"，会导致inputBox中多一个换行出来，其它的好像没有作用
  //   //   code: "Enter"
  //   // });
  //   // inputBox.getDom().dispatchEvent(enterEvent);
  //
  //   // 给发送按钮发送一个click事件
  //   const btnSubmit = this.getSubmitButton(); // 这个this.getSubmitButton调用的是子类的方法
  //   const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
  //   btnSubmit.dispatchEvent(clickEvent);
  // }

  // 通过input事件激活发送
  function dispatchEventAsClick(dom) {
    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    dom.dispatchEvent(clickEvent);
  }

  // 给发送按钮发送一个click事件
  function dispatchEventAsInput(dom) {
    const inputEvent = new KeyboardEvent("input", { bubbles: true, cancelable: true });
    dom.dispatchEvent(inputEvent);
  }

  return {
    getShadowRoot: getShadowRoot,
    dispatchEventAsClick: dispatchEventAsClick,
    dispatchEventAsInput: dispatchEventAsInput
  };
}