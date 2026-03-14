"use client";
import useListHelpdeskThreads from "@/hooks/useListHelpdeskThreads";
import { HelpdeskThreadType } from "@/types/HelpdeskType";
import { formatDateTime } from "@/utils/formatFileSize";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ResponsiveContainer from "../../ui/ResponsiveContainer";
import AdminHeader from "../AdminHeader";
import { FilterIcon, SortIcon } from "../AdminIcons";
import HelpdeskThreadDetails from "./HelpdeskThreadDetails";
// import clsx from 'clsx';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Spinner from "@/components/ui/spinner/spinner";
import CustomTable from "@/components/ui/CustomTable";
import React from "react";
import { HelpdeskStatData } from "@/types/UserMgtType";
import { useHelpdeskAction } from "@/hooks/useHelpdeskAction";
import SnoozeModal from "@/components/Modals/SnoozeModal";

export default function HelpdeskSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = searchParams.get("view");
  const threadId = searchParams.get("id");

  const getFiltersFromParams = (): Record<string, string> => {
    const filters: Record<string, string> = {};
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort");
    const unread = searchParams.get("unread");
    const priority = searchParams.get("priority");

    if (search) filters.search = search;
    if (status) filters.status = status;
    if (sort) filters.sort = sort;
    if (unread) filters.unread = unread;
    if (priority) filters.priority = priority;

    if (Object.keys(filters).length === 0) {
      filters.status = "default";
    }
    return filters;
  };

  const filters = getFiltersFromParams();

  const updateFilterInUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { results, summary, loading, refetch } =
    useListHelpdeskThreads(filters);

  return (
    <div className="flex flex-col gap-1 font-sans h-full">
      <AdminHeader label="Helpdesk Thread" actionButton={undefined} />
      <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto flex-1 pb-10">
        {view !== "conversation-details" && summary && (
          <HelpdeskStats stats={summary} />
        )}

        {view === "conversation-details" && threadId ? ( // Conditionally render if threadId exists
          <HelpdeskThreadDetails id={threadId} />
        ) : loading && results.length === 0 ? (
          <div className="grid w-full h-[40vh] place-content-center bg-white rounded-4xl border border-gray-100 shadow-sm">
            <Spinner />
          </div>
        ) : (
          <HelpdeskThreadListCard
            data={results}
            filters={filters}
            updateFilter={updateFilterInUrl}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
}

function HelpdeskStats({ stats }: { stats: HelpdeskStatData }) {
  return (
    <ResponsiveContainer className="flex gap-4 py-8 px-8 flex-col w-full font-sans bg-white border border-gray-100 rounded-4xl shadow-sm overflow-hidden mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-6 bg-[#3E4095] rounded-full"></div>
        <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">
          Overview
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col gap-3 p-4 bg-red-50/5 rounded-2xl border border-[#3E4095]/30 shadow-sm shadow-red-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fas fa-envelope-open-text text-3xl text-[#3E4095]"></i>
          </div>
          <span className="text-[10px] font-black text-[#3E4095] uppercase tracking-widest mb-1">
            Candidate Threads
          </span>
          <div className="flex justify-between w-full gap-3">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#3E4095]">
                {stats.open_threads}
              </span>
              <span className="text-[8px] font-bold text-[#3E4095]/70 tracking-tight uppercase">
                Open
              </span>
            </div>
            {/* <div className="w-px h-8 bg-[#3E4095]/50"></div> */}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#3E4095]">
                {stats.in_progress_threads}
              </span>
              <span className="text-[8px] font-bold text-[#3E4095]/70 uppercase">
                In Progress
              </span>
            </div>
            {/* <div className="w-px h-8 bg-[#3E4095]/50"></div> */}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#3E4095]">
                {stats.snoozed_threads}
              </span>
              <span className="text-[8px] font-bold text-[#3E4095]/70 tracking-tight uppercase">
                Snoozed
              </span>
            </div>
            {/* <div className="w-px h-8 bg-[#3E4095]/50"></div> */}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#3E4095]">
                {stats.closed_threads}
              </span>
              <span className="text-[8px] font-bold text-[#3E4095]/70 tracking-tight uppercase">
                Closed
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 bg-emerald-50/5 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fas fa-light fa-lightbulb text-3xl text-emerald-600"></i>
          </div>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
            Online
          </span>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black  text-emerald-900">
                {stats.online_candidates}
              </span>
              <span className="text-[9px] font-bold text-emerald-800/70 uppercase">
                Candidates
              </span>
            </div>
            <div className="w-px h-8 bg-emerald-200/50 mb-1"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-900">
                {stats.online_staff}
              </span>
              <span className="text-[9px] font-bold text-emerald-800/70 uppercase">
                Staff
              </span>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}

function HelpdeskThreadListCard({
  data,
  filters,
  updateFilter,
  refetch,
}: Readonly<{
  data: HelpdeskThreadType[];
  filters: Record<string, string>;
  updateFilter: (key: string, value: string) => void;
  refetch: () => void;
}>) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { performAction, loading: actionLoading } = useHelpdeskAction();
  const [snoozeModal, setSnoozeModal] = useState<{
    open: boolean;
    threadId: string | null;
  }>({
    open: false,
    threadId: null,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const timeoutId = setTimeout(() => {
      updateFilter("search", value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleSort = (sortKey: string) => {
    updateFilter("sort", sortKey);
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilter(key, value);
  };

  const onAction = async (
    id: string,
    status: "closed" | "snoozed",
    snoozedUntil?: string,
  ) => {
    const success = await performAction(id, status, snoozedUntil);
    if (success) {
      refetch();
      if (status === "snoozed") {
        setSnoozeModal({ open: false, threadId: null });
      }
    }
  };

  const handleSnooze = (minutes: number) => {
    if (snoozeModal.threadId) {
      const until = new Date();
      until.setMinutes(until.getMinutes() + minutes);
      onAction(snoozeModal.threadId, "snoozed", until.toISOString());
    }
  };

  return (
    <ResponsiveContainer className="flex gap-4 py-8 px-0 flex-col w-full font-sans bg-white border border-gray-100 rounded-4xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-4 mb-2">
        <div className="flex gap-2.5 items-center">
          <div className="w-1.5 h-6 bg-[#3E4095] rounded-full"></div>
          <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">
            Threads
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-xs"></i>
            <input
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              type="text"
              placeholder="Search candidates..."
              className="bg-gray-50/50 border border-gray-100 h-11 pl-11 pr-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-semibold w-64 shadow-inner"
            />
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer">
                <SortIcon />
                <span>Sort</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-37.5 bg-white rounded-xl p-1 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100"
                sideOffset={5}
              >
                <DropdownMenu.Label className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Sort By
                </DropdownMenu.Label>
                <DropdownMenu.Item
                  onClick={() => handleSort("-last_message_at")}
                  className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg"
                >
                  Newest First
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => handleSort("last_message_at")}
                  className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg"
                >
                  Oldest First
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => handleSort("candidate_name")}
                  className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg"
                >
                  Candidate Name (A-Z)
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => handleSort("-candidate_name")}
                  className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg"
                >
                  Candidate Name (Z-A)
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => handleSort("-priority")}
                  className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg"
                >
                  Priority (High to Low)
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => handleSort("priority")}
                  className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg"
                >
                  Priority (Low to High)
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer">
                <FilterIcon />
                <span>Filter</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-45 bg-white rounded-xl p-3 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100"
                sideOffset={5}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </label>
                    <select
                      value={filters.status || ""}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="border border-gray-100 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#3E4095]/5 focus:border-[#3E4095]"
                    >
                      <option value="default">
                        Default (Open + In Progress)
                      </option>
                      <option value="all">All Statuses</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                      <option value="snoozed">Snoozed</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Unread
                    </label>
                    <select
                      value={filters.unread || ""}
                      onChange={(e) =>
                        handleFilterChange("unread", e.target.value)
                      }
                      className="border border-gray-100 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#3E4095]/5 focus:border-[#3E4095]"
                    >
                      <option value="">All</option>
                      <option value="true">Unread Only</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Priority
                    </label>
                    <select
                      value={filters.priority || ""}
                      onChange={(e) =>
                        handleFilterChange("priority", e.target.value)
                      }
                      className="border border-gray-100 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#3E4095]/5 focus:border-[#3E4095]"
                    >
                      <option value="">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</label>
                                        <select
                                            value={filters.status || ''}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="border border-gray-100 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#3E4095]/5 focus:border-[#3E4095]"
                                        >
                                            <option value="default">Default (Open + In Progress)</option>
                                            <option value="all">All Statuses</option>
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                            <option value="snoozed">Snoozed</option>
                                        </select>
                                    </div> */}

                  <button
                    onClick={() => {
                      updateFilter("search", "");
                      updateFilter("status", "default");
                      updateFilter("unread", "");
                      updateFilter("priority", "");
                      updateFilter("sort", "");
                      setSearchInput("");
                    }}
                    className="mt-1 text-[10px] text-red-500 font-black uppercase tracking-widest hover:underline text-left"
                  >
                    Clear Filters
                  </button>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <React.Fragment>
        <CustomTable
          data={data}
          getRowId={(row) => row.id}
          emptyLabel="No thread open or in progress"
          emptyDesc="Use the filter to load closed or snoozed threads"
          onRowClick={(row) => {
            const query = new URLSearchParams(searchParams.toString());
            query.set("view", "conversation-details");
            query.set("id", row.id);
            router.push(`${pathName}?${query.toString()}`);
          }}
          columns={[
            {
              key: "id",
              header: "S/N",
              align: "center",
              render: (_, __, index) => (
                <div className="flex justify-center">
                  <span className="text-xs font-bold text-gray-400">
                    {index + 1}
                  </span>
                </div>
              ),
            },
            {
              key: "candidate_name",
              header: "Candidate",
              align: "left",
              render: (_, row) => (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 bg-blue-50 text-[#3E4095] rounded-full flex items-center justify-center text-xs font-black border border-blue-100/50">
                      {row.candidate_name.charAt(0).toUpperCase()}
                    </div>
                    {row.is_candidate_online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-800 text-sm">
                      {row.candidate_name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 lowercase tracking-tight">
                      {row.candidate_email}
                    </span>
                  </div>
                </div>
              ),
            },
            {
              key: "status",
              header: "Status",
              align: "center",
              render: (_, row) => {
                const statusConfig: Record<
                  string,
                  { color: string; bg: string; border: string }
                > = {
                  open: {
                    color: "text-red-600",
                    bg: "bg-red-50",
                    border: "border-red-100",
                  },
                  in_progress: {
                    color: "text-[#3E4095]",
                    bg: "bg-indigo-50",
                    border: "border-[#3E4095]/20",
                  },
                  closed: {
                    color: "text-gray-500",
                    bg: "bg-gray-50",
                    border: "border-gray-200",
                  },
                  snoozed: {
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    border: "border-amber-100",
                  },
                };
                const config = statusConfig[row.status] || {
                  color: "text-gray-400",
                  bg: "bg-gray-50",
                  border: "border-gray-200",
                };
                return (
                  <div className="flex justify-center">
                    <span
                      className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest transition-all shadow-sm ${config.bg} ${config.color} ${config.border}`}
                    >
                      {row.status.replace("_", " ")}
                    </span>
                  </div>
                );
              },
            },
            {
              key: "candidate_last_msg_preview",
              header: "Last Message (Candidate)",
              align: "left",
              render: (_, row) => {
                // Prefer the last actual candidate message if messages array is available
                const candidateLastMsg = row.candidate_last_msg_preview;

                return (
                  <div
                    className="max-w-50 truncate text-gray-500 text-xs font-medium italic"
                    title={candidateLastMsg}
                  >
                    {candidateLastMsg
                      ? `"${candidateLastMsg}"`
                      : "No candidate messages"}
                  </div>
                );
              },
            },
            {
              key: "unread_by_staff_count",
              header: "Unread",
              align: "center",
              render: (_, row) => {
                // Count only unread messages sent by the candidate
                const unreadCandidateCount = row.unread_by_staff_count ?? 0;

                return (
                  <div className="flex justify-center">
                    {unreadCandidateCount > 0 ? (
                      <span className="bg-red-500 text-white text-[10px] min-w-5 h-5 flex items-center justify-center rounded-full font-black shadow-sm shadow-red-500/20">
                        {unreadCandidateCount}
                      </span>
                    ) : (
                      <span className="text-gray-300">
                        <i className="fas fa-circle text-s"></i>
                      </span>
                    )}
                  </div>
                );
              },
            },
            {
              key: "last_message_at",
              header: "Since",
              align: "center",
              render: (_, row) => (
                <div className="flex justify-center">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">
                    {formatDateTime(new Date(row.last_message_at))}
                  </span>
                </div>
              ),
            },
            {
              key: "action",
              header: "Action",
              align: "center",
              render: (_, row) => {
                const href = (() => {
                  const query = new URLSearchParams(searchParams.toString());
                  query.set("view", "conversation-details");
                  query.set("id", row.id);
                  return `${pathName}?${query.toString()}`;
                })();
                return (
                  <div
                    className="flex justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#2d2f6e] hover:text-white hover:cursor-pointer transition-all outline-none">
                          <i className="fas fa-arrow-down text-[10px]"></i>
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="z-50 min-w-30 bg-white rounded-xl p-1 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            onClick={() => onAction(row.id, "closed")}
                            className="px-3 py-2 text-xs font-bold text-red-600 outline-none cursor-pointer hover:bg-red-50 rounded-lg flex items-center gap-2"
                          >
                            <i className="fas fa-times-circle"></i>
                            <span>CLOSE</span>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() =>
                              setSnoozeModal({ open: true, threadId: row.id })
                            }
                            className="px-3 py-2 text-xs font-bold text-amber-600 outline-none cursor-pointer hover:bg-amber-50 rounded-lg flex items-center gap-2"
                          >
                            <i className="fas fa-clock"></i>
                            <span>SNOOZE</span>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <Link
                      href={href}
                      className="w-8 h-8 rounded-full bg-[#3E4095] text-white flex items-center justify-center hover:bg-[#2d2f6e] transition-all shadow-md shadow-[#3E4095]/10 active:scale-95"
                    >
                      <i className="fas fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                );
              },
            },
          ]}
        />
        <SnoozeModal
          open={snoozeModal.open}
          close={(open) => setSnoozeModal((prev) => ({ ...prev, open }))}
          onSnooze={handleSnooze}
          loading={actionLoading}
        />
      </React.Fragment>
    </ResponsiveContainer>
  );
}
