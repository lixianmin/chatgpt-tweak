"use strict";

import * as cheerio from "cheerio";

/********************************************************************
 created:    2023-05-13
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function createGoogle() {
  async function search(query) {
    try {
      const url = "https://www.google.com/search?ie=UTF-8&q=" + query;
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);

      const items = [];
      $("div.g").each(function(i, elem) {
        const target = $(elem);
        const content = target.find("div[data-sncf='1'] div:last-child");
        const item = {
          title: target.find("h3").text(),
          url: target.find("a").attr("href"),
          text: content.text(),
          html: content.html()
        };

        items.push(item);
      });

      return {
        items: items
      };
    } catch (e) {
      console.warn(e);
    }

    return "";
  }

  return {
    search: search
  };
}