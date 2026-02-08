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
import dynamic from "next/dynamic"

const AddQuestionModal = dynamic(() => import("@/components/Modals/AddQuestionModal"), {
  ssr: false,
});

export default function QuestionsTable({ 
  questions, 
  onPageChange, 
  currentPage, 
  page_count,
  filters,
  setFilters,
  status
}: Readonly<{
  questions: SessionQuestionItemType[]
  onPageChange: Dispatch<SetStateAction<number>>, 
  currentPage: number, 
  page_count: number,
  filters: Record<string, string>,
  setFilters: Dispatch<SetStateAction<Record<string, string>>>,
  status?: string
}>) {
  const [openRemoveQuestion, setOpenRemoveQuestion] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<SessionQuestionItemType | null>(null)
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<SessionQuestionItemType | null>(null);

  const isEditable = status === 'draft' || status === 'scheduled';

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
    <ResponsiveContainer className="flex gap-4 py-8 px-0 flex-col mx-auto font-sans bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-4">
        <div className="flex gap-3 items-center">
          <div className="w-1.5 h-6 bg-[#3E4095] rounded-full"></div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <i className="fas fa-list-ul text-[#3E4095] text-[10px]"></i>
              <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Session Questions</h2>
            </div>
            <p className="text-lg font-black text-gray-900 tracking-tight uppercase">Exam Content</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-xs"></i>
            <input 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text" 
              placeholder='Search questions...' 
              className='bg-gray-50/50 border border-gray-100 h-11 pl-11 pr-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-semibold w-64 shadow-inner' 
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95'>
                  <SortIcon />
                  <span>Sort</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[180px] bg-white rounded-2xl p-2 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200" sideOffset={8}>
                  <DropdownMenu.Label className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Sort Questions By</DropdownMenu.Label>
                  <DropdownMenu.Item onClick={() => handleSort('text')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Question (A-Z)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-text')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Question (Z-A)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-created_at')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Newest First</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('created_at')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Oldest First</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95'>
                  <FilterIcon />
                  <span>Filter</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[180px] bg-white rounded-2xl p-2 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200" sideOffset={8}>
                  <DropdownMenu.Label className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Sort Questions By</DropdownMenu.Label>
                  <DropdownMenu.Item onClick={() => handleSort('text')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Question (A-Z)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-text')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Question (Z-A)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-created_at')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Newest First</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('created_at')} className="px-3 py-2.5 text-[10px] font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 hover:text-[#3E4095] rounded-xl uppercase tracking-wider transition-colors">Oldest First</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className='inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-12 rounded-2xl px-5 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95'>
                  <FilterIcon />
                  <span>Filter</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[220px] bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200" sideOffset={8}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Difficulty Level</label>
                      <select 
                        value={filters.difficulty || ''} 
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black text-gray-700 outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] transition-all uppercase tracking-wider"
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
                      className="mt-2 text-[9px] text-rose-500 font-black uppercase tracking-[0.2em] hover:text-rose-600 transition-colors flex items-center gap-2 group w-fit"
                    >
                      <i className="fas fa-times-circle group-hover:rotate-90 transition-transform"></i>
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
                  <div className="flex text-start flex-col gap-4 py-3 min-w-[450px]">
                    <div className="text-sm font-bold text-gray-800 leading-relaxed bg-gray-50/50 p-4 rounded-[1.5rem] border border-gray-50">
                      <MathRenderer content={row.text} />
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-3 w-full px-2">
                      {options.map((val, index) => (
                        <div key={`option-${index + 1}`} className="flex gap-3 items-center group/opt">
                          <div className={clsx(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm",
                            val.optionKey.endsWith(row.correct_answer.toLowerCase()) 
                              ? "bg-[#3E4095] border-[#3E4095] scale-110" 
                              : "border-gray-200 group-hover/opt:border-[#3E4095]/30"
                          )}>
                            {val.optionKey.endsWith(row.correct_answer.toLowerCase()) && (
                              <i className="fas fa-check text-[9px] text-white"></i>
                            )}
                          </div>
                          <label className="text-[11px] font-semibold text-gray-600 group-hover/opt:text-gray-900 transition-colors">
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
                  <span className={clsx(getAppropriateColor(row.difficulty), 'px-4 py-1.5 uppercase rounded-full text-[9px] font-black tracking-[0.15em] bg-white border border-current/20 shadow-sm')}>
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
                  <span className="text-[11px] font-bold text-gray-400 tracking-tight">
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
                <div className="flex flex-col justify-end items-center gap-2.5 px-4">
                  <button 
                    onClick={() => {
                      setOpenDrawer(true)
                      setCurrentQuestion(row)
                    }} 
                    className="px-5 py-2.5 rounded-xl bg-[#3E4095]/5 text-[#3E4095] border border-[#3E4095]/10 font-black text-[10px] uppercase tracking-widest hover:bg-[#3E4095] hover:text-white hover:shadow-lg hover:shadow-[#3E4095]/20 transition-all cursor-pointer w-28 text-center active:scale-95"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => {
                      setQuestionToEdit(row);
                      setOpenEditQuestion(true);
                    }} 
                    className="px-5 py-2.5 rounded-xl bg-blue-50 text-[#3E4095] border border-[#3E4095]/10 font-black text-[10px] uppercase tracking-widest hover:bg-[#3E4095] hover:text-white hover:shadow-lg hover:shadow-[#3E4095]/20 transition-all cursor-pointer w-28 text-center active:scale-95"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (!isEditable) return;
                      setSelectedQuestionId(row.id);
                      handleOpenModal()
                    }} 
                    disabled={!isEditable}
                    className={clsx(
                      "px-5 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all w-28 text-center",
                      isEditable 
                        ? "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-600/20 cursor-pointer active:scale-95" 
                        : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-60"
                    )}
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
      {questionToEdit && (
        <AddQuestionModal 
          open={openEditQuestion} 
          close={setOpenEditQuestion} 
          initialData={questionToEdit} 
          isEdit={true} 
        />
      )}
    </ResponsiveContainer>
  )
}





