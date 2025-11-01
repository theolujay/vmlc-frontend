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
                <Checkbox
                  checked={allSelected}
                  onChange={(checked) => onSelectAll?.(checked)}
                />
              </th>
              {columns.map((col, i) => (
                <th key={i} className="py-3 text-left px-3">
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
                  <td className="py-2 px-3 text-center">
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={(checked) => onSelectRow?.(row.id, checked)}
                    />
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
}: Readonly<{
  questions: SessionQuestionItemType[];
  onPageChange: Dispatch<SetStateAction<number>>;
  currentPage: number;
  page_count: number;
}>) {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [openRemoveQuestion, setOpenRemoveQuestion] = useState(false);
  const [openExamSession,setOpenExamSession]=useState(false)
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


  console.log(selectedQuestions,'what do we have here')
 

  function handleOpenExamSessionModal() {
    setOpenExamSession(true);
  }

  return (
    <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col mx-auto">
      <div className="flex  justify-between px-3">
        <div className="flex gap-1 flex-col">
          <h2 className="font-bold">Questions</h2>
          <p>Questions added to the platform</p>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex">
            <input
              type="text"
              placeholder="Search questions"
              className="border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none"
            />
          </div>
          <button className="inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer">
            <SortIcon />
            <span className="text-[#344054]">Sort</span>
          </button>
          <button className="inline-flex items-center gap-2 border rounded-md px-2 h-10 py-1 border-[#E4E7EC] cursor-pointer">
            <FilterIcon />
            <span className="text-[#344054]">Filter</span>
          </button>
        </div>
      </div>
      <div className="flex px-3 bg-[#F7F9FC] items-center py-2 -mb-3 justify-between">
        <span className="text-lg font-bold">{selectedQuestions.length} Questions selected</span>
        <div className="flex gap-2">
             <button className="rounded-xl py-2 font-semibold bg-[#FBEAE9] cursor-pointer text-[#CB1A14] px-3">Delete Question</button>
            <button onClick={handleOpenExamSessionModal} className="rounded-xl py-2 font-semibold bg-[#3E4095] cursor-pointer text-white px-3">Add to exam session</button>
        </div>
      </div>

      <CustomTable
        data={questions}
        columns={[
          {
            key: "user",
            header: "S/N",
            render: (_, __, index) => <span>{index + 1}</span>,
          },
          {
            key: "data.text",
            header: "Question",
            render: (_, row) => {
              const options = getOptionAsArray(row);
              return (
                <div className="flex text-start flex-col gap-1">
                  <span>{row.text}</span>
                  <div className="flex gap-3 w-full">
                    {options.map((val, index) => (
                      <div key={index} className="option flex gap-1">
                        <input
                          id={val.optionKey}
                          type="radio"
                          readOnly
                          checked={val.optionKey.endsWith(row.correct_answer.toLowerCase())}
                        />
                        <label htmlFor={val.optionKey}>{val.option}</label>
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
            render: (_, row) => (
              <span
                className={clsx(
                  getAppropriateColor(row.difficulty),
                  "px-3 capitalize rounded-full text-sm font-bold py-2"
                )}
              >
                {row.difficulty}
              </span>
            ),
          },
          {
            key: "date_created",
            header: "Date Added",
            render: (_, row) => <span>{formatDate(row.created_at)}</span>,
          },
          {
            key: "action",
            header: "Action",
            render: (_, row) => (
              <div className="flex justify-between items-center gap-1">
             
                <QuestionPoolDropdown exam_id={row.id} />
               
              </div>
            ),
          },
        ]}
        footer={
          <TablePagination
            currentPage={currentPage}
            pageCount={page_count}
            onPageChange={onPageChange}
          />
        }
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        selectedIds={selectedQuestions}
      />

      {currentQuestion && (
        <QuestionInformation
          information={currentQuestion}
          open={openDrawer}
          setOpen={setOpenDrawer}
        />
      )}
      <AddToExamSessionModal selectedQuestionIds={selectedQuestions} open={openExamSession} close={setOpenExamSession} />
      <RemoveQuestionModal
        question_id={selectedQuestionId}
        close={setOpenRemoveQuestion}
        open={openRemoveQuestion}
      />
    </ResponsiveContainer>
  );
}
