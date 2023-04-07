"use strict";

/********************************************************************
 created:    2023-04-07
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function addEventListener(target, type, handler) {
  target.addEventListener(type, handler);

  return {
    removeEventListener: () => {
      target.removeEventListener(type, handler);
    }
  };
}