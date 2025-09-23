import ResponsiveContainer from "../ui/ResponsiveContainer"
import Table from "../ui/Table"
import { FilterIcon, SortIcon } from "./AdminIcons"

export default function QuestionsTable() {
  const columns = ['S/N', 'Question', 'Difficulty', 'Date Added', 'Action']
  return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
    <div className="flex justify-between px-3">
      <div className="flex gap-1 flex-col">
        <h2 className='font-bold'>Questions</h2>
        <p>Questions added to the platform</p>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex">
          <input type="text" placeholder='Search questions' className='border px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
        </div>
        <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
        <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
      </div>
    </div>
    <Table data={[]} columns={columns} />
  </ResponsiveContainer>
}