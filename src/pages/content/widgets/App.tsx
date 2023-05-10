import { onMount } from "solid-js";
import { createSiteFactory } from "@pages/content/widgets/SiteFactory";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const App = () => {
  const toolbarId = "tweak-toolbar";
  const factory = createSiteFactory();

  function checkAttachTweakUI() {
    try {
      // todo 这里实际上是创建了两个Toolbar，第一个创建了，但是不知道为啥消失不见的
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
