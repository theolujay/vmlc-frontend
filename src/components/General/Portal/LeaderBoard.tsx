import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Table from '@/components/ui/Table'
import TabWrapper from '@/components/ui/Tabs/TabWrapper'
import { Tab } from '@/types/TabType'
import { ScreeningIcon } from '../GeneralIcon'
import useGetLeaderBoard from '@/hooks/useGetLeaderboard'

export default function LeaderBoard() {
  return (
    <ResponsiveContainer className='gap-3 px-0'>
        <h2 className='font-bold p-2 border-b border-[#E4E7EC] text-xl'>Results/Leaderboard</h2>
        <Board/>
    </ResponsiveContainer>
  )
}


function Board(){
    const {data}=useGetLeaderBoard()

    const tabs:Tab[]=[{
        value:'Screening',
        label:<div className='flex justify-between gap-1 pb-1 border-b-2'><span><ScreeningIcon/></span><span>Screening</span></div>,
        content:<ScreeningTab/>
    }]
    return <TabWrapper tabs={tabs} />
    
}



function ScreeningTab(){
    return <div className="flex flex-col">
        <InfoDesk/>
        <Table data={[]} columns={['Position','Name','Score']} />
    </div>
}


function InfoDesk(){
    return <div className="flex text-white flex-col gap-1 bg-[#00455E] p-2">
        <p className='text-xl'>Congratulations!</p>
        <p className='text-sm'>Congratulations on scoring 92% on the screening exam! {`You've`} secured the 13th spot on the leaderboard, which qualifies you for the next stage of the league exams. Keep up the great work, and best of luck moving forward!</p>
    </div>
}