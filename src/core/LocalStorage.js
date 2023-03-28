"use strict";
import ls from "localstorage-slim";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export default function useLocalStorage(name, initialValue = undefined) {
  return {
    get(defaultValue = initialValue) {
      const last = ls.get(name);
      return last ?? defaultValue;
      // 如果ls.get()返回了合理值，则直接用；否则，使用defaultValue
      // return defaults(ls.get(name), defaultValue)
    },
    set(value) {
      ls.set(name, value);
    }
  };
}