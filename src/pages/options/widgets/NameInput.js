"use strict";
/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function(props) {
  function onInput(e) {
    // setPrompt({ ...prompt, name: e.target.value });
  }

  return <>
    <input className="input-bordered input flex-1"
           value={prompt.name}
           onInput={onInput}
           disabled={prompt.uuid === "default" || prompt.uuid === "default_en"}
    />
  </>;
}
