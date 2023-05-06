/********************************************************************
 created:    2023-05-05
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { createChatgptFactory } from "@pages/content/chatgpt/factory.jsx";
import { createClaudeFactory } from "@pages/content/claude/factory.jsx";

export function createSiteFactory() {
  const host = window.location.host;
  switch (host) {
    case "chat.openai.com":
      return createChatgptFactory();
    case "app.slack.com":
      return createClaudeFactory();
    default:
      return null;
  }
}