import { formatDate } from "@/utils/formatFileSize"
import clsx from "clsx"
import CustomTable from "../ui/CustomTable"
import ResponsiveContainer from "../ui/ResponsiveContainer"
import { FilterIcon, SortIcon } from "./AdminIcons"
import { QuestionType } from "@/types/Examtype"
import TablePagination from "../ui/Pagination/TablePagination"
import { Dispatch, SetStateAction } from "react"

export default function QuestionsTable({ questions, onPageChange, currentPage, page_count }: Readonly<{ questions: QuestionType[], onPageChange: Dispatch<SetStateAction<number>>, currentPage: number, page_count: number }>) {

  console.log(questions, 'these are the questions')
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
            return <div className="flex flex-col justify-start items-start gap-1">
              <span>{row.text}</span>
              <div className="flex gap-3 w-full"  >
                {
                  options.map((val, index) => <div key={`option-${index + 1}`} className="option flex gap-1">
                    <input id={val.optionKey} type="radio" readOnly checked={val.optionKey.endsWith(row.correct_answer.toLowerCase())} />
                    <label htmlFor={val.optionKey}>{val.option}</label>
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
          key: 'action', header: "Action", render: () => (
            <div className="flex justify-between items-center gap-1">
              <button className="cursor-pointer font-semibold text-[#475467]">Remove</button>
              <button className="cursor-pointer font-semibold text-[#6941C6]">View</button>
            </div>
          ),
        }
      ]}
      footer={<TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />}
    />

  </ResponsiveContainer>
}


function getAppropriateColor(val: string) {
  switch (val) {
    case 'medium':
      return 'bg-[#FEF6E7] text-[#865503]';
    case 'easy':
      return 'bg-[#E7F6EC] text-[#099137]';
    case 'hard':
      return 'bg-[#FBEAE9] text-[#9E0A05]';
    default:
      return 'bg-grey text-black'
  }
}



function getOptionAsArray(data: QuestionType): Record<string, string>[] {
  let optionsArray = []
  for (const key in data) {
    if (key.startsWith('option')) {
      const value = (data as Record<string, any>)[key];
      let val: Record<string, string> = {
        option: value,
        optionKey: key
      };
      optionsArray.push(val);
    }
  }
  return optionsArray;
}