'use client';
import CustomTable from '@/components/ui/CustomTable';
import TablePagination from '@/components/ui/Pagination/TablePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import useListUserMgt from '@/hooks/useListUserMgt';
import usePagination from '@/hooks/usePagination';
import { ActivityHistoryUserType } from '@/types/auth';
import { MgtItem } from '@/types/UserMgtType';
import { formatDate } from '@/utils/formatFileSize';
import { getUserName } from '@/utils/generalUtils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import Button from '../../ui/Button';
import ResponsiveContainer from '../../ui/ResponsiveContainer';
import AdminHeader from '../AdminHeader';
import {
  ActiveIcon,
  AngleIcon,
  BroadcastIcon,
  FilterIcon,
  InactiveIcon,
  ManageQuestionIcon,
  PreRegisteredIcon,
  RegisteredIcon,
  SortIcon,
  ViewLeaderBoardIcon,
} from '../AdminIcons';
import SendBulkMessageModal from '@/components/Modals/SendBulkMessageModal';

function shouldShowHeaderButtons(role: string): boolean {
  switch (role) {
    case 'volunteer':
    case 'moderator':
      return false;

    case 'admin':
    case 'manager':
    case 'superadmin':
    case 'sponsor':
      return true;

    default:
      return false;
  }
}

export default function OverviewSection() {
  const { page, setPage } = usePagination();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    search: '',
    profile: 'candidate',
  });

  const { data } = useListUserMgt(page, filters);

  return (
    <div className="flex flex-col gap-1">
      <AdminHeader
        isExport
        label="Overview"
        actionButton={
          <Button
            onClick={() => setOpen(true)}
            className="inline-flex gap-2 border px-2 sm:px-4 items-center text-xs sm:text-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">SEND BROADCAST</span>
            <span className="sm:hidden">BROADCAST</span>
          </Button>
        }
      />
      <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto">
        <OverviewSummaryCard
          active={data?.stats_overview?.candidates?.active ?? 0}
          inactive={data?.stats_overview?.candidates?.inactive ?? 0}
          preRegisteredStudents={data?.stats_overview?.candidates?.pre_registered ?? 0}
          registeredStudents={data?.stats_overview?.candidates?.registered ?? 0}
        />
        <QuickActionsCard />
        <ActivityHistoryCard
          handleSearch={setFilters}
          page_count={data?.pagination.total_pages ?? 0}
          currentPage={page}
          onPageChange={setPage}
          data={(data?.results as MgtItem[]) ?? []}
        />
      </div>
      <SendBulkMessageModal open={open} close={setOpen} />
    </div>
  );
}

function ActivityHistoryCard({
  data,
  onPageChange,
  currentPage,
  page_count,
  handleSearch,
}: Readonly<{
  data: ActivityHistoryUserType[];
  // data: MgtItem[],
  handleSearch: Dispatch<SetStateAction<{}>>;
  onPageChange: Dispatch<SetStateAction<number>>;
  currentPage: number;
  page_count: number;
}>) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);

  return (
    <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 px-1 sm:px-3">
        <div className="flex gap-1 flex-col">
          <h2 className="font-bold text-lg sm:text-xl">Candidate List</h2>
          <p className="text-sm text-gray-600">Sorted by recent joins</p>
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
        minWidth="1100px"
        columns={[
          {
            key: 'S/N',
            header: 'S/N',
            align: 'center',
            render: (_, __, index) => (
              <div className="py-2">
                {index + 1}
              </div>
            ),
          },
          {
            key: 'Name',
            header: 'Name',
            render: (_, row) => {
              const userName = getUserName(
                row.user.first_name,
                row.user.last_name
              );
              return <div className="font-medium text-gray-900">{userName}</div>;
            },
          },
          {
            key: 'current_class',
            header: 'Class',
            render: (_, row) => <div>{row.current_class}</div>
          },
          {
            key: 'school_name',
            header: 'School',
            render: (_, row) => <div className="max-w-[250px] truncate" title={row.school_name || ''}>{row.school_name}</div>
          },
          {
            key: 'state',
            header: 'State',
            render: (_, row) => <div>{row.user.state}</div>
          },
          {
            key: 'Joined',
            header: 'Joined',
            render: (_, row) => (
              <div>
                {formatDate(row.user.date_joined)}
              </div>
            ),
          },
          {
            key: 'Action',
            header: 'Detail',
            align: 'right',
            render: (_, row) => {
              const href = (() => {
                const query = new URLSearchParams(searchParams.toString());
                query.set('view', 'view-details');
                query.set('id', row.user.id);
                return `${pathName}?${query.toString()}`;
              })();
              return (
                <Link href={href} className="text-[#3E4095] font-bold hover:underline px-3 text-sm">
                  View
                </Link>
              );
            },
          },
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

function QuickActionsCard() {
  return (
    <ResponsiveContainer className="flex w-full gap-3 sm:gap-4 p-3 sm:p-4 flex-col mx-auto">
      <h2 className="text-lg sm:text-xl font-bold">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/overview?tab=Exam+System&page=1"
          className="flex justify-between items-center p-4 rounded-xl border border-[#3E4095]/10 hover:bg-[#3E4095]/5 transition-all group"
        >
          <div className="flex gap-3 items-center">
            <span className="flex-shrink-0">
              <ManageQuestionIcon />
            </span>
            <p className="text-m text-gray-700 tracking-tight">Explore Questions</p>
          </div>
          <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
            <AngleIcon />
          </span>
        </Link>
        <Link
          href="/admin/overview?tab=Leaderboards"
          className="flex justify-between items-center p-4 rounded-xl border border-[#3E4095]/10 hover:bg-[#3E4095]/5 transition-all group"
        >
          <div className="flex gap-3 items-center">
            <span className="flex-shrink-0">
              <ViewLeaderBoardIcon />
            </span>
            <p className="text-m text-gray-700 tracking-tight">View Leaderboard</p>
          </div>
          <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
            <AngleIcon />
          </span>
        </Link>
        <Link
          href="/admin/overview?tab=Announcement"
          className="flex justify-between items-center p-4 rounded-xl border border-[#3E4095]/10 hover:bg-[#3E4095]/5 transition-all group"
        >
          <div className="flex gap-3 items-center">
            <span className="flex-shrink-0">
              <BroadcastIcon />
            </span>
            <p className="text-m text-gray-700 tracking-tight">Manage Broadcast</p>
          </div>
          <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
            <AngleIcon />
          </span>
        </Link>
      </div>
    </ResponsiveContainer>
  );
}

function OverviewSummaryCard({
  registeredStudents,
  preRegisteredStudents,
  active,
  inactive,
}: {
  registeredStudents: number;
  preRegisteredStudents: number;
  active: number;
  inactive: number;
}) {
  const stats = [
    {
      icon: <RegisteredIcon />,
      label: 'REGISTERED CANDIDATES',
      value: registeredStudents,
      // change: '0%'
    },
    {
      icon: <PreRegisteredIcon />,
      label: 'PRE-REGISTERED CANDIDATES',
      value: preRegisteredStudents,
      // change: '0%'
    },
    {
      icon: <ActiveIcon />,
      label: 'ACTIVE CANDIDATES',
      value: active,
      // change: '0%'
    },
    {
      icon: <InactiveIcon />,
      label: 'INACTIVE CANDIDATES',
      value: inactive,
      // change: '0%'
    }
  ];

  return (
    <ResponsiveContainer className="flex gap-3 sm:gap-4 px-2 sm:px-3 flex-col mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex gap-3 sm:gap-4 flex-col p-4 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
            <div className="flex gap-2 items-center">
              <span className="flex-shrink-0">{stat.icon}</span>
              <p className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">{stat.label}</p>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold text-xl sm:text-2xl">{stat.value}</span>
              <div className="flex">
                <span className="text-xs text-[#0F973D]">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ResponsiveContainer>
  );
}