/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { createEffect, createSignal } from "solid-js";
import { getUserConfig, updateUserConfig } from "@src/dao/UserConfig.js";

export default function Toolbar(props) {
  const userConfig = getUserConfig();
  const [webAccess, setWebAccess] = createSignal(userConfig.webAccess);
  const handleWebAccessToggle = () => setWebAccess((prev) => !prev);

  createEffect(() => {
    userConfig.webAccess = webAccess()
    updateUserConfig(userConfig)
  });

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

  return <div className="flex flex-col gap-0">
    <div
      className="toolbar flex items-center justify-between gap-2 rounded-md px-1">
      {webAccessToggle}
    </div>
  </div>;
}