"use client"
import { TabWrapperProps } from "@/types/TabType"
import * as Tabs from "@radix-ui/react-tabs"



export default function TabWrapper({
  tabs,
  defaultValue,
  tabListClassName = "flex gap-4 px-3 border-b  border-gray-300 justify-between",
  triggerClassName = "px-4 py-2 hover:cursor-pointer data-[state=active]:text-[#3E4095] data-[state=active]:border-b-2 data-[state=active]:border-[#3E4095] text-black data-[state=active]:cursor-pointer font-bold"
}: Readonly<TabWrapperProps>) {



  return (
    <Tabs.Root
    // onValueChange={handleTabChange}
    // value={activeTab}
      defaultValue={defaultValue ?? tabs[0]?.value}
      className="flex flex-col "
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
