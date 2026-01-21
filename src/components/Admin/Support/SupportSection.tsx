'use client';
import CustomTable from '@/components/ui/CustomTable';
import TablePagination from '@/components/ui/Pagination/TablePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import useListConversations from '@/hooks/useListConversations';
import usePagination from '@/hooks/usePagination';
import { SupportConversationType } from '@/types/SupportType';
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

    const { data } = useListConversations(page, filters);

    return (
        <div className="flex flex-col gap-1">
            <AdminHeader label="Support" actionButton={undefined} />
            <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto">
                {view === 'conversation-details' ? (
                    <ConversationDetails />
                ) : (
                    <ConversationListCard
                        data={data?.results ?? []}
                        page_count={Math.ceil((data?.count ?? 0) / 10)}
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
    data: SupportConversationType[];
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
                    <h2 className="font-bold text-lg sm:text-xl">Support Conversations</h2>
                    <p className="text-sm text-gray-600">List of ongoing support inquiries</p>
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
                        header: 'User',
                        render: (_, row) => (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                                    {row.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-900">{row.user.name}</span>
                            </div>
                        ),
                    },
                    {
                        key: 'last_message',
                        header: 'Last Message',
                        render: (_, row) => (
                            <div className="max-w-[300px] truncate text-gray-600" title={row.last_message.content}>
                                {row.last_message.content}
                            </div>
                        ),
                    },
                     {
                        key: 'timestamp',
                        header: 'Time',
                        render: (_, row) => (
                            <div className="text-gray-500 text-sm">
                                {formatDate(new Date(row.last_message.timestamp))}
                            </div>
                        ),
                    },
                    {
                        key: 'unread',
                        header: '',
                        align: 'center',
                        render: (_, row) => (
                             row.unread_count > 0 ? (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {row.unread_count}
                                </span>
                            ) : null
                        ),
                    },
                    {
                        key: 'action',
                        header: 'Action',
                        align: 'right',
                         render: (_, row) => {
                              const href = (() => {
                                const query = new URLSearchParams(searchParams.toString());
                                query.set('view', 'conversation-details');
                                query.set('id', row.id);
                                query.set('user_name', row.user.name);
                                return `${pathName}?${query.toString()}`;
                              })();
                             return (
                                <Link href={href} className="text-[#3E4095] font-bold hover:underline px-3 text-sm">
                                    Respond
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
