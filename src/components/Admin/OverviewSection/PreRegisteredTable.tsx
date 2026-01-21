
"use client";
import CustomTable from "@/components/ui/CustomTable";
import TablePagination from "@/components/ui/Pagination/TablePagination";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer";
import { PreRegisteredCandidate } from "@/types/UserMgtType";
import { formatDate } from "@/utils/formatFileSize";
import { Dispatch, SetStateAction } from "react";
import { SortIcon, FilterIcon } from "../AdminIcons";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

function PreRegisteredCandidatesTable({
  candidates,
  handleSearch,
  onPageChange,
  currentPage,
  page_count,
}: {
  candidates: PreRegisteredCandidate[];
  handleSearch: Dispatch<SetStateAction<Record<string, string>>>;
  onPageChange: Dispatch<SetStateAction<number>>;
  currentPage: number;
  page_count: number;
}) {
  const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);

  return (
    <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 px-1 sm:px-3">
        <div className="flex gap-1 flex-col">
          <h2 className="font-bold text-lg sm:text-xl">Pre-registered Candidates</h2>
          <p className="text-sm text-gray-600">List of users interested in becoming candidates</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex w-full sm:w-auto">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search"
              className="border h-10 px-3 py-1 rounded-md border-[#E4E7EC] outline-none w-full sm:w-auto text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none">
              <span>
                <SortIcon />
              </span>
              <span className="text-[#344054] text-sm">Sort</span>
            </button>
            <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none">
              <span>
                <FilterIcon />
              </span>
              <span className="text-[#344054] text-sm">Filter</span>
            </button>
          </div>
        </div>
      </div>

      <CustomTable
        columns={[
          {
            key: "fullName",
            header: "Full Name",
            render: (_, row) => (
              <div className="font-medium text-gray-900">{row.full_name}</div>
            ),
          },
          {
            key: "email",
            header: "Email Address",
            render: (_, row) => (
              <div>{row.email}</div>
            ),
          },
          {
            key: "phone",
            header: "Phone",
            render: (_, row) => (
              <div>{row.phone}</div>
            ),
          },
          {
            key: "date",
            header: "Date",
            render: (_, row) => (
              <div> 
                {formatDate(new Date(row.created_at))}
              </div>
            ),
          },
        ]}
        data={candidates}
        minWidth="1000px"
        footer={
          <TablePagination
            currentPage={currentPage}
            pageCount={page_count}
            onPageChange={onPageChange}
          />
        }
      />
    </ResponsiveContainer>
  );
}

export default PreRegisteredCandidatesTable;
