import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FilterIcon, SortIcon } from "../AdminIcons";
import clsx from "clsx";

interface CompetitionControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortKey: string;
  sortDirection: "asc" | "desc";
  onSort: (key: any) => void;
  sortOptions: { label: string; key: string }[];
  filterState: {
    state: string;
    schoolType: string;
    currentClass: string;
  };
  onFilterChange: (filters: { state?: string; schoolType?: string; currentClass?: string }) => void;
  filterOptions: {
    states: string[];
    schoolTypes: string[];
    currentClasses: string[];
  };
  onResetFilters: () => void;
  isPublicView?: boolean;
}

export const CompetitionControls: React.FC<CompetitionControlsProps> = ({
  searchTerm,
  onSearchChange,
  sortKey,
  sortDirection,
  onSort,
  sortOptions,
  filterState,
  onFilterChange,
  filterOptions,
  onResetFilters,
  isPublicView = false,
}) => {
  const activeFiltersCount = Object.values(filterState).filter(
    (val) => val !== "All States" && val !== "All Types" && val !== "All Classes",
  ).length;

  return (
    <div className="flex flex-row items-center justify-between p-2 sm:p-4 bg-white border border-gray-100 rounded-2xl shadow-sm gap-2 sm:gap-4">
      {/* Search Input */}
      <div className="relative group flex-1">
        <i className="fas fa-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-[10px] sm:text-xs"></i>
        <input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search..."
          className="bg-gray-50/50 border border-gray-100 h-9 sm:h-11 pl-8 sm:pl-11 pr-2 sm:pr-4 py-2 rounded-lg sm:rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-xs sm:text-sm font-semibold w-full shadow-inner"
        />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Sort Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-white border border-gray-100 h-9 sm:h-11 rounded-lg sm:rounded-xl px-2 sm:px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[9px] sm:text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer">
              <SortIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sort</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-40 bg-white rounded-2xl p-2 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200"
              align="end"
              sideOffset={8}
            >
              <DropdownMenu.Label className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Sort By
              </DropdownMenu.Label>
              {sortOptions.map((option) => (
                <DropdownMenu.Item
                  key={option.key}
                  onClick={() => onSort(option.key)}
                  className={clsx(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors",
                    sortKey === option.key ? "bg-blue-50 text-[#3E4095]" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {option.label}
                  {sortKey === option.key && (
                    <span className="text-[10px]">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Filter Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={clsx(
                "inline-flex items-center justify-center gap-1 sm:gap-2 h-9 sm:h-11 rounded-lg sm:rounded-xl px-2 sm:px-4 transition-all font-bold text-[9px] sm:text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer border",
                activeFiltersCount > 0
                  ? "bg-[#3E4095]/5 border-[#3E4095]/40 text-[#3E4095]"
                  : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
              )}
            >
              <FilterIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFiltersCount > 0 && <span className="ml-0.5 sm:ml-1">({activeFiltersCount})</span>}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-48 sm:min-w-55 bg-white rounded-2xl p-3 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200"
              align="end"
              sideOffset={8}
            >
              <div className="flex flex-col gap-4">
              {!isPublicView && (
                <div className="flex flex-col gap-1.5">
                  <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    State
                  </label>
                  <select
                    value={filterState.state}
                    onChange={(e) => onFilterChange({ state: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    {filterOptions.states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  School Type
                </label>
                  <select
                    value={filterState.schoolType}
                    onChange={(e) => onFilterChange({ schoolType: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    {filterOptions.schoolTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {!isPublicView && (
                  <div className="flex flex-col gap-1.5">
                    <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Class
                    </label>
                    <select
                      value={filterState.currentClass}
                      onChange={(e) => onFilterChange({ currentClass: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                      {filterOptions.currentClasses.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={onResetFilters}
                  className="w-full mt-1 py-2 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
