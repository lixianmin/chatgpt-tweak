"use strict";

import useLocalStorage from "@src/core/LocalStorage.js";

/********************************************************************
 created:    2023-04-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

function createHistoryStore() {
  const storage = useLocalStorage("tweak-history-store", []);
  let _list = storage.getStorage();
  let _currentIndex = _list.length;

  return {
    add(command) {
      if (typeof command === "string" && command !== "") {
        const size = _list.length;

        // 如果history中存储的最后一条与command不一样，则将command加入到history列表。否则将historyIndex调整到最后
        if (size === 0 || _list[size - 1] !== command) {
          _currentIndex = _list.push(command);
        } else { // add()都是在输入命令时才调用的，这时万一historyIndex处于history数组的中间位置，将其调整到最后
          _currentIndex = _list.length;
        }

        // 最多存储100到磁盘上
        let maxStore = _list;
        const startPos = maxStore.length - 100;
        if (startPos > 0) {
          maxStore = maxStore.slice(startPos);
        }

        storage.setStorage(maxStore);
      }
    },
    move(step) {
      if (typeof step === "number" && step !== 0) {
        let nextIndex = _currentIndex + step;
        if (nextIndex >= 0 && nextIndex < _list.length) {
          _currentIndex = nextIndex;
          const text = _list.at(nextIndex);
          // console.log(this.toString())
          return text;
        }
      }

      return "";
    },
    getHistoryList() {
      return _list;
    },
    getHistory(index) {
      return typeof index === "number" ? _list.at(index) : "";
    },
    getHistoryCount() {
      return _list.length;
    }
  };
}

let store = createHistoryStore();

// 只所以导出useHistoryStore(), 是希望在所有的地方使用的都是同一个对象和存储, 如此而已
export const useHistoryStore = () => store;