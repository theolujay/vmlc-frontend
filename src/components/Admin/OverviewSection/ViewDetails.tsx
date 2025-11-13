"use client"
import { AverageIcon, GotoSummaryIcon, LeaderBoardSummaryIcon, ScreeningSummaryIcon } from '@/components/General/GeneralIcon'
import Button from '@/components/ui/Button'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Table from '@/components/ui/Table'
import ScreeningTabWrapper from '@/components/ui/Tabs/ScreeningTabWrapper'
import withAuthentication from '@/hocs/withAuthentication'
import useGetCandidateDetails from '@/hooks/useGetCandidateDetails'
import { ExamTakenType, RecordsType, submissionItemType } from '@/types/CandidateType'
import { getUserInitials } from '@/utils/capitalizeWords'
import { formatDate } from '@/utils/formatFileSize'
import AdminHeader from '../AdminHeader'
import { ActivitiesIcon, ScoresIcon } from '../AdminIcons'
import EmptySession from '../EmptySession'
import Spinner from '@/components/ui/spinner/spinner'
import CustomTable from '@/components/ui/CustomTable'

function ViewUserDetails({ id }: Readonly<{ id: string }>) {

    const { data ,isPending} = useGetCandidateDetails(id)
    
    
    const userName=[data?.user?.first_name,data?.user?.last_name].join(' ')
    return (

        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport label='Exam System' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span>SEND MESSAGE</span></Button>} />
           {isPending?<div className='w-full h-full grid place-content-center'>
            <Spinner/>
           </div>:
            <div className="flex flex-col gap-3 mt-3  w-[96%] mx-auto">
                <Details role={data?.role??''} school={data?.school??''} dateJoined={data?.user?.date_joined??new Date()} 
                // userName={data?.candidate_info?.name??''} 
                userName={userName} 
                email={data?.user?.email??''} />
                <ViewDetailsTabSection detailsData={data?.records as RecordsType} />
            </div>
           }
        </div>
        
    )
}

export default withAuthentication(ViewUserDetails)



function Details({ userName, email, dateJoined, school, role }: { userName: string, email: string, dateJoined: Date, school: string, role: string }) {
    const userInitials = getUserInitials(userName)
    return <ResponsiveContainer className='flex gap-3 flex-col p-8'>
        <div className="flex items-center gap-2">
            <div className="bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full">
                <span className="font-bold text-lg">{userInitials}</span>
            </div>
            {/* <span>{fi}</span> */}
            <h2 className="font-bold text-3xl">{userName}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col gap-2">
                <div className="flex-col gap-1 flex">
                    <span className='text-sm text-[#475367]'>STATUS</span>
                    <span className='border rounded-2xl text-[#01ACEA] border-[#01ACEA] w-fit px-2 bg-[#F5FCFE]'>student</span>
                </div>
                <div className="flex-col  gap-1 flex">
                    <span className='text-sm text-[#475367]'>USER TYPE</span>
                    <span className='border rounded-2xl text-[#01ACEA] border-[#01ACEA] w-fit   px-2 bg-[#F5FCFE]'>student</span>
                </div>
                <div className="flex-col text-sm  gap-1 flex">
                    <span className='text-[#475367] text-sm'>INSTITUTION NAME</span>
                    <span>{school}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex-col gap-1 flex">
                    <span className='text-[#475367] text-sm'>VERIFICATION</span>
                    <span className='bg-[#FFF1F3] rounded-full w-fit px-2 py-1 text-[#C01048]'>{role}</span>
                </div>
                <div className="flex-col gap-1 flex">
                    <span className='text-[#475367] text-sm'>EMAIL</span>
                    <span>{email}</span>
                </div>
                <div className="flex-col gap-1 flex">
                    <span className='text-[#475367] text-sm'>DATE JOINED</span>
                    <span>{formatDate(dateJoined)}</span>
                </div>
            </div>
        </div>
    </ResponsiveContainer>
}



function ViewDetailsTabSection({detailsData}:{detailsData:RecordsType}) {
    
    
    return (
        <ResponsiveContainer className="px-0">
            <ScreeningTabWrapper tabs={[
                 { label: <ActivitiesLabel  />, value: 'Activities', content: <ActivityComponent results={detailsData.performance.exams_taken??[]} /> },
                // { label: <ActivitiesLabel  />, value: 'Activities', content: <ActivityComponent results={detailsData.performance.exams_taken} /> },
                { label: <ScoresLabel />, value: 'Scores', content: <ScoreComponent  scoresData={detailsData} /> },
            ]} />
        </ResponsiveContainer>

    )
}


function ActivitiesLabel() {
    return <div className='flex gap-1 items-center'><span><ActivitiesIcon /></span><span>Activities</span></div>
}


function ScoresLabel() {
    return <div className='flex gap-1 items-center'><span><ScoresIcon /></span><span>Scores</span></div>
}

function ActivityComponent({ results }: Readonly<{ results: ExamTakenType[] }>) {
    
    return <div className="flex flex-col">
        {results.length > 0 ?
            <div className="flex gap-2 flex-col">
                <CustomTable columns={[
                    {key:'Exams Taken',header:'Exams Taken',render:(_,row)=><div className="flex  items-center gap-1">
              {row.exam_title}
            </div>},
            {key:'Stage',header:'Stage',render:(_,row)=><div className="flex  items-center gap-1">
              {row.exam_stage}
            </div>},
              {key:'Score',header:'Score',render:(_,row)=><div className="flex  items-center gap-1">
              {row.score}
            </div>},
            {key:'Date Taken',header:'Date Taken',render:(_,row)=><div className="flex  items-center gap-1">
              {formatDate(row.recorded_at)}
            </div>},
                ]} data={results} />
                {/* <Table data={[]} columns={['Activity', 'Date', 'Time']} /> */}
            </div> : <EmptySession desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here " label='Exams hasn’t happened yet' />}
    </div>
}


function ScoreComponent({scoresData}:{scoresData:RecordsType}) {

    return <div className="flex gap-2 p-3 flex-col">
        <AverageScore position={scoresData.performance.stats.leaderboard_ranking} percentage={scoresData.performance.stats.average_score} />
        <ScreeningScore screening={null} />
        {/* <LeagueScoresWrapper scores={scoresData.performance.exams}/> */}
    </div>
}


function AverageScore({ percentage, position }: { percentage: number, position: number|null }) {
    return <div className='bg-[#3E4095]  rounded-[24px]   w-full  flex flex-col p-3'>
        <div className="grid grid-cols-2">
            <div className="flex gap-2 flex-col">
                <div className='flex gap-2'>
                    <span><AverageIcon /></span>
                    <span className='text-white text-sm'>AVERAGE SCORE</span>
                </div>
                <span className="font-bold text-white text-2xl">{percentage}%</span>
            </div>

            <div className="flex gap-2 flex-col">
                <div className='flex gap-2'>
                    <span><LeaderBoardSummaryIcon /></span>
                    <span className='text-white text-sm'>LEADERBOARD POSTION</span>
                </div>
                <span className="font-bold text-white text-2xl">{position}</span>
            </div>
        </div>
    </div>
}


function ScreeningScore({ screening }: Readonly<{ screening: number|null }>) {
    return <div className='bg-[#E6F7FD]  rounded-[24px]   w-full  flex flex-col p-3'>
        <div className="flex">
            <div className="flex gap-2 flex-col w-full">
                <div className='flex gap-2'>
                    <span><ScreeningSummaryIcon /></span>
                    <span className=' text-[#344054] text-sm'>SCREENING SCORE</span>
                </div>
                {
                    screening&&
                <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl">{screening}%</span>
                    <GotoSummaryIcon />
                </div>
                }
            </div>
        </div>
    </div>
}


function LeagueScoresWrapper({scores}:{scores:ExamTakenType[]}){
    return <div className="flex flex-wrap gap-2 justify-between">
        {scores.map((val,index)=><LeagueScore key={`league-score-${index}`} label={val.exam_stage} score={val.score} />)}

    </div>
}


function LeagueScore({label,score}:{label:string,score:number}){
    return <div className="flex justify-between gap-2 bg-[#F0F2F5] flex-1 rounded-xl last:bg-[#018ABB] last:text-white  p-2 flex-col">
        <div className="flex flex-col">
            <span><ScreeningSummaryIcon/></span>
            <span className="text-sm">{label}</span>
        </div>
        <div className="flex font-bold text-xl justify-between">
            <span>{score}%</span>
            <span><GotoSummaryIcon/></span>
        </div>
    </div>
}

