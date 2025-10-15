import { formatDate } from "@/utils/formatFileSize"
import CustomTable from "../ui/CustomTable"
import ResponsiveContainer from "../ui/ResponsiveContainer"
import { FilterIcon, SortIcon } from "./AdminIcons"
import TablePagination from "../ui/Pagination/TablePagination"

export default function QuestionsTable({ questions }: { questions: any[] }) {
  // const columns = ['S/N', 'Question', 'Difficulty', 'Date Added', 'Action']
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
    <CustomTable data={questions} columns={[
      {
        key: "user", header: "S/N", render: (val, row, index) => {
          console.log(val, row, 'is this the value here')
          return (
            <div className="flex justify-center items-center gap-1">
              <span>{index + 1}</span>

            </div>
          )
        },
      },
      {
        key: 'data.text', header: 'Question', render: (_, row) => <div className="flex flex-col justify-start items-start gap-1">
          <span>{row.text}</span>
          <form className="flex gap-3 w-full"  >
            <div className="option flex gap-1">
              <input id="opt-a" type="radio"  />
              <label htmlFor="opt-a">{row.option_a}</label>
            </div>
            <div className="option flex gap-1">
              <input id="opt-b" type="radio" />
              <label htmlFor="opt-b">{row.option_b}</label>
            </div>
            <div className="option flex gap-1">
              <input id="opt-c" type="radio"  />
              <label htmlFor="opt-c">{row.option_c}</label>
            </div>

            <div className="option flex gap-1">
              <input id="opt-c" type="radio"  />
              <label htmlFor="opt-d">{row.option_d}</label>
            </div>
          </form>

        </div>
      },
      { key: 'difficulty', header: 'Difficulty' },
      {
        key: 'date_created', header: "Date Added", render: (val, row, index) => {
          console.log(val, row, 'is this the value here')
          return (
            <div className="flex justify-center items-center gap-1">
              <span>{formatDate(row.date_created)}</span>

            </div>
          )
        },
      },
      { key: 'action', header: "Action",render: (val, row, index) => {
          console.log(val, row, 'is this the value here')
          return (
            <div className="flex justify-between items-center gap-1">
             <button className="cursor-pointer font-semibold text-[#475467]">Remove</button>
             <button className="cursor-pointer font-semibold text-[#6941C6]">View</button>

            </div>
          )
        }, }
    ]} 
    // footer={<TablePagination />} 
    />
    
  </ResponsiveContainer>
}