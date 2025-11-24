

"use client"
import { AverageIcon, GotoSummaryIcon, LeaderBoardSummaryIcon, ScreeningSummaryIcon } from '@/components/General/GeneralIcon'
import Button from '@/components/ui/Button'
import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Spinner from '@/components/ui/spinner/spinner'
import { PersonIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import ScreeningTabWrapper from '@/components/ui/Tabs/ScreeningTabWrapper'
import withAuthentication from '@/hocs/withAuthentication'
import useGetAccountDetails from '@/hooks/useGetAccountDetails'
import { ExamTakenType } from '@/types/CandidateType'
import { formatDate } from '@/utils/formatFileSize'
import AdminHeader from '../AdminHeader'
import { ActionsIcon } from '../AdminIcons'
import EmptySession from '../EmptySession'
import { UserProfileType } from '@/types/UserMgtType'
import { getUserName } from '@/utils/generalUtils'
import { User } from '@/types/Index'

function ViewStaffDetailsFromLeaderboard({ id }: Readonly<{ id: string }>) {

    const { data, isPending } = useGetAccountDetails(id)




    return (

        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport label='Exam System' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span>SEND MESSAGE</span></Button>} />
            {isPending ? <div className='w-full h-full grid place-content-center'>
                <Spinner />
            </div> :
                <div className="flex flex-col gap-3 mt-3  w-[96%] mx-auto">

                    <ViewDetailsTabSection detailsData={data?.profile as UserProfileType} />
                </div>
            }
        </div>

    )
}

export default withAuthentication(ViewStaffDetailsFromLeaderboard)



function ProfileComponent(
    { userName, status, email, dateJoined, occupation, role, userType, phone, document }: { phone: string, userType: string, userName: string, email: string, status: string, dateJoined: Date, occupation: string, document: string | null, role: string }
) {
    // const userInitials = getUserInitials(userName)
    return <div className='flex gap-3 flex-col p-8'>

        <div className='flex gap-3 mb-3 border-b border-[#E4E7EC] flex-col p-8'>

            <div className="flex flex-col gap-1">
                <span className='text-sm'>VERIFICATION STATUS</span>
                <span>{status}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-sm'>NAME</span>
                <span className='font-bold text-2xl'>{userName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <div className="flex-col  gap-1 flex">
                        <span className='text-sm text-[#475367]'>USER TYPE</span>
                        <span className='border rounded-2xl text-[#01ACEA] border-[#01ACEA] w-fit   px-2 bg-[#F5FCFE]'>{userType}</span>
                    </div>
                    <div className="flex-col gap-1 flex">
                        <span className='text-sm items-start text-[#475367]'>PHONE NUMBER</span>
                        <span className=' w-fit '>{phone}</span>
                    </div>
                    <div className="flex-col text-sm  gap-1 flex">
                        <span className='text-[#475367] text-sm'>OCCUPATION</span>
                        <span>{occupation}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex-col gap-1 flex">
                        <span className='text-[#475367] text-sm'>ROLE</span>
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
        </div>
        <div className='flex gap-3 mb-3 border-b border-[#E4E7EC] flex-col p-8'>
            <span className='text-[#475367] text-sm'>DOCUMENTS</span>
            {/* <div className="flex flex-col gap-1">
            <span>{status}</span>
        </div> */}

        {
            document?
            <div className="flex gap-2 items-center">
                <span className="document-icon"></span>
                <div className="flex flex-col">
                    <span>{document}</span>
                    {/* <span className='text-sm'>200kb</span> */}
                </div>
                <div className="flex">
                    <span className='text-[#3E4095] text-xs'>View</span>
                </div>
            </div>:<span>No document uploaded</span>
        }
        </div>
    </div>

}



function ViewDetailsTabSection({ detailsData }: { detailsData: UserProfileType }) {

    const userName = getUserName(detailsData.user.first_name, detailsData.user.last_name)
    const profileTabs = [
        {
            label: <ProfileLabel />,
            value: 'Profile',
            content: <ProfileComponent document='' userType={detailsData.profile_type} phone={detailsData.user.phone} status={detailsData.is_user_verified ? 'Approved' : 'Pending'} occupation={detailsData.occupation} role={detailsData.role} dateJoined={detailsData.user.date_joined} userName={userName} email={detailsData.user.email} />
        },
        {
            label: <ActionsLabel />,
            value: 'Actions',
            content: <ActionsComponent />
        }
    ]

    return (
        <ResponsiveContainer className="px-0">
            <ScreeningTabWrapper tabs={profileTabs} />
        </ResponsiveContainer>

    )
}


function ProfileLabel() {
    return <div className='flex gap-1 items-center'><span><PersonIcon /></span><span>Profile</span></div>
}


function ActionsLabel() {
    return <div className='flex gap-1 items-center'><span><ActionsIcon /></span><span>Actions</span></div>
}

function ActionsComponent(
    // { results }: Readonly<{ results: ExamTakenType[] }>
) {
    const results: any[] = []

    return <div className="flex flex-col">
        {results.length > 0 ?
            <div className="flex gap-2 flex-col">
                <CustomTable columns={[
                    {
                        key: 'Exams Taken', header: 'Exams Taken', render: (_, row) => <div className="flex  items-center gap-1">
                            {row.exam_title}
                        </div>
                    },
                    {
                        key: 'Stage', header: 'Stage', render: (_, row) => <div className="flex  items-center gap-1">
                            {row.exam_stage}
                        </div>
                    },
                    {
                        key: 'Score', header: 'Score', render: (_, row) => <div className="flex  items-center gap-1">
                            {row.score}
                        </div>
                    },
                    {
                        key: 'Date Taken', header: 'Date Taken', render: (_, row) => <div className="flex  items-center gap-1">
                            {formatDate(row.recorded_at)}
                        </div>
                    },
                ]} data={results} />
                {/* <Table data={[]} columns={['Activity', 'Date', 'Time']} /> */}
            </div> : <EmptySession desc="Activities done on this platform by this user would appear here " label='No actions yet' />}
    </div>
}


function ProfileComponentReuse(
    // {scoresData}:{scoresData:RecordsType}
) {

    const scoresData: any = {}
    return <div className="flex gap-2 p-3 flex-col">
        {/* <AverageScore position={scoresData.performance.stats.leaderboard_ranking} percentage={scoresData.performance.stats.average_score} /> */}
        {/* <ScreeningScore screening={null} /> */}
        {/* <LeagueScoresWrapper scores={scoresData.performance.exams}/> */}
    </div>
}


function AverageScore({ percentage, position }: { percentage: number, position: number | null }) {
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


function ScreeningScore({ screening }: Readonly<{ screening: number | null }>) {
    return <div className='bg-[#E6F7FD]  rounded-[24px]   w-full  flex flex-col p-3'>
        <div className="flex">
            <div className="flex gap-2 flex-col w-full">
                <div className='flex gap-2'>
                    <span><ScreeningSummaryIcon /></span>
                    <span className=' text-[#344054] text-sm'>SCREENING SCORE</span>
                </div>
                {
                    screening &&
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-2xl">{screening}%</span>
                        <GotoSummaryIcon />
                    </div>
                }
            </div>
        </div>
    </div>
}


function LeagueScoresWrapper({ scores }: { scores: ExamTakenType[] }) {
    return <div className="flex flex-wrap gap-2 justify-between">
        {scores.map((val, index) => <LeagueScore key={`league-score-${index}`} label={val.exam_stage} score={val.score} />)}

    </div>
}


function LeagueScore({ label, score }: { label: string, score: number }) {
    return <div className="flex justify-between gap-2 bg-[#F0F2F5] flex-1 rounded-xl last:bg-[#018ABB] last:text-white  p-2 flex-col">
        <div className="flex flex-col">
            <span><ScreeningSummaryIcon /></span>
            <span className="text-sm">{label}</span>
        </div>
        <div className="flex font-bold text-xl justify-between">
            <span>{score}%</span>
            <span><GotoSummaryIcon /></span>
        </div>
    </div>
}

