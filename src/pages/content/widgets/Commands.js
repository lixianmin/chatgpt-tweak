"use strict";

import { longestCommonPrefix } from "@src/core/Tools.ts";
import { printHtmlWithTimestamp, printTextWithTimestamp } from "@pages/content/widgets/ElementFinder.ts";
import { useHistoryStore } from "@src/dao/HistoryStore.js";
import { Styles } from "@pages/content/widgets/Styles.js";

/********************************************************************
 created:    2023-04-06
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const commands = [
  { name: "history", notes: "list history messages" },
  { name: "help", notes: "print help message" }
];

const historyStore = useHistoryStore();

export function fetchCommandHint(prefix) {
  const candidates = [];
  for (let v of commands.values()) {
    const name = v.name;
    if (name.startsWith(prefix)) {
      candidates.push(name);
    }
  }

  if (candidates.length > 0) {
    const hint = longestCommonPrefix(candidates);
    return hint;
  }

  return prefix;
}

function printHistory() {
  const list = historyStore.getHistoryList();
  let output = "history commands: \n\n";
  for (let i = 0; i < list.length; i++) {
    output += `${i + 1}. ${list[i]} \n`;
  }

  printTextWithTimestamp(output);
}

function printHelp() {
  let output = Styles.table + "<table><thead><tr><th></th><th>Name</th><th>Notes</th></tr></thead>";
  for (let [i, v] of commands.entries()) {
    output += `<tbody><tr><td>${i + 1}</td><td>${v.name}</td><td>${v.notes}</td></tr></tbody>`;
  }

  output += "</table>";
  printHtmlWithTimestamp(output);
}

export function checkBuiltinCommands(query) {
  // 如果是history命令，则打印
  switch (query) {
    case "history":
      printHistory();
      return true;
    case "help":
      printHelp();
      return true;
  }

  return false;
}