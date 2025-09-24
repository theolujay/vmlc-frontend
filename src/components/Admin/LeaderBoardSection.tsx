import Button from "../ui/Button";
import ResponsiveContainer from "../ui/ResponsiveContainer";
import ScreeningTabWrapper from "../ui/Tabs/ScreeningTabWrapper";
import AdminHeader from "./AdminHeader";

export default function LeaderBoardSection() {
  return (
   <div className='flex flex-col gap-1 '>
    <AdminHeader label="Leaderboards" isExport actionButton={<Button className="px-2 bg-grey-base-400 text-white">UPLOAD</Button>} />
    <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                
    <ResponsiveContainer>
      <ScreeningTabWrapper tabs={[
        {label:'Overall Leaderboard',value:'overall-leaderboard',content:<div>Overall Leaderboard</div>},
      ]} />
    </ResponsiveContainer>
            </div>
   </div>
  )
}
