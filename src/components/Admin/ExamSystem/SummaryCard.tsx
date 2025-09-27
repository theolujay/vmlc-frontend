import clsx from "clsx";
import { SummaryIcon } from "../AdminIcons";
import { GotoIcon } from "../../General/GettingStarted/GettingStartedAssets";

export default function SummaryCard({ label, value, isActive = false }: Readonly<{ textColor?: string, value: number, label: string, isActive?: boolean }>) {
  return <div className={clsx("flex flex-col p-4 gap-2 rounded-[10px] ", isActive ? 'bg-[#3E4095] text-white' : 'bg-[#F7F9FC] text-[#344054]')}>
    <div className="flex gap-2">
      <span><SummaryIcon /></span>
      <span className={clsx('text-sm  ')}>{label}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className={clsx('text-2xl font-bold', isActive ? 'text-white' : 'text-black')}>{value}</span>
      {/* <span className={clsx('text-sm font-bold',)}><GotoIcon /></span> */}
    </div>
  </div>
}
