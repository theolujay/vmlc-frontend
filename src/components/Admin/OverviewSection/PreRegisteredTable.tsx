
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
    <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col mx-auto">
      <div className="flex justify-between px-3">
        <div className="flex gap-1 flex-col">
          <h2 className="font-bold text-lg sm:text-xl">Pre-registered Candidates</h2>
          <p className="text-sm text-gray-600">List of users interested in becoming candidates</p>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex ">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by candidate name or email"
              className="border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none"
            />
          </div>
          <button className="inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer ">
            <span>
              <SortIcon />
            </span>
            <span className="text-[#344054]">Sort</span>
          </button>
          <button className="inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer ">
            <span>
              <FilterIcon />
            </span>
            <span className="text-[#344054]">Filter</span>
          </button>
        </div>
      </div>

      <CustomTable
        columns={[
          {
            key: "fullName",
            header: "Full Name",
            render: (_, row) => (
              <div className="flex items-center gap-1">{row.full_name}</div>
            ),
          },
          {
            key: "email",
            header: "Email Address",
            render: (_, row) => (
              <div className="flex items-center gap-1">{row.email}</div>
            ),
          },
          {
            key: "phone",
            header: "Phone",
            render: (_, row) => (
              <div className="flex capitalize items-center gap-1">
                {row.phone}
              </div>
            ),
          },
          {
            key: "date",
            header: "Date",
            render: (_, row) => (
              <div className="flex items-center gap-1"> 
                {formatDate(new Date(row.created_at))}
              </div>
            ),
          },
        ]}
        data={candidates}
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
