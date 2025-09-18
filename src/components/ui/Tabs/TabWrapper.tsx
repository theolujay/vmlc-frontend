import React from "react"
import * as Tabs from "@radix-ui/react-tabs"
import { TabWrapperProps } from "@/types/TabType"



export default function TabWrapper({
  tabs,
  defaultValue,
  tabListClassName = "flex gap-4 justify-between",
  triggerClassName = "px-4 py-2 rounded-md data-[state=active]:text-[#3E4095] text-black data-[state=active]:cursor-pointer font-bold"
}: Readonly<TabWrapperProps>) {
  return (
    <Tabs.Root
      defaultValue={defaultValue ?? tabs[0]?.value}
      className="flex flex-col"
    >
      <Tabs.List className={tabListClassName}>
        {tabs.map((tab, index) => (
          <Tabs.Trigger
            key={`tab-trigger-${index}`}
            value={tab.value}
            className={triggerClassName}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab, index) => (
        <Tabs.Content
          key={`tab-content-${index}`}
          value={tab.value}
          className=""
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
