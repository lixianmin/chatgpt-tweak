"use strict";

/********************************************************************
 created:    2023-04-07
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function addEventListener(target, type, handler, options = false) {
  target.addEventListener(type, handler, options);

  return {
    removeEventListener: () => {
      target.removeEventListener(type, handler);
    }
  };
}