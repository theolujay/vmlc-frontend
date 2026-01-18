import { SessionQuestionItemType } from "@/types/Examtype"
import { formatDate, getAppropriateColor } from "@/utils/formatFileSize"
import { getOptionAsArray } from "@/utils/generalUtils"
import clsx from "clsx"
import { Dispatch, SetStateAction, useState } from "react"
import RemoveQuestionModal from "../Modals/RemoveQuestionModal"
import CustomTable from "../ui/CustomTable"
import TablePagination from "../ui/Pagination/TablePagination"
import ResponsiveContainer from "../ui/ResponsiveContainer"
import { FilterIcon, SortIcon } from "./AdminIcons"
import QuestionInformation from "../Drawer/QuestionInformation"
import MathRenderer from "@/components/Exam/MathRenderer"

export default function QuestionsTable({ questions, onPageChange, currentPage, page_count }: Readonly<{
  // questions: QuestionType[], 
  questions: SessionQuestionItemType[]
  onPageChange: Dispatch<SetStateAction<number>>, currentPage: number, page_count: number
}>) {
  const [openRemoveQuestion, setOpenRemoveQuestion] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<SessionQuestionItemType | null>(null)

  

  function handleOpenModal() {
    setOpenRemoveQuestion(true);
  }


  return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
    <div className="flex justify-between px-3">
      <div className="flex gap-1 flex-col">
        <h2 className='font-bold'>Questions</h2>
        <p>Questions added to the platform</p>
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex">
          <input type="text" placeholder='Search questions' className='border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
        </div>
        <button className='inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
        <button className='inline-flex items-center gap-2 border rounded-md px-2 h-10 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
      </div>
    </div>
    <CustomTable
      data={questions}
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
        {
          key: 'data.text', header: 'Question', render: (_, row) => {
            const options = getOptionAsArray(row)
            return <div className="flex text-start flex-col justify-start items-start gap-1 min-w-[300px]">
              <div className="font-medium text-gray-900">
                <MathRenderer content={row.text} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 w-full mt-1">
                {
                  options.map((val, index) => <div key={`option-${index + 1}`} className="option flex gap-2 items-center">
                    <input id={val.optionKey} type="radio" disabled checked={val.optionKey.endsWith(row.correct_answer.toLowerCase())} className="w-3 h-3 text-[#3E4095]" />
                    <label htmlFor={val.optionKey} className="text-xs text-gray-600">
                        <MathRenderer content={val.option} inline />
                    </label>
                  </div>
                  )
                }
              </div>
            </div>
          }
        },
        {
          key: 'difficulty', header: 'Difficulty', render: (_, row) => <div>
            <span className={clsx(getAppropriateColor(row.difficulty), 'px-3 capitalize rounded-full text-sm font-bold py-2')}>{row.difficulty}</span>
          </div>
        },
        {
          key: 'date_created', header: "Date Added", render: (_, row) => {

            return (
              <div className="flex justify-center items-center gap-1">
                <span>{formatDate(row.created_at)}</span>
              </div>
            )
          },
        },
        {
          key: 'action', header: "Action", render: (_, row) => (
            <div className="flex justify-between items-center gap-1">
              <button onClick={() => {
                setSelectedQuestionId(row.id);
                handleOpenModal()
              }} className="cursor-pointer font-semibold text-[#475467]">Remove</button>
              <button onClick={() => {
                setOpenDrawer(true)
                setCurrentQuestion(row)
              }} className="cursor-pointer font-semibold text-[#6941C6]">View</button>
            </div>
          ),
        }
      ]}
      footer={<TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />}
    />
    {currentQuestion &&
      <QuestionInformation information={currentQuestion} open={openDrawer} setOpen={setOpenDrawer} />
    }
    <RemoveQuestionModal question_id={selectedQuestionId} close={setOpenRemoveQuestion} open={openRemoveQuestion} />
  </ResponsiveContainer>
}





