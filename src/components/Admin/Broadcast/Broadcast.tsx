import TablePagination from '@/components/ui/Pagination/TablePagination';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import useGetBroadcast from '@/hooks/useGetBroadcast';
import usePagination from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebouce';
import { formatDate, formatTimeToString } from '@/utils/formatFileSize';
import { getUserName } from '@/utils/generalUtils';
import clsx from 'clsx';
import { Dispatch, SetStateAction, useState } from 'react';
import BroadcastDetailsModal from '../../Modals/BroadcastDetailsModal';
import SendBulkMessageModal from '../../Modals/SendBulkMessageModal';
import AdminHeader from '../AdminHeader';
import { FilterIcon, SortIcon } from '../AdminIcons';
import {
  BroadcastSpeakerIcon,
  EmailChannelIcon,
  PlatformChannelIcon,
  SMSIcon,
} from './BroadcastIcons';
import { BroadcastItemType } from '@/types/BroadCastType';

type ColumnType<T> = {
  key: keyof T | string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
};

type CustomTableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  emptyLabel?: string;
  emptyDesc?: React.ReactNode;
  footer?: React.ReactNode;
};

function CustomTable<T extends { id: number }>({
  columns,
  data,
  emptyLabel = "No records found",
  emptyDesc = "There are currently no entries to display.",
  footer,
}: Readonly<CustomTableProps<T>>) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#E4E7EC]">
              {columns.map((col, i) => (
                <th key={i} className={clsx("py-3 px-3 text-[9px] font-black uppercase tracking-widest text-gray-500", col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left')}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-xl font-semibold">{emptyLabel}</h2>
                    <p className="text-gray-500">{emptyDesc}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E4E7EC] last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col, ci) => {
                    const value =
                      typeof col.key === "string" && col.key.includes(".")
                        ? col.key
                          .split(".")
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          .reduce((acc: any, k) => acc?.[k] ?? "", row)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        : (row as any)[col.key];

                    return (
                      <td key={ci} className={clsx("py-2 px-3", col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left')}>
                        {col.render ? col.render(value, row, 0) : value}
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

export default function Broadcast() {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] =
    useState<BroadcastItemType | null>(null);
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const [medium, setMedium] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending } = useGetBroadcast({
    page,
    search: debouncedSearch,
    medium: medium
  });

  const handleViewDetails = (broadcast: BroadcastItemType) => {
    setSelectedBroadcast(broadcast);
    setDetailsOpen(true);
  };

  return (
    <div className="flex flex-col gap-1 font-sans">
      <AdminHeader
        label="Broadcast"
        actionButton={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2.5 bg-[#3E4095] text-white px-6 py-3 rounded-xl font-black text-[10px] tracking-widest hover:bg-[#2d2f6e] transition-all uppercase shadow-lg shadow-[#3E4095]/20 active:scale-95"
          >
            <i className="fas fa-bullhorn text-xs"></i>
            <span>SEND BROADCAST</span>
          </button>
        }
      />
      <div className="flex flex-col gap-6 mt-4 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto pb-20">
        <BroadcastStats
          summary={data?.broadcast_summary_data}
          activeMedium={medium}
          onMediumChange={setMedium}
        />

        {isPending ? (
          <div className="grid w-full h-[20vh] place-content-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
          </div>
        ) : (
          <BroadcastHistoryTable
            page_count={data?.total_pages ?? 0}
            onPageChange={setPage}
            currentPage={page}
            broadcastData={data?.results ?? []}
            onViewDetails={handleViewDetails}
            search={search}
            setSearch={setSearch}
          />
        )}
      </div>
      <SendBulkMessageModal open={open} close={setOpen} />
      <BroadcastDetailsModal
        open={detailsOpen}
        close={setDetailsOpen}
        broadcast={selectedBroadcast}
      />
    </div>
  );
}

import { BroadcastSummaryDataType } from '@/types/BroadCastType';

function BroadcastStats({
  summary,
  activeMedium,
  onMediumChange
}: {
  summary?: BroadcastSummaryDataType;
  activeMedium?: string;
  onMediumChange: (medium?: string) => void;
}) {
  const statItems = [
    {
      label: 'TOTAL',
      value: summary?.total_broadcasts ?? 0,
      icon: <BroadcastSpeakerIcon />,
      color: 'text-[#3E4095]',
      bg: 'bg-[#3E4095]/5',
      key: undefined
    },
    {
      label: 'EMAIL',
      value: summary?.email_count ?? 0,
      icon: <EmailChannelIcon />,
      color: 'text-[#6941C6]',
      bg: 'bg-[#F9F5FF]',
      key: 'email'
    },
    {
      label: 'PLATFORM',
      value: summary?.platform_count ?? 0,
      icon: <PlatformChannelIcon />,
      color: 'text-[#3538CD]',
      bg: 'bg-[#EEF4FF]',
      key: 'platform'
    },
    {
      label: 'SMS',
      value: summary?.sms_count ?? 0,
      icon: <SMSIcon />,
      color: 'text-[#C11574]',
      bg: 'bg-[#FDF2FA]',
      key: 'sms'
    },
    {
      label: 'WHATSAPP',
      value: summary?.whatsapp_count ?? 0,
      icon: <i className="fab fa-whatsapp text-lg"></i>,
      color: 'text-[#099137]',
      bg: 'bg-[#E7F6EC]',
      key: 'whatsapp'
    }
  ];

  return (
    <ResponsiveContainer className="font-sans flex flex-col gap-5 p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-[#3E4095] rounded-full"></div>
          <h1 className="text-lg font-black text-gray-800 tracking-tight uppercase">Broadcast Stats</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => {
          const isActive = activeMedium === item.key;
          return (
            <button
              key={index}
              onClick={() => onMediumChange(isActive ? undefined : item.key)}
              className={clsx(
                "flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300 text-left group",
                isActive
                  ? "bg-white border-[#3E4095] shadow-md ring-2 ring-[#3E4095]/5"
                  : "bg-gray-50/50 border-gray-50 hover:bg-white hover:border-[#3E4095]/20 hover:shadow-md"
              )}
            >
              <div className="flex gap-3 items-center">
                <div className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                  item.bg, item.color, "group-hover:scale-110"
                )}>
                  {item.icon}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                  {item.label}
                </p>
              </div>
              <div className="flex items-end justify-between mt-1">
                <span className="font-black text-2xl tracking-tight leading-none text-gray-900 px-3">
                  {item.value.toLocaleString()}
                </span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-[#3E4095] animate-pulse"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ResponsiveContainer>
  );
}


type Props = {
  broadcastData: BroadcastItemType[];
  currentPage: number;
  page_count: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  onViewDetails: (broadcast: BroadcastItemType) => void;
  search: string;
  setSearch: (val: string) => void;
};

export function BroadcastHistoryTable({
  broadcastData,
  currentPage,
  page_count,
  onPageChange,
  onViewDetails,
  search,
  setSearch,
}: Readonly<Props>) {
  return (
    <ResponsiveContainer className="flex gap-4 py-8 px-0 flex-col mx-auto font-sans bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 gap-4">
        <div className="flex gap-2.5 items-center">
          <div className="w-1.5 h-6 bg-[#3E4095] rounded-full"></div>
          <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Broadcast History</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-xs"></i>
            <input
              type="text"
              placeholder="Search message subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50/50 border border-gray-100 h-11 pl-11 pr-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-semibold w-64 shadow-inner"
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

      <div className="px-1 overflow-x-auto">
        <CustomTable
          data={broadcastData}
          columns={[
            {
              key: 'subject',
              header: 'Subject',
              render: (_, row) => (
                <div className="flex flex-col gap-5 min-w-[300px]">
                  <span className="font-bold text-gray-800 text-sm justify-text-center">{row.subject}</span>
                  <p className="text-[10px] text-gray-400 line-clamp-1 items-center">{row.message}</p>
                </div>
              ),
            },
            {
              key: 'sent',
              header: 'Sent by',
              align: 'center',
              render: (_, row) => {
                const userName =
                  row.created_by.full_name ||
                  getUserName(
                    row.created_by.user?.first_name || '',
                    row.created_by.user?.last_name || ''
                  );
                return (
                  <div className="flex justify-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-[#3E4095]">
                      {userName.charAt(0)}
                    </div>
                    <span className="flex items-center text-xs font-bold text-gray-600">{userName}</span>
                  </div>
                );
              },
            },
            {
              key: 'mode',
              header: 'Modes',
              align: 'center',
              render: (_, row) => {
                return (
                  <div className="flex justify-center gap-1.5">
                    {row?.mediums.map((val: string, index: number) => (
                      <span
                        key={`medium-${index}`}
                        className={clsx(
                          getAppropriatePlatformColor(val),
                          'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current/30'
                        )}
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                );
              },
            },
            {
              key: 'Date',
              header: 'Date & Time',
              align: 'center',
              render: (_, row) => {
                const getDate = formatDate(row.created_at);
                const time = formatTimeToString(row.created_at);
                return (
                  <div className="flex flex-col justify-center gap-1.5">
                    <span className="text-[11px] font-bold text-gray-700">{getDate}</span>
                    <span className="text-[10px] font-medium text-gray-400">{time}</span>
                  </div>
                );
              },
            },
            {
              key: 'action',
              header: 'Action',
              align: 'center',
              render: (_, row) => (
                <button
                className="px-4 py-2 bg-gray-50 hover:bg-[#3E4095] text-[#3E4095] border border-[#3E4095]/5 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all justify-center"
                  onClick={() => onViewDetails(row)}
                >
                  View Details
                </button>
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
        />
      </div>
    </ResponsiveContainer>
  );
}

function getAppropriatePlatformColor(val: string) {
  switch (val) {
    case 'platform':
      return 'bg-[#EEF4FF] text-[#3538CD]';
    case 'email':
      return 'bg-[#F9F5FF] text-[#6941C6]';
    case 'sms':
      return 'bg-[#FDF2FA] text-[#C11574]';
    case 'whatsapp':
      return 'bg-[#E7F6EC] text-[#099137]';
    default:
      return 'bg-gray-50 text-gray-500';
  }
}
