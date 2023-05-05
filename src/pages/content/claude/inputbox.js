/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function useInputBox() {
  let inputBox = null;

  function getDom() {
    if (!inputBox) {
      inputBox = document.querySelector("div[aria-label=\"Message to Claude\"]").firstElementChild;
    }

    return inputBox;
  }

  // function setText(text) {
  //   const inputBox = getDom();
  //   if (inputBox) {
  //     inputBox.value = text;
  //   }
  // }
  //
  // function getText() {
  //   const inputBox = getDom();
  //   return inputBox?.value ?? "";
  // }

  return {
    getDom: getDom,
    // setText: setText,
    // getText: getText
  };
}