"use client"
import Button from '@/components/ui/Button'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Table from '@/components/ui/Table'
import ScreeningTabWrapper from '@/components/ui/Tabs/ScreeningTabWrapper'
import withAuthentication from '@/hocs/withAuthentication'
import AdminHeader from '../AdminHeader'
import { ActivitiesIcon, ScoresIcon } from '../AdminIcons'
import AdminLayout from '../AdminLayout'
import EmptySession from '../EmptySession'

  function ViewUserDetails() {
    // const params=useParams()
    // const id=params.id as string;
    // const {data}=useGetCandidateDetails(id)
    return (
        <AdminLayout>

        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport label='Exam System' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span>SEND MESSAGE</span></Button>} />
            <div className="flex flex-col gap-3 mt-3  w-[96%] mx-auto">
                <Details />
                <ViewDetailsTabSection/>
            </div>
        </div>
        </AdminLayout>
    )
}

export default withAuthentication(ViewUserDetails)



function Details() {
    return <ResponsiveContainer className='flex gap-3 flex-col p-8'>
        <div className="flex gap-2">
            <div className="bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full">
                <span className="font-bold text-lg">EO</span>
            </div>
            {/* <span>{fi}</span> */}
            <h2 className="font-bold text-5xl">Andrew Tamuno</h2>
        </div>
        <div className="flex flex-col">
            <div className="flex flex-col">
                <div className="flex-col gap-2 flex">
                    <span>USER TYPE</span>
                    <span>student</span>
                </div>


                <div className="flex-col gap-2 flex">
                    <span>INSTITUTION NAME</span>
                    <span>Kings college, Yaba</span>
                </div>
            </div>





            <div className="flex flex-col">
                <div className="flex-col gap-2 flex">
                    <span>EMAIL</span>
                    <span>student@tamuno.com</span>
                </div>
                <div className="flex-col gap-2 flex">
                    <span>DATE JOINED</span>
                    <span>06 July, 2025</span>
                </div>
            </div>
        </div>
    </ResponsiveContainer>
}



function ViewDetailsTabSection() {
    return (


        <ResponsiveContainer className="px-0">
            <ScreeningTabWrapper tabs={[
                { label: <ActivitiesLabel />, value: 'Activities', content: <ScoreComponent results={[]} /> },
                { label: <ScoresLabel />, value: 'Scores', content: <ScoreComponent results={[]} /> },
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

function ScoreComponent({ results }: Readonly<{ results: string[] }>) {
    return <div className="flex flex-col">
        {results.length > 0 ?
            <div className="flex gap-2 flex-col">

                <Table data={[]} columns={['Activity', 'Date', 'Time']} />
            </div> : <EmptySession desc="Arrangement of result based on the highest score gotten by candidates on the platform would appear here " label='Exams hasn’t happened yet' />}
    </div>
}


