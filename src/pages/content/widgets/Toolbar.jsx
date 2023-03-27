/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/
import { createSignal } from "solid-js";

export default function Toolbar(props) {

  const [webAccess, setWebAccess] = createSignal(false)
  const handleWebAccessToggle = () => setWebAccess((prev) => !prev)


  const webAccessToggle =
    <div className="wcg-group wcg-relative wcg-flex">
      <label className="wcg-relative wcg-inline-flex wcg-cursor-pointer wcg-items-center">
        <input type="checkbox" value="" className="wcg-peer wcg-sr-only" checked={webAccess}
               onChange={handleWebAccessToggle} />
        <div
          className="dark:wcg-peer-focus:ring-blue-800 wcg-peer wcg-h-5 wcg-w-9 wcg-rounded-full wcg-bg-gray-500 after:wcg-absolute after:wcg-top-[2px] after:wcg-left-[2px] after:wcg-h-4 after:wcg-w-4 after:wcg-rounded-full after:wcg-border after:wcg-border-gray-300 after:wcg-bg-white after:wcg-transition-all after:wcg-content-[''] peer-checked:wcg-bg-emerald-700 peer-checked:after:wcg-translate-x-full peer-checked:after:wcg-border-white peer-focus:wcg-ring-2 peer-focus:wcg-ring-white dark:wcg-border-gray-600" />
        <span
          className="wcg-ml-1 wcg-pl-1 wcg-text-sm wcg-font-semibold after:wcg-content-['Web'] md:after:wcg-content-['Web_access']" />
      </label>
      <span class="wcg-absolute wcg-left-1/2 wcg-m-4 wcg-mx-auto -wcg-translate-x-6 wcg-translate-y-3 wcg-rounded-md wcg-bg-gray-800 wcg-p-1
            wcg-text-xs wcg-text-gray-100 wcg-opacity-0 wcg-transition-opacity group-hover:wcg-opacity-100">Alt+W</span>
    </div>;

  return <div className="wcg-flex wcg-flex-col wcg-gap-0">
    <div
      className="wcg-toolbar wcg-flex wcg-items-center wcg-justify-between wcg-gap-2 wcg-rounded-md wcg-px-1">
      {webAccessToggle}
    </div>
  </div>
}