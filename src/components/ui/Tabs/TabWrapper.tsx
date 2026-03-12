"use client"
import React, { useCallback } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import { TabWrapperProps } from "@/types/TabType"
import { useRouter, useSearchParams } from "next/navigation"

export default function TabWrapper({
  tabs,
  defaultValue,
  tabListClassName = "flex gap-4 justify-between border-b border-gray-300",
  triggerClassName = "px-4 data-[state=active]:border-b-2 whitespace-nowrap data-[state=active]:border-[#3E4095] py-2  hover:cursor-pointer data-[state=active]:text-[#3E4095] text-black data-[state=active]:cursor-pointer font-bold"
}: Readonly<TabWrapperProps>) {


  const router = useRouter()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get('tab') || tabs[0]?.value;
  
  const handleTabChange = useCallback((value: string) => {
    // When switching tabs, we usually want to start at the "main page" of that tab
    // by clearing other query parameters like 'view', 'id', etc.
    router.push(`?tab=${value}`, { scroll: false });
  }, [router])

  const handleTriggerClick = (value: string) => {
    // If clicking the already active tab, force a reset to its main page
    if (activeTab === value) {
      router.push(`?tab=${value}`, { scroll: false });
    }
  }

  return (
    <Tabs.Root
      onValueChange={handleTabChange}
      value={activeTab}
      defaultValue={defaultValue ?? tabs[0]?.value}
      className="flex flex-col h-full"
    >
      <Tabs.List className={tabListClassName}>
        {tabs.map((tab, index) => (
          <Tabs.Trigger
            key={`tab-trigger-${index}`}
            value={tab.value}
            onClick={() => handleTriggerClick(tab.value)}
            className={triggerClassName}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <div className="flex-1 overflow-hidden">
        {tabs.map((tab, index) => (
          <Tabs.Content
            key={`tab-content-${index}`}
            value={tab.value}
            className="h-full overflow-y-auto"
          >
            {tab.content}
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  )
}
