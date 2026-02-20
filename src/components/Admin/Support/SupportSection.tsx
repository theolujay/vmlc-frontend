'use client';
import TablePagination from '@/components/ui/Pagination/TablePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import useListSupportThreads from '@/hooks/useListSupportThreads';
import usePagination from '@/hooks/usePagination';
import { SupportThreadType } from '@/types/SupportType';
import { formatDateTime } from '@/utils/formatFileSize';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import ResponsiveContainer from '../../ui/ResponsiveContainer';
import AdminHeader from '../AdminHeader';
import { FilterIcon, SortIcon } from '../AdminIcons';
import ConversationDetails from './ConversationDetails';
import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Spinner from '@/components/ui/spinner/spinner';
import CustomTable from '@/components/ui/CustomTable';
import React from 'react';

export default function SupportSection() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view');
    const { page, setPage } = usePagination();
    const [filters, setFilters] = useState<Record<string, string>>({
        search: '',
    });

    const { data, loading } = useListSupportThreads(page, filters);

    return (
        <div className="flex flex-col gap-1 font-sans">
            <AdminHeader label="Helpdesk Thread" actionButton={undefined} />
            <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto pb-10">
                {view === 'conversation-details' ? (
                    <ConversationDetails />
                ) : loading && !data ? (
                    <div className="grid w-full h-[40vh] place-content-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                        <Spinner />
                    </div>
                ) : (
                    <ConversationListCard
                        data={data?.results ?? []}
                        page_count={data?.total_pages ?? 0}
                        currentPage={page}
                        onPageChange={setPage}
                        handleSearch={setFilters}
                        filters={filters}
                        setFilters={setFilters}
                        hasNext={data?.next !== null}
                        hasPrevious={data?.previous !== null}
                    />
                )}
            </div>
        </div>
    );
}



function ConversationListCard({
    data,
    onPageChange,
    currentPage,
    page_count,
    handleSearch,
    filters,
    setFilters,
    hasNext,
    hasPrevious,
    pageSize = 20,
}: Readonly<{
    data: SupportThreadType[];
    handleSearch: Dispatch<SetStateAction<Record<string, string>>>;
    onPageChange: Dispatch<SetStateAction<number>>;
    currentPage: number;
    page_count: number;
    filters: Record<string, string>;
    setFilters: Dispatch<SetStateAction<Record<string, string>>>;
    hasNext?: boolean;
    hasPrevious?: boolean;
    pageSize?: number;
}>) {
    const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const handleSort = (sortKey: string) => {
        setFilters(prev => ({ ...prev, ordering: sortKey }));
        onPageChange(1);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        onPageChange(1);
    };

    return (
        <ResponsiveContainer className="flex gap-4 py-8 px-0 flex-col w-full font-sans bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-4 mb-2">
                <div className="flex gap-2.5 items-center">
                    <div className="w-1.5 h-6 bg-[#3E4095] rounded-full"></div>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Helpdesk Threads</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-xs"></i>
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
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
                            <DropdownMenu.Content className="z-50 min-w-[150px] bg-white rounded-xl p-1 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100" sideOffset={5}>
                                <DropdownMenu.Label className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By</DropdownMenu.Label>
                                <DropdownMenu.Item onClick={() => handleSort('-last_message_at')} className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg">Newest First</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => handleSort('last_message_at')} className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg">Oldest First</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => handleSort('candidate_name')} className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg">Candidate Name (A-Z)</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => handleSort('-candidate_name')} className="px-3 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 rounded-lg">Candidate Name (Z-A)</DropdownMenu.Item>
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
                            <DropdownMenu.Content className="z-50 min-w-[180px] bg-white rounded-xl p-3 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100" sideOffset={5}>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                                        <select
                                            value={filters.status || ''}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="border border-gray-100 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#3E4095]/5 focus:border-[#3E4095]"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</label>
                                        <select
                                            value={filters.priority || ''}
                                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                                            className="border border-gray-100 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#3E4095]/5 focus:border-[#3E4095]"
                                        >
                                            <option value="">All Priorities</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setFilters({ search: '' });
                                            onPageChange(1);
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
                    columns={[
                        {
                            key: 'id',
                            header: 'S/N',
                            align: 'center',
                            render: (_, __, index) => (
                                <div className="flex justify-center">
                                    <span className="text-xs font-bold text-gray-400">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key: 'candidate_name',
                            header: 'Candidate',
                            align: 'left',
                            render: (_, row) => (
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-9 h-9 bg-blue-50 text-[#3E4095] rounded-full flex items-center justify-center text-xs font-black border border-blue-100/50">
                                            {row.candidate_name.charAt(0).toUpperCase()}
                                        </div>
                                        {row.is_online && (
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-gray-800 text-sm">{row.candidate_name}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{row.candidate_email}</span>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            align: 'center',
                            render: (_, row) => (
                                <div className="flex justify-center">
                                    <span className={clsx(
                                        "capitalize text-[9px] font-black px-3 py-1 rounded-full border tracking-widest",
                                        row.status === 'open' ? 'bg-red-50 text-[#9E0A05] border-[#9E0A05]/20' :
                                        row.status === 'in_progress' ? 'bg-amber-50 text-[#865503] border-[#865503]/20' :
                                        row.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-600/20' :
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                    )}>
                                        {row.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key: 'priority',
                            header: 'Priority',
                            align: 'center',
                            render: (_, row) => (
                                <div className="flex justify-center">
                                    <span className={clsx(
                                        "capitalize text-[9px] font-black px-3 py-1 rounded-full border tracking-widest",
                                        row.priority === 'urgent' ? 'bg-red-50 text-[#9E0A05] border-[#9E0A05]/20' :
                                        row.priority === 'high' ? 'bg-orange-50 border-orange-100 text-[#FC6A03]' :
                                        row.priority === 'medium' ? 'bg-indigo-50 border-indigo-100 text-[#3E4095]' :
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                    )}>
                                        {row.priority}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key: 'candidate_last_msg_preview',
                            header: 'Last Message (Candidate)',
                            align: 'left',
                            render: (_, row) => {
                                // Prefer the last actual candidate message if messages array is available
                                const candidateLastMsg = row.candidate_last_msg_preview

                                return (
                                    <div className="max-w-[200px] truncate text-gray-500 text-xs font-medium italic" title={candidateLastMsg}>
                                        {candidateLastMsg ? `"${candidateLastMsg}"` : 'No candidate messages'}
                                    </div>
                                );
                            },
                        },
                        {
                            key: 'unread_by_staff_count',
                            header: 'Unattended',
                            align: 'center',
                            render: (_, row) => {
                                // Count only unread messages sent by the candidate
                                const unreadCandidateCount = row.unread_by_staff_count ?? 0

                                return (
                                    <div className="flex justify-center">
                                        {unreadCandidateCount > 0 ? (
                                            <span className="bg-red-500 text-white text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full font-black shadow-sm shadow-red-500/20">
                                                {unreadCandidateCount}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">
                                                <i className="fas fa-check-circle text-xs"></i>
                                            </span>
                                        )}
                                    </div>
                                );
                            },
                        },
                        {
                            key: 'last_message_at',
                            header: 'Since',
                            align: 'center',
                            render: (_, row) => (
                                <div className="flex justify-center">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">
                                        {formatDateTime(new Date(row.last_message_at))}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key: 'action',
                            header: 'Action',
                            align: 'center',
                            render: (_, row) => {
                                const href = (() => {
                                    const query = new URLSearchParams(searchParams.toString());
                                    query.set('view', 'conversation-details');
                                    query.set('id', row.id);
                                    return `${pathName}?${query.toString()}`;
                                })();
                                return (
                                    <div className="flex justify-center">
                                        <Link href={href} className="bg-[#3E4095] text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#2d2f6e] transition-all shadow-md shadow-[#3E4095]/10 active:scale-95">
                                            Engage
                                        </Link>
                                    </div>
                                );
                            }
                        }
                    ]}
                    footer={
                        <div className="px-8 border-t border-gray-50 py-3">
                            <TablePagination
                                currentPage={currentPage}
                                pageCount={page_count}
                                onPageChange={onPageChange}
                                hasNext={hasNext}
                                hasPrevious={hasPrevious}
                            />
                        </div>
                    }
                />
            </React.Fragment>
        </ResponsiveContainer>
    );
}

