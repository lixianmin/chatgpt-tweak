/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { createChatgptFactory } from "@pages/content/sites/chatgpt/Factory.jsx";
import { createClaudeFactory } from "@pages/content/sites/claude/Factory.jsx";
import { createBingFactory } from "@pages/content/sites/bing/Factory.jsx";

export function createSiteFactory() {
  const host = window.location.host;
  switch (host) {
    case "chat.openai.com":
      return createChatgptFactory();
    case "app.slack.com":
      return createClaudeFactory();
    case "www.bing.com":
      return createBingFactory();
    default:
      return null;
  }
}