"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SelectItem } from "@/types/Index";
import clsx from "clsx";
import { CheckedIcon, ChevronDownIcon } from "./SvgAsset/GeneralAsset";

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
          className="inline-flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] outline-none transition-all cursor-pointer group shadow-sm"
        >
          <span className="truncate text-left font-bold">
            {selected.length > 0
              ? `${selected.length} session${selected.length > 1 ? 's' : ''} selected`
              : placeholder}
          </span>
          <div className="text-gray-400 group-hover:text-[#3E4095] transition-colors">
            <ChevronDownIcon />
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white border border-gray-100 max-h-[40vh] overflow-y-auto shadow-2xl rounded-2xl p-2 z-[100] min-w-[300px] animate-in fade-in zoom-in-95 duration-200"
          sideOffset={8}
          align="start"
        >
          <div className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
            Available Exam Sessions
          </div>
          {items.length === 0 ? (
            <div className="px-3 py-6 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No active sessions found</p>
            </div>
          ) : items.map((item) => {
            const isSelected = selected.some((sel) => sel.id === item.id);
            return (
              <DropdownMenu.CheckboxItem
                key={item.id}
                checked={isSelected}
                onCheckedChange={() => toggle(item)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer select-none outline-none transition-all",
                  "hover:bg-[#3E4095]/5 group",
                  isSelected ? "bg-[#3E4095]/5 text-[#3E4095]" : "text-gray-700"
                )}
              >
                <div className={clsx(
                    "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                    isSelected ? "bg-[#3E4095] border-[#3E4095] scale-110 shadow-lg shadow-[#3E4095]/20" : "border-gray-200 group-hover:border-[#3E4095]/30"
                )}>
                  <i className={clsx(
                      "fas fa-check text-[10px] text-white transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0"
                  )}></i>
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
              </DropdownMenu.CheckboxItem>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
