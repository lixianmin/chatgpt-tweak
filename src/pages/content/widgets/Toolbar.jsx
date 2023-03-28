/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { createEffect, createSignal } from "solid-js";
import useUserConfig from "@src/dao/UserConfig.js";
import usePrompts from "@src/dao/Prompts.js";
import { Icons } from "@src/core/Icons.jsx";

export default function(props) {
  const userConfig = useUserConfig();
  const prompts = usePrompts();

  const [webAccess, setWebAccess] = createSignal(userConfig.webAccess.get());
  const handleWebAccessToggle = () => setWebAccess((prev) => !prev);

  createEffect(() => {
    userConfig.webAccess.set(webAccess());
  });

  function handlePromptClick() {
    console.log("handle prompts click");
  }

  function handlePromptChange(name) {
    removeFocusFromCurrentElement();
    prompts.setCurrentPromptName(name);
  }

  function removeFocusFromCurrentElement() {
    document.activeElement?.blur();
  }

  const webAccessToggle =
    <div className="group relative flex">
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" value="" className="peer sr-only" checked={webAccess()}
               onChange={handleWebAccessToggle} />
        <div
          className="dark:peer-focus:ring-blue-800 peer h-5 w-9 rounded-full bg-gray-500 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-700 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-white dark:border-gray-600" />
        <span
          className="ml-1 pl-1 text-sm font-semibold after:content-['Web'] md:after:content-['Web_access']" />
      </label>
    </div>;

  const promptsDropList = <div className="dropdown-top dropdown min-w-[9.5rem]" onClick={handlePromptClick}>
    <div tabIndex={0}
         className="flex cursor-pointer flex-row items-center justify-between gap-0 px-2">
      <label
        className="max-w-[7rem] cursor-pointer justify-start truncate pr-0 text-sm font-semibold normal-case">
        {prompts.getCurrentPromptName()}
      </label>
      {Icons.expand}
    </div>
    <ul tabIndex={0}
        className="dropdown-content menu m-0 flex max-h-96 w-52 flex-col flex-nowrap overflow-auto rounded-md bg-gray-800 p-0">
      {prompts.loadAllPrompts().map((prompt) =>
        <li tabIndex={0} className="text-sm text-white hover:bg-gray-700"
            onClick={() => handlePromptChange(prompt.name)}
            key={prompt.name}
        >
          <a>{prompt.name}</a>
        </li>
      )
      }

      {/*<li className="text-sm text-white hover:bg-gray-700"*/}
      {/*    onClick={() => Browser.runtime.sendMessage("show_options")*/}
      {/*    }*/}
      {/*>*/}
      {/*  <a>+ {getTranslation(localizationKeys.buttons.newPrompt)}</a>*/}
      {/*</li>*/}
    </ul>
  </div>;

  return <div id={props.id} className="flex flex-col gap-0">
    <div
      className="toolbar flex items-center justify-between gap-2 rounded-md px-1">
      {webAccessToggle}
      {promptsDropList}
    </div>
  </div>;
}