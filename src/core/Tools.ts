/********************************************************************
 created:    2022-03-07
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { render } from "solid-js/web";

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function emptyMethod() {

}

export function random(lower: number, upper: number): number {
  return lower + (upper - lower) * Math.random();
}

export function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function longestCommonPrefix(list: string[]): string {
  if (list.length < 2) {
    return list.join();
  }

  let str = list[0];
  for (let i = 1; i < list.length; i++) {
    for (let j = str.length; j > 0; j--) {
      if (str !== list[i].substring(0, j)) {
        str = str.substring(0, j - 1);
      } else {
        break;
      }
    }
  }

  return str;
}

export function getHumanReadableSize(size: number) {
  if (size < 1024) {
    return size + "B";
  }

  if (size < 1048576) {
    return (size / 1024.0).toFixed(1) + "K";
  }

  return (size / 1048576.0).toFixed(1) + "M";
}

export function useKeyDown(target: HTMLElement, keys: string | string[], handler: Function) {
  return target.addEventListener("keydown", evt => {
    if (typeof keys === "string") {
      if (evt.key === keys) {
        return handler(evt);
      }
    } else if (keys.includes(evt.key)) {
      return handler(evt);
    }
  });
}

export function createDelayed(handler: Function, wait: number = 50) {
  let timeoutId: NodeJS.Timeout;
  return function(...args: any[]) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => handler(...args), wait);
  };
}

// render方法是渲染为子节点, renderBefore是在element节点之前渲染
export function renderBefore(code, element) {
  element.insertAdjacentHTML("beforebegin", "<div></div>");
  render(code, element.previousElementSibling);
}