// "use client";

// import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// // import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
// import clsx from "clsx";
// import { CheckedIcon, ChevronDownIcon } from "./SvgAsset/GeneralAsset";

// interface MultiSelectItem {
//   id: string | number;
//   label: string;
// }

// export default function MultiSelectDropdown({
//   items,
//   selected,
//   onChange,
//   placeholder = "Select items",
// }: {
//   items: MultiSelectItem[];
//   selected: (string | number)[];
//   onChange: (values: (string | number)[]) => void;
//   placeholder?: string;
// }) {
//   const toggle = (value: string | number) => {
//     if (selected.includes(value)) {
//       onChange(selected.filter((v) => v !== value));
//     } else {
//       onChange([...selected, value]);
//     }
//   };

//   return (
//     <DropdownMenu.Root>
//       <DropdownMenu.Trigger asChild>
//         <button
//           className="inline-flex items-center justify-between w-full h-[40px] px-3 border border-gray-300 rounded-md bg-white text-gray-700"
//         >
//           <span className="truncate">
//             {selected.length > 0
//               ? items
//                   .filter((i) => selected.includes(i.id))
//                   .map((i) => i.label)
//                   .join(", ")
//               : placeholder}
//           </span>
//           <ChevronDownIcon />
//         </button>
//       </DropdownMenu.Trigger>

//       <DropdownMenu.Portal>
//         <DropdownMenu.Content
//           className="bg-white border shadow-md rounded-md p-1 z-50"
//           sideOffset={5}
//         >
//           {items.map((item) => (
//             <DropdownMenu.CheckboxItem
//               key={item.id}
//               checked={selected.includes(item.id)}
//               onCheckedChange={() => toggle(item.id)}
//               className={clsx(
//                 "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer select-none",
//                 "data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white"
//               )}
//             >
//               <CheckedIcon 
//                 className={clsx(
//                   "w-4 h-4",
//                   selected.includes(item.id)
//                     ? "opacity-100"
//                     : "opacity-0"
//                 )}
//               />
//               {item.label}
//             </DropdownMenu.CheckboxItem>
//           ))}
//         </DropdownMenu.Content>
//       </DropdownMenu.Portal>
//     </DropdownMenu.Root>
//   );
// }



"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useState } from "react";
import { CheckedIcon, ChevronDownIcon } from "./SvgAsset/GeneralAsset";
import { SelectItem } from "@/types/Index";

// interface MultiSelectItem {
//   id:  number;
//   label: string;
// //   [key: string]: any; // allows extra fields like title, code, etc.
// }

interface MultiSelectDropdownProps {
  items: SelectItem[];
  selected: SelectItem[];
  onChange: (selectedItems: SelectItem[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  items,
  selected,
  onChange,
  placeholder = "Select items",
}: Readonly<MultiSelectDropdownProps>) {
  const toggle = (item: SelectItem) => {
    const alreadySelected = selected.some((sel) => sel.id === item.id);
    if (alreadySelected) {
      onChange(selected.filter((sel) => sel.id !== item.id));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex items-center justify-between w-full h-[40px] px-3 border border-gray-300 rounded-md bg-white text-gray-700"
        >
          <span className="truncate text-left">
            {selected.length > 0
              ? selected.map((i) => i.label).join(", ")
              : placeholder}
          </span>
          <ChevronDownIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white border shadow-md rounded-md p-1 z-50"
          sideOffset={5}
        >
          {items.map((item) => {
            const isSelected = selected.some((sel) => sel.id === item.id);
            return (
              <DropdownMenu.CheckboxItem
                key={item.id}
                checked={isSelected}
                onCheckedChange={() => toggle(item)}
                className={clsx(
                  "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer select-none",
                  "data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white"
                )}
              >
                <CheckedIcon
                  className={clsx(
                    "w-4 h-4",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </DropdownMenu.CheckboxItem>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
