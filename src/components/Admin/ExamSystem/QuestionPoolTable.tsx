"use client";
import { useState, Dispatch, SetStateAction } from "react";
import QuestionInformation from "@/components/Drawer/QuestionInformation";
import RemoveQuestionModal from "@/components/Modals/RemoveQuestionModal";
import TablePagination from "@/components/ui/Pagination/TablePagination";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer";
import { SessionQuestionItemType } from "@/types/Examtype";
import { formatDate, getAppropriateColor } from "@/utils/formatFileSize";
import { getOptionAsArray } from "@/utils/generalUtils";
import clsx from "clsx";
import { FilterIcon, SortIcon } from "../AdminIcons";
import { Checkbox } from "@/components/ui/Checkbox";
import QuestionPoolDropdown from "./QuestionPoolDropdown";
import AddToExamSessionModal from "@/components/Modals/AddToExamSessionModal";
import BulkRemoveQuestionsModal from "@/components/Modals/BulkRemoveQuestionsModal";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import MathRenderer from "@/components/Exam/MathRenderer";

type ColumnType<T> = {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
};

type CustomTableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  emptyLabel?: string;
  emptyDesc?: React.ReactNode;
  footer?: React.ReactNode;
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: number, checked: boolean) => void;
  selectedIds?: number[];
};

function CustomTable<T extends { id: number }>({
  columns,
  data,
  emptyLabel = "No records found",
  emptyDesc = "There are currently no entries to display.",
  footer,
  onSelectAll,
  onSelectRow,
  selectedIds = [],
}: Readonly<CustomTableProps<T>>) {
  const allSelected = data.length > 0 && data.every((row) => selectedIds.includes(row.id));

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#E4E7EC]">
              <th className="py-2 px-3 text-center">
                <div className="flex justify-center">
                  <Checkbox
                    checked={allSelected}
                    onChange={(checked) => onSelectAll?.(checked)}
                  />
                </div>
              </th>
              {columns.map((col, i) => (
                <th key={i} className={clsx("py-3 px-3 text-[9px] font-black uppercase tracking-widest text-gray-500", (col as any).align === 'center' ? 'text-center' : 'text-left')}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-6 text-center">
                  <EmptyRecords label={emptyLabel} desc={emptyDesc} />
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E4E7EC] last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onChange={(checked) => onSelectRow?.(row.id, checked)}
                      />
                    </div>
                  </td>

                  {columns.map((col, ci) => {
                    const value =
                      typeof col.key === "string" && col.key.includes(".")
                        ? col.key
                          .split(".")
                          .reduce(
                            (acc, k) => (acc && acc[k as keyof typeof acc]) || "",
                            row as any
                          )
                        : (row as any)[col.key as keyof T];

                    return (
                      <td key={ci} className="py-2 px-3 text-center">
                        {col.render ? col.render(value, row, index) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {footer && <div className="py-3">{footer}</div>}
      </div>
    </div>
  );
}

function EmptyRecords({
  label,
  desc,
}: Readonly<{ label: string; desc: React.ReactNode }>) {
  return (
    <div className="w-full grid place-content-center py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold">{label}</h2>
        <p className="text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

export default function QuestionPoolTable({
  questions,
  onPageChange,
  currentPage,
  page_count,
  handleSearch
}: Readonly<{
  questions: SessionQuestionItemType[];
  onPageChange: Dispatch<SetStateAction<number>>;
  currentPage: number;
  page_count: number;
  handleSearch: Dispatch<SetStateAction<{}>>
}>) {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [openRemoveQuestion, setOpenRemoveQuestion] = useState(false);
  const [openExamSession, setOpenExamSession] = useState(false)
  const [openBulkDelete, setOpenBulkDelete] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<SessionQuestionItemType | null>(null);

  // handle single selection
  function handleSelectRow(id: number, checked: boolean) {
    setSelectedQuestions((prev) =>
      checked ? [...prev, id] : prev.filter((q) => q !== id)
    );
  }

  // handle select all (only current page)
  function handleSelectAll(checked: boolean) {
    const currentPageIds = questions.map((q) => q.id);
    setSelectedQuestions((prev) =>
      checked
        ? [...new Set([...prev, ...currentPageIds])]
        : prev.filter((id) => !currentPageIds.includes(id))
    );
  }





  function handleOpenExamSessionModal() {
    setOpenExamSession(true);
  }
  function handleOpenDeleteModal() {
    setOpenBulkDelete(true);
  }


  const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);

  console.log(searchInput, 'search input from question table')


  return (
    <ResponsiveContainer className="flex gap-6 py-6 px-0 flex-col mx-auto font-sans bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-4">
        <div className="flex gap-1 flex-col">
          <div className="flex items-center space-x-2">
            <i className="fas fa-database text-[#3E4095] text-[10px]"></i>
            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pool</h2>
          </div>
          <p className="text-xl font-bold text-gray-800 tracking-tight">Manage Questions</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search questions..."
              className="bg-gray-50 border border-gray-100 h-11 pl-10 pr-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] transition-all text-sm font-medium w-64"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm">
            <SortIcon />
            <span>Sort</span>
          </button>
          <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm">
            <FilterIcon />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {selectedQuestions.length > 0 && (
        <div className="mx-8 px-6 bg-[#3E4095] items-center py-4 rounded-2xl flex justify-between shadow-lg shadow-[#3E4095]/20 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <i className="fas fa-check-double text-xs"></i>
            </div>
            <span className="text-sm font-black text-white uppercase tracking-widest">
              {selectedQuestions.length} Question{selectedQuestions.length > 1 && 's'} selected
            </span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleOpenDeleteModal} 
              className="rounded-xl py-2.5 px-5 font-black text-[10px] uppercase tracking-widest bg-red-500/60 text-white hover:bg-red-500/30 transition-all border border-red-500/20"
            >
              Delete
            </button>
            <button 
              onClick={handleOpenExamSessionModal} 
              className="rounded-xl py-2.5 px-5 font-black text-[10px] uppercase tracking-widest bg-white text-[#3E4095] hover:bg-gray-50 transition-all shadow-sm"
            >
              Add to session
            </button>
          </div>
        </div>
      )}

      <div className="px-1">
        <CustomTable
          data={questions}
          columns={[
            {
              key: "user",
              header: "S/N",
              align: 'center',
              render: (_, __, index) => <div className="flex justify-center"><span className="text-xs font-bold text-gray-400">{(currentPage - 1) * 10 + index + 1}</span></div>,
            },
            {
              key: "data.text",
              header: "Question",
              render: (_, row) => {
                const options = getOptionAsArray(row);
                return (
                  <div className="flex text-start flex-col gap-3 py-2 min-w-[400px]">
                    <div className="text-sm font-bold text-gray-800 leading-relaxed">
                      <MathRenderer content={row.text} />
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 w-full">
                      {options.map((val, index) => (
                        <div key={index} className="flex gap-2.5 items-center">
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
                );
              },
            },
            {
              key: "difficulty",
              header: "Difficulty",
              align: 'center',
              render: (_, row) => (
                <div className="flex justify-center">
                  <span
                    className={clsx(
                      getAppropriateColor(row.difficulty),
                      "px-3 py-1 uppercase rounded-full text-[9px] font-black tracking-widest bg-white border border-current/30"
                    )}
                  >
                    {row.difficulty}
                  </span>
                </div>
              ),
            },
            {
              key: "date_created",
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
              key: "action",
              header: "Action",
              align: 'center',
              render: (_, row) => (
                <div className="flex justify-center items-center">
                  <QuestionPoolDropdown information={row} question_id={row.id} />
                </div>
              ),
            },
          ]}
          footer={
            <div className="px-8 border-t border-gray-50">
              <TablePagination
                currentPage={currentPage}
                pageCount={page_count}
                onPageChange={onPageChange}
              />
            </div>
          }
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          selectedIds={selectedQuestions}
        />
      </div>

      {currentQuestion && (
        <QuestionInformation
          information={currentQuestion}
          open={openDrawer}
          setOpen={setOpenDrawer}
        />
      )}
      <BulkRemoveQuestionsModal questions={selectedQuestions} open={openBulkDelete} close={setOpenBulkDelete} />
      <AddToExamSessionModal selectedQuestionIds={selectedQuestions} open={openExamSession} close={setOpenExamSession} />
      <RemoveQuestionModal
        question_id={selectedQuestionId}
        close={setOpenRemoveQuestion}
        open={openRemoveQuestion}
      />
    </ResponsiveContainer>
  );
}
