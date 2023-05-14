import { onMount } from "solid-js";
import { createSiteFactory } from "@pages/content/sites/SiteFactory";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const App = () => {
  const toolbarId = "tweak-toolbar";
  const factory = createSiteFactory();

  function checkAttachTweakUI() {
    if (factory === null) {
      console.warn('factory is null')
      return;
    }

    try {
      // 因为chatgpt的页面变来变去，重新加载什么的都很多，发现哪怕使用MutationObserver也抓不住。定期轮询是最稳定的
      setInterval(() => {
        const shadowRoot = factory.getShadowRoot();
        const toolbar = shadowRoot?.getElementById(toolbarId);
        if (!toolbar) {
          factory.attachTweakUI(toolbarId);
        }
      }, 200);
    } catch (err) {
      console.error(err);
    }
  }

  onMount(() => {
    checkAttachTweakUI();
  });

  return <>
  </>;
};

export default App;
