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

  return (
    <ResponsiveContainer className="flex gap-6 py-6 px-0 flex-col mx-auto font-sans bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-4">
        <div className="flex gap-1 flex-col">
          <div className="flex items-center space-x-2">
            <i className="fas fa-list-ul text-[#3E4095] text-[10px]"></i>
            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Session Questions</h2>
          </div>
          <p className="text-xl font-bold text-gray-800 tracking-tight">Exam Content</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text" 
              placeholder='Search questions...' 
              className='bg-gray-50 border border-gray-100 h-11 pl-10 pr-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] transition-all text-sm font-medium w-64' 
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm'>
                  <span><SortIcon /></span>
                  <span>Sort</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[150px] bg-white rounded-md p-1 shadow-lg border border-[#E4E7EC]" sideOffset={5}>
                  <DropdownMenu.Label className="px-2 py-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Sort By</DropdownMenu.Label>
                  <DropdownMenu.Item onClick={() => handleSort('text')} className="px-2 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded uppercase tracking-tighter">Question (A-Z)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-text')} className="px-2 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded uppercase tracking-tighter">Question (Z-A)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-created_at')} className="px-2 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded uppercase tracking-tighter">Newest First</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('created_at')} className="px-2 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded uppercase tracking-tighter">Oldest First</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm'>
                  <span><FilterIcon /></span>
                  <span>Filter</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[200px] bg-white rounded-md p-3 shadow-lg border border-[#E4E7EC]" sideOffset={5}>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Difficulty</label>
                      <select 
                        value={filters.difficulty || ''} 
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="border rounded-lg px-2 py-1.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#3E4095]/10"
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
                      className="mt-2 text-[9px] text-red-600 font-black uppercase tracking-widest hover:underline text-left"
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

      <div className="px-1 overflow-x-auto">
        <CustomTable
          data={questions}
          minWidth="1000px"
          columns={[
            {
              key: "sn", 
              header: "S/N", 
              align: 'center',
              render: (_, __, index) => (
                <div className="flex justify-center">
                  <span className="text-xs font-bold text-gray-400">{(currentPage - 1) * 10 + index + 1}</span>
                </div>
              )
            },
            {
              key: 'data.text', 
              header: 'Question', 
              render: (_, row) => {
                const options = getOptionAsArray(row)
                return (
                  <div className="flex text-start flex-col gap-3 py-2 min-w-[400px]">
                    <div className="text-sm font-bold text-gray-800 leading-relaxed">
                      <MathRenderer content={row.text} />
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 w-full">
                      {options.map((val, index) => (
                        <div key={`option-${index + 1}`} className="flex gap-2.5 items-center">
                          <div className={clsx(
                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                            val.optionKey.endsWith(row.correct_answer.toLowerCase()) 
                              ? "bg-[#3E4095] border-[#3E4095]" 
                              : "border-gray-200"
                          )}>
                            {val.optionKey.endsWith(row.correct_answer.toLowerCase()) && (
                              <i className="fas fa-check text-[8px] text-white"></i>
                            )}
                          </div>
                          <label className="text-[11px] font-medium text-gray-500">
                              <MathRenderer content={val.option} inline />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
            },
            {
              key: 'difficulty', 
              header: 'Difficulty', 
              align: 'center', 
              render: (_, row) => (
                <div className="flex justify-center">
                  <span className={clsx(getAppropriateColor(row.difficulty), 'px-3 py-1 uppercase rounded-full text-[9px] font-black tracking-widest bg-white border border-current/30')}>
                    {row.difficulty}
                  </span>
                </div>
              ),
            },
            {
              key: 'date_created', 
              header: "Date Added", 
              align: 'center', 
              render: (_, row) => (
                <div className="flex justify-center">
                  <span className="text-[11px] font-bold text-gray-400">
                    {formatDate(row.created_at)}
                  </span>
                </div>
              ),
            },
            {
              key: 'action', 
              header: "Action", 
              align: 'center', 
              render: (_, row) => (
                <div className="flex flex-col justify-end items-center gap-2 px-2">
                  <button 
                    onClick={() => {
                      setOpenDrawer(true)
                      setCurrentQuestion(row)
                    }} 
                    className="px-4 py-1.5 rounded-full bg-[#3E4095]/5 text-[#3E4095] border border-[#3E4095]/10 font-black text-[9px] uppercase tracking-widest hover:bg-[#3E4095] hover:text-white transition-all cursor-pointer w-24 text-center"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedQuestionId(row.id);
                      handleOpenModal()
                    }} 
                    className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer w-24 text-center"
                  >
                    Remove
                  </button>
                </div>
              ),
            }
          ]}
          footer={
            <div className="px-8 border-t border-gray-50 py-3">
              <TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />
            </div>
          }
        />
      </div>
      {currentQuestion &&
        <QuestionInformation information={currentQuestion} open={openDrawer} setOpen={setOpenDrawer} />
      }
      <RemoveQuestionModal question_id={selectedQuestionId} close={setOpenRemoveQuestion} open={openRemoveQuestion} />
    </ResponsiveContainer>
  )
}





