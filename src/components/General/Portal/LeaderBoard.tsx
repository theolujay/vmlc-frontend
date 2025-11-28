import EmptySession from '@/components/Admin/EmptySession'
import { ScreeningLabel } from '@/components/Admin/Leaderboard/LeaderBoardSection'
import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Spinner from '@/components/ui/spinner/spinner'
import ScreeningTabWrapper from '@/components/ui/Tabs/ScreeningTabWrapper'
import useGetLeaderBoard from '@/hooks/useGetLeaderboard'
import usePagination from '@/hooks/usePagination'
import { useState } from 'react'

export default function LeaderBoard() {
    return (
        <ResponsiveContainer className='gap-3 px-0'>
            <h2 className='font-bold p-2 border-b border-[#E4E7EC] text-xl'>Results/Leaderboard</h2>
            <Board />
        </ResponsiveContainer>
    )
}


function Board() {
    const { isPending, data } = useGetLeaderBoard()

    
    if (isPending || !data) {
        return <div className="grid w-full place-content-center"><Spinner /></div>
    }

    let leaderBoardItems;

    if ('available_leaderboards' in data) {

        leaderBoardItems = data.available_leaderboards.toReversed();
    }




    const leaderBoardTab = leaderBoardItems?.map((val) => ({
        label: <ScreeningLabel label={val.stage} />,
        value: val.stage_display,
        content: <ScreeningTab stage={val.stage} level={val.level} />
        
    }));
   
    return <ScreeningTabWrapper tabs={leaderBoardTab ?? []} />

}





function ScreeningTab({ stage, level }: { stage: string; level: number }) {
    const { page} = usePagination();
    const [filters] = useState({ stage, level });
    const { data } = useGetLeaderBoard(page, filters);

    

    
    if (!data) {
        return (
            <EmptySession
                desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here"
                label="Exams has not happened yet"
            />
        );
    }

    
    if (!("top_three" in data) || !("remaining_candidates" in data)) {
        return (
            <EmptySession
                desc="No ranked leaderboard data available for this stage"
                label="Awaiting results"
            />
        );
    }

    
    if (data.remaining_candidates.length === 0 && data.top_three.length === 0) {
        return (
            <EmptySession
                desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here"
                label="Exams has not happened yet"
            />
        );
    }

    const allCandidates = [...data.top_three, ...data.remaining_candidates];
    

    return (
        <div className="flex flex-col">
            <InfoDesk />
            <CustomTable columns={[
                { key: 'position', header: 'Position', render: (_, row) => <div className="flex items-center gap-1">{row.rank}</div> },
                { key: 'Name', header: 'Name', render: (_, row) => <div className="flex  items-center gap-1">{row.candidate.full_name}</div> },


                {
                    key: 'Score', header: 'Score', render: (_, row) => <div className="flex  items-center gap-1">
                        {row.score}
                    </div>
                },

            ]} data={allCandidates}

            />

        </div>
    );
}


function InfoDesk() {
    return (
        <div className="flex text-white flex-col gap-1 bg-[#00455E] p-2">
            <p className="text-xl">Congratulations!</p>
            <p className="text-sm">
                Congratulations on scoring 92% on the screening exam! You've secured the
                13th spot on the leaderboard, which qualifies you for the next stage of
                the league exams. Keep up the great work, and best of luck moving
                forward!
            </p>
        </div>
    );
}
























// import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
// import Table from '@/components/ui/Table'
// import TabWrapper from '@/components/ui/Tabs/TabWrapper'
// import { TabType } from '@/types/TabType'
// import { ScreeningIcon } from '../GeneralIcon'
// import useGetLeaderBoard from '@/hooks/useGetLeaderboard'

// export default function LeaderBoard() {
//   return (
//     <ResponsiveContainer className='gap-3 px-0'>
//         <h2 className='font-bold p-2 border-b border-[#E4E7EC] text-xl'>Results/Leaderboard</h2>
//         <Board/>
//     </ResponsiveContainer>
//   )
// }


// function Board(){
//     const {data}=useGetLeaderBoard()


//     const tabs:TabType[]=[{
//         value:'Screening',
//         label:<div className='flex justify-between gap-1 pb-1 border-b-2'><span><ScreeningIcon/></span><span>Screening</span></div>,
//         content:<ScreeningTab/>
//     }]
//     return <TabWrapper tabs={tabs} />
    
// }



// function ScreeningTab(){
//     return <div className="flex flex-col">
//         <InfoDesk/>
//         <Table data={[]} columns={['Position','Name','Score']} />
//     </div>
// }


// function InfoDesk(){
//     return <div className="flex text-white flex-col gap-1 bg-[#00455E] p-2">
//         <p className='text-xl'>Congratulations!</p>
//         <p className='text-sm'>Congratulations on scoring 92% on the screening exam! {`You've`} secured the 13th spot on the leaderboard, which qualifies you for the next stage of the league exams. Keep up the great work, and best of luck moving forward!</p>
//     </div>
// }