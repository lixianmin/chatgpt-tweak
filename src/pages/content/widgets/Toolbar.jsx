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
    <div className="group relative flex">
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" value="" className="peer sr-only" checked={webAccess}
               onChange={handleWebAccessToggle} />
        <div
          className="dark:peer-focus:ring-blue-800 peer h-5 w-9 rounded-full bg-gray-500 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-700 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-white dark:border-gray-600" />
        <span
          className="ml-1 pl-1 text-sm font-semibold after:content-['Web'] md:after:content-['Web_access']" />
      </label>
      <span class="absolute left-1/2 m-4 mx-auto -translate-x-6 translate-y-3 rounded-md bg-gray-800 p-1
            text-xs text-gray-100 opacity-0 transition-opacity group-hover:opacity-100">Alt+W</span>
    </div>

  return <div className="flex flex-col gap-0">
    <div
      className="toolbar flex items-center justify-between gap-2 rounded-md px-1">
      {webAccessToggle}
    </div>
  </div>
}