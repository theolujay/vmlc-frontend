"use client"
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AddIcon } from '../../General/GettingStarted/GettingStartedAssets'
import Button from '../../ui/Button'
import ResponsiveContainer from '../../ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
// import EmptySession from './EmptySession'
import AddQuestionModal from '../../Modals/AddQuestionModal'
import QuestionsTable from '../QuestionsTable'
import SummaryCard from './SummaryCard'
import EmptySession from '../EmptySession'
// import QuestionInformation from './Drawer/QuestionInformation'

export default function QuestionPool() {
  const [questions] = useState<string[]>([])
  const [open, setOpen] = useState(false);
  // const [openDrawer, setOpenDrawer] = useState(true);
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={<Button onClick={()=>setOpen(true)} className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD QUESTION</span></Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <QuestionSummaryCard />
        {questions.length == 0 ? <EmptyState /> : <QuestionsTable />}

      </div>
      <AddQuestionModal open={open} close={setOpen} />
      {/* <QuestionInformation open={openDrawer} setOpen={setOpenDrawer} question='What is colonoscopy' difficulty='easy' /> */}
      {/* <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} /> */}
    </div>
  )
}


function QuestionSummaryCard() {
  const currentView = useSearchParams().get('view');
  return <ResponsiveContainer className='grid gap-3 grid-cols-1 md:grid-cols-4 p-4'>
    <SummaryCard isActive={currentView == 'total-question'} label='TOTAL QUESTION POOL' value={0} textColor='text-[#018ABB]' />
    <SummaryCard isActive={currentView == 'easy-question'} label='EASY QUESTION LEVEL' value={0} textColor='text-[#099137]' />
    <SummaryCard isActive={currentView == 'moderate-question'} label='MODERATE QUESTION LEVEL' value={0} textColor='text-[#AD6F07]' />
    <SummaryCard isActive={currentView == 'hard-question'} label='HARD QUESTION LEVEL' value={0} textColor='text-[#CB1A14]' />
  </ResponsiveContainer>
}






function EmptyState() {
  return <ResponsiveContainer className='gap-3'>
    <EmptySession label='No question has been created yet' desc='Question set on the platform would appear here ' />


  </ResponsiveContainer>
}



// function QuestionsTable(){
//   const columns=['S/N','Question','Difficulty','Date Added','Action']
//   return <div className="flex flex-col">

//     <Table data={[]} columns={columns}/>
//   </div>
// }

// function QuestionsTable() {
//   const columns = ['S/N', 'Question', 'Difficulty', 'Date Added', 'Action']
//   return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
//     <div className="flex justify-between px-3">
//       <div className="flex gap-1 flex-col">
//         <h2 className='font-bold'>Questions</h2>
//         <p>Questions added to the platform</p>
//       </div>
//       <div className="flex justify-between gap-2">
//         <div className="flex">
//           <input type="text" placeholder='Search questions' className='border px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
//         </div>
//         <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
//         <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
//       </div>
//     </div>
//     <Table data={[]} columns={columns} />
//   </ResponsiveContainer>
// }