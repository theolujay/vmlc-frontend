"use client";
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
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export default function QuestionsTable({ 
  questions, 
  onPageChange, 
  currentPage, 
  page_count,
  filters,
  setFilters 
}: Readonly<{
  questions: SessionQuestionItemType[]
  onPageChange: Dispatch<SetStateAction<number>>, 
  currentPage: number, 
  page_count: number,
  filters: Record<string, string>,
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
}>) {
  const [openRemoveQuestion, setOpenRemoveQuestion] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<SessionQuestionItemType | null>(null)

  const { searchInput, setSearchInput } = useDebouncedSearch(setFilters);

  function handleOpenModal() {
    setOpenRemoveQuestion(true);
  }

  const handleSort = (sortKey: string) => {
    setFilters(prev => ({ ...prev, ordering: sortKey }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onPageChange(1);
  };

  return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col w-full mt-6 mx-auto'>
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 px-3">
      <div className="flex gap-1 flex-col">
        <h2 className='font-bold text-lg sm:text-xl'>Questions</h2>
        <p className="text-sm text-gray-600">Questions added to the platform</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="flex w-full sm:w-auto">
          <input 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text" 
            placeholder='Search questions' 
            className='border h-10 px-3 py-1 rounded-md border-[#E4E7EC] outline-none w-full sm:w-auto text-sm' 
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className='inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none'>
                <span><SortIcon /></span>
                <span className='text-[#344054] text-sm'>Sort</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 min-w-[150px] bg-white rounded-md p-1 shadow-lg border border-[#E4E7EC]" sideOffset={5}>
                <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Sort By</DropdownMenu.Label>
                <DropdownMenu.Item onClick={() => handleSort('text')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Question (A-Z)</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleSort('-text')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Question (Z-A)</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleSort('-created_at')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Newest First</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleSort('created_at')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Oldest First</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className='inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none'>
                <span><FilterIcon /></span>
                <span className='text-[#344054] text-sm'>Filter</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 min-w-[200px] bg-white rounded-md p-3 shadow-lg border border-[#E4E7EC]" sideOffset={5}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Difficulty</label>
                    <select 
                      value={filters.difficulty || ''} 
                      onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                      className="border rounded px-2 py-1.5 text-sm outline-none"
                    >
                      <option value="">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setFilters({});
                      onPageChange(1);
                    }}
                    className="mt-2 text-xs text-red-600 font-semibold hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
    <CustomTable
      data={questions}
      minWidth="1000px"
      columns={[
        {
          key: "sn", header: "S/N", render: (_, __, index) => {
            return (
              <div className="flex items-center justify-center">
                <span>{(currentPage - 1) * 10 + index + 1}</span>
              </div>
            )
          },
        },
        {
          key: 'data.text', header: 'Question', render: (_, row) => {
            const options = getOptionAsArray(row)
            return <div className="flex text-start flex-col justify-start items-start gap-1 min-w-[400px]">
              <div className="font-medium text-gray-900 mb-1">
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
            <span className={clsx(getAppropriateColor(row.difficulty), 'px-3 capitalize rounded-full text-xs font-bold py-1')}>
              {row.difficulty}
            </span>
          </div>
        },
        {
          key: 'date_created', header: "Date Added", render: (_, row) => {
            return (
              <div className="text-sm">
                {formatDate(row.created_at)}
              </div>
            )
          },
        },
        {
          key: 'action', header: "Action", align: 'right', render: (_, row) => (
            <div className="flex justify-end items-center gap-3 px-2">
              <button 
                onClick={() => {
                  setOpenDrawer(true)
                  setCurrentQuestion(row)
                }} 
                className="text-[#3E4095] font-bold hover:underline text-sm cursor-pointer"
              >
                View
              </button>
              <button 
                onClick={() => {
                  setSelectedQuestionId(row.id);
                  handleOpenModal()
                }} 
                className="text-red-600 font-bold hover:underline text-sm cursor-pointer"
              >
                Remove
              </button>
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





