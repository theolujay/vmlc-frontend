import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
import { CandidateIcon, SortIcon } from '../AdminIcons'
import { CandidateNameIcon, EndTimeIcon, PositionIcon, StartTimeIcon } from './LeaderBoardIcon'

export default function ViewCandidateDetails({ candidate_id, level, stage }: { candidate_id: string, level: string, stage: string }) {
    // const {data}=useGetLeaderBoardCandidateDetail(stage,level,candidate_id);
    // console.log(data,'what is in data')
    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport={false} label='Leaderboards' actionButton={<button className="inline-flex gap-2 border px-2   cursor-pointer py-2 font-bold uppercase rounded-[8px] transition-colors duration-200 items-center text-sm"><span><CandidateIcon /></span><span>View Candidate Profile</span></button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                <CandidateInfoCard />
                <QuestionsTable />
            </div>
        </div>
    )
}



function CandidateInfoCard() {

    return <ResponsiveContainer className='flex gap-2 flex-col'>
        <h2 className='font-semibold text-lg'>Candidate Info</h2>
        <div className="flex justify-between">
            <div className="flex gap-2">
                <span><CandidateNameIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>NAME OF CANDIDATE</span>
                    <p>Simon Kawu</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span><PositionIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>POSITION</span>
                    <p>4TH</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span><StartTimeIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>START TIME</span>
                    <p>09:00:08 AM</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span><EndTimeIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>EXAM END TIME</span>
                    <p>09:00:08 AM</p>
                </div>
            </div>
        </div>
    </ResponsiveContainer>
}




function QuestionsTable() {
   

    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Questions</h2>
                <p>All questions added to this session</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <div className="flex">
                    <input type="text" placeholder='Search questions' className='border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
                </div>
                <button className='inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
                {/* <button className='inline-flex items-center gap-2 border rounded-md px-2 h-10 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button> */}
            </div>
        </div>
        <CustomTable
            data={[]}
            columns={[
                {
                    key: "user", header: "S/N", render: (_, __, index) => {
                        return (
                            <div className="flex justify-center items-center gap-1">
                                <span>{index + 1}</span>
                            </div>
                        )
                    },
                },
                // {
                //   key: 'data.text', header: 'Question', render: (_, row) => {
                //     const options = getOptionAsArray(row)
                //     return <div className="flex text-start flex-col justify-start items-start gap-1">
                //       <span>{row.text}</span>
                //       <div className="flex gap-3 w-full"  >
                //         {
                //           options.map((val, index) => <div key={`option-${index + 1}`} className="option flex gap-1">
                //             <input id={val.optionKey} type="radio" readOnly checked={val.optionKey.endsWith(row.correct_answer.toLowerCase())} />
                //             <label htmlFor={val.optionKey}>{val.option}</label>
                //           </div>
                //           )
                //         }
                //       </div>
                //     </div>
                //   }
                // },
                // {
                //   key: 'difficulty', header: 'Difficulty', render: (_, row) => <div>
                //     <span className={clsx(getAppropriateColor(row.difficulty), 'px-3 capitalize rounded-full text-sm font-bold py-2')}>{row.difficulty}</span>
                //   </div>
                // },
                // {
                //   key: 'date_created', header: "Date Added", render: (_, row) => {

                //     return (
                //       <div className="flex justify-center items-center gap-1">
                //         <span>{formatDate(row.created_at)}</span>
                //       </div>
                //     )
                //   },
                // },
                // {
                //   key: 'action', header: "Action", render: (_, row) => (
                //     <div className="flex justify-between items-center gap-1">
                //       <button onClick={() => {
                //         setSelectedQuestionId(row.id);
                //         handleOpenModal()
                //       }} className="cursor-pointer font-semibold text-[#475467]">Remove</button>
                //       <button onClick={() => {
                //         setOpenDrawer(true)
                //         setCurrentQuestion(row)
                //       }} className="cursor-pointer font-semibold text-[#6941C6]">View</button>
                //     </div>
                //   ),
                // }
            ]}
        //   footer={<TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />}
        />

    </ResponsiveContainer>
}