// "use strict";
// import NameInput from "@pages/options/widgets/NameInput.js";
//
// /********************************************************************
//  created:    2023-03-28
//  author:     lixianmin
//
//  Copyright (C) - All Rights Reserved
//  *********************************************************************/
//
// export default function() {
//   const PromptList = (
//     <div>
//       <button
//         className="btn-primary btn w-full text-base"
//         onClick={handleAdd}>
//                 <span class="material-symbols-outlined mr-2">
//                     add_circle
//                 </span>
//         {getTranslation(localizationKeys.buttons.newPrompt)}
//       </button>
//       <ul className="scroll-y menu mt-4 flex max-h-96 scroll-m-0 flex-col
//                     flex-nowrap overflow-auto border-2
//                     border-solid border-white/20 p-0">
//         {savedPrompts.map((prmpt: Prompt) => (
//           <li key={prmpt.uuid} onClick={() => handleSelect(prmpt)}>
//             <a className={`text-base ${prmpt.uuid === prompt.uuid ? "active" : ""}`}>
//               📝 {prmpt.name}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
//
//   return <>
//     <div className="rounded-box mt-10 flex h-[32rem] w-4/5 flex-row gap-4 border py-4">
//       <div className="w-1/3">
//         {PromptList}
//       </div>
//
//       <div className="flex w-2/3 flex-col">
//         <div className="flex flex-row items-center gap-2">
//           <NameInput />
//           {/*    {btnDelete}*/}
//         </div>
//         {/*  {textArea}*/}
//
//         {/*  {actionToolbar}*/}
//       </div>
//     </div>
//   </>;
// }
