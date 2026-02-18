'use client';
import CustomTable from '@/components/ui/CustomTable';
import TablePagination from '@/components/ui/Pagination/TablePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import useListSupportThreads from '@/hooks/useListSupportThreads';
import usePagination from '@/hooks/usePagination';
import { SupportThreadType } from '@/types/SupportType';
import { formatDate } from '@/utils/formatFileSize';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import ResponsiveContainer from '../../ui/ResponsiveContainer';
import AdminHeader from '../AdminHeader';
import { FilterIcon, SortIcon } from '../AdminIcons';
import ConversationDetails from './ConversationDetails';

export default function SupportSection() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view');
    const { page, setPage } = usePagination();
    const [filters, setFilters] = useState<Record<string, string>>({
        search: '',
    });

    const { data } = useListSupportThreads(page, filters);

    return (
        <div className="flex flex-col gap-1">
            <AdminHeader label="Helpdesk" actionButton={undefined} />
            <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto">
                {view === 'conversation-details' ? (
                    <ConversationDetails />
                ) : (
                    <ConversationListCard
                        data={data?.results ?? []}
                        page_count={data ? Math.ceil(data.count / 10) : 0} // Assuming 10 items per page
                        currentPage={page}
                        onPageChange={setPage}
                        handleSearch={setFilters}
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
}: Readonly<{
    data: SupportThreadType[];
    handleSearch: Dispatch<SetStateAction<Record<string, string>>>;
    onPageChange: Dispatch<SetStateAction<number>>;
    currentPage: number;
    page_count: number;
}>) {
    const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);
    const pathName = usePathname();
    const searchParams = useSearchParams();

    return (
        <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col w-full">
             <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 px-1 sm:px-3">
                <div className="flex gap-1 flex-col">
                    <h2 className="font-bold text-lg sm:text-xl">Helpdesk Conversations</h2>
                    <p className="text-sm text-gray-600">List of candidates&apos; support inquiries </p>
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
                data={data}
                minWidth="800px"
                columns={[
                    {
                        key: 'user',
                        header: 'Candidate',
                        align: 'left',
                        render: (_, row) => (
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                                        {row.candidate_name.charAt(0).toUpperCase()}
                                    </div>
                                    {row.is_online && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">{row.candidate_name}</span>
                                    <span className="text-xs text-gray-500">{row.candidate_email}</span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: 'status',
                        header: 'Status',
                        align: 'left',
                        render: (_, row) => (
                            <span className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    row.status === 'open' ? 'bg-white text-[#9E0A05] border border-[#9E0A05]/20' :
                                    row.status === 'in_progress' ? 'bg-white text-[#865503] border border-[#865503]/20' :
                                    row.status === 'resolved' ? 'bg-white text-emerald-600 border border-emerald-600/20' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {row.status.replace('_', ' ')}
                            </span>
                        ),
                    },
                    {
                        key: 'priority',
                        header: 'Priority',
                        align: 'left',
                        render: (_, row) => (
                            <span className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                row.priority === 'urgent' ? 'bg-white text-[#9E0A05] border border-[#9E0A05]/20' :
                                row.priority === 'high' ? 'bg-white border border-[#FC6A03]/40 text-[#FC6A03]' :
                                row.priority === 'medium' ? 'bg-white border border-[#3E4095]/40 text-[#3E4095]' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {row.priority}
                            </span>
                        ),
                    },
                    {
                        key: 'last_message',
                        header: 'Last Message',
                        align: 'left',
                        render: (_, row) => (
                            <div className="max-w-[250px] truncate text-gray-600 text-xs" title={row.last_message_preview}>
                                {row.last_message_preview}
                            </div>
                        ),
                    },
                     {
                        key: 'timestamp',
                        header: 'Since',
                        align: 'center',
                        render: (_, row) => (
                            <div className="text-gray-500 text-[10px] font-medium">
                                {formatDate(new Date(row.last_message_at))}
                            </div>
                        ),
                    },
                    {
                        key: 'unread',
                        header: 'Unattended',
                        align: 'center',
                        render: (_, row) => (
                             (row.unread_count ?? 0) > 0 ? (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    {row.unread_count}
                                </span>
                            ) : null
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
                                <Link href={href} className="text-[#3E4095] font-bold hover:underline px-3 text-sm">
                                    Engage
                                </Link>
                             )
                         }
                    }
                ]}
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
