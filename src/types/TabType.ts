export type TabType = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
};

export type TabWrapperProps = {
  tabs: TabType[];
  defaultValue?: string;
  tabListClassName?: string;
  triggerClassName?: string;
};
