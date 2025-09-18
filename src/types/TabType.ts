export type Tab = {
  value: string
  label: React.ReactNode
  content: React.ReactNode
}

export type TabWrapperProps = {
  tabs: Tab[]
  defaultValue?: string
  tabListClassName?: string
  triggerClassName?: string
}