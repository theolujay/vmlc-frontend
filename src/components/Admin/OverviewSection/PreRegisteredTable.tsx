
"use client";
import CustomTable from "@/components/ui/CustomTable";
import TablePagination from "@/components/ui/Pagination/TablePagination";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer";
import { PreRegisteredCandidate } from "@/types/UserMgtType";
import { formatDate } from "@/utils/formatFileSize";
import { Dispatch, SetStateAction } from "react";
import { SortIcon, FilterIcon } from "../AdminIcons";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';

function PreRegisteredCandidatesTable({
  candidates,
  handleSearch,
  onPageChange,
  currentPage,
  page_count,
  setFilters,
  showPreRegistered,
  setShowPreRegistered,
}: {
  candidates: PreRegisteredCandidate[];
  handleSearch: Dispatch<SetStateAction<Record<string, string>>>;
  onPageChange: Dispatch<SetStateAction<number>>;
  currentPage: number;
  page_count: number;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  showPreRegistered: boolean;
  setShowPreRegistered: Dispatch<SetStateAction<boolean>>;
}) {
  const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);

  const handleSort = (sortKey: string) => {
    setFilters(prev => ({ ...prev, ordering: sortKey }));
  };

  return (
    <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col w-full mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 px-1 sm:px-3">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-lg sm:text-xl">Pre-registered Candidates</h2>
            {/* <p className="text-sm text-gray-600">List of users interested in becoming candidates</p> */}
          </div>
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none">
                  <span>
                    <SortIcon />
                  </span>
                  <span className="text-[#344054] text-sm">Sort</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[150px] bg-white rounded-md p-1 shadow-lg border border-[#E4E7EC]" sideOffset={5}>
                  <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Sort By</DropdownMenu.Label>
                  <DropdownMenu.Item onClick={() => handleSort('full_name')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Full Name (A-Z)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-full_name')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Full Name (Z-A)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-created_at')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Newest First</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('created_at')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Oldest First</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none">
                  <span>
                    <FilterIcon />
                  </span>
                  <span className="text-[#344054] text-sm">Filter</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[200px] bg-white rounded-md p-3 shadow-lg border border-[#E4E7EC]" sideOffset={5}>
                  <p className="text-sm text-gray-500">No additional filters for pre-registered candidates.</p>
                  <button 
                    onClick={() => {
                      setFilters({ profile: 'pre_reg_candidate' });
                      onPageChange(1);
                    }}
                    className="mt-2 text-xs text-red-600 font-semibold hover:underline"
                  >
                    Clear Filters
                  </button>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <div className="flex bg-[#F2F4F7] p-1 rounded-lg ml-4">
              <button 
                  onClick={() => {
                    setShowPreRegistered(false);
                    setFilters({ profile: 'candidate' });
                    onPageChange(1);
                  }}
                  className={clsx("px-4 py-1.5 text-xs font-medium rounded-md transition-all", 
                      !showPreRegistered ? "bg-white shadow-sm text-[#344054]" : "text-[#667085] hover:text-[#344054]")}
              >
                  Registered
              </button>
              <button 
                  onClick={() => {
                    setShowPreRegistered(true);
                    setFilters({ profile: 'pre_reg_candidate' });
                    onPageChange(1);
                  }}
                  className={clsx("px-4 py-1.5 text-xs font-medium rounded-md transition-all", 
                      showPreRegistered ? "bg-white shadow-sm text-[#344054]" : "text-[#667085] hover:text-[#344054]")}
              >
                  Pre-registered
              </button>
            </div>
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
