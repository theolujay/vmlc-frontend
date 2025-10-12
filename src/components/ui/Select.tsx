
import React from "react";
import * as Select from "@radix-ui/react-select";
import { CaretDropdown } from "./SvgAsset/GeneralAsset";
import clsx from "clsx";

export default function SelectInput({
    placeholder = "Select an item",
    items,
}: Readonly<{
    placeholder?: string;
    items: string[];
}>) {
    return (
        <Select.Root onValueChange={(val) => alert(`selected ${val}`)}>
            <Select.Trigger
                className="inline-flex h-full w-full border border-[#D0D5DD] items-center justify-between gap-[5px] rounded-md bg-white px-[15px] leading-none outline-none"
                aria-label="stages"
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon className="text-violet">
                    <CaretDropdown />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="z-50 shadow-md bg-white rounded-md" position="popper" sideOffset={5}>
                    <Select.Viewport className="p-2">
                        {items.map((val) => (
                            <SelectItem key={val} value={val}>{val}</SelectItem>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>

        </Select.Root>
    );
}

type SelectItemProps = React.ComponentPropsWithoutRef<typeof Select.Item> & {
    children: React.ReactNode;
    className?: string;
};

const SelectItem = React.forwardRef<
    React.ElementRef<typeof Select.Item>,
    SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
    return (
        <Select.Item
            className={clsx(
                "relative flex h-[30px] select-none items-center data-[highlighted]:bg-[#3e4095] data-[highlighted]:text-white rounded-[3px] pl-[25px] pr-[35px]  leading-none text-gray-700 data-[highlighted]:bg-violet9 ",
                className
            )}
            {...props}
            ref={forwardedRef}
        >
            <Select.ItemText>{children}</Select.ItemText>
            <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                {/* Optional: Checkmark icon */}
            </Select.ItemIndicator>
        </Select.Item>
    );
});

SelectItem.displayName = "SelectItem";




