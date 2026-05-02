/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AddIcon } from '@/components/General/GettingStarted/GettingStartedAssets'
import Button from '@/components/ui/Button'
import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useListUserMgt from '@/hooks/useListUserMgt'
import { MgtItem, MgtItemType, OverviewType, StatOverviewType } from '@/types/UserMgtType'
import { formatDate } from '@/utils/formatFileSize'
import { getUserName } from '@/utils/generalUtils'
import { getUserInitials } from '@/utils/capitalizeWords'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'
import Image from 'next/image'
import AdminHeader from '../AdminHeader'
import { FilterIcon, SortIcon, UserManagementIcon, CandidateIcon } from '../AdminIcons'
import { DoughnutChart } from '../Charts/ProgressRing'
import ProfileModal from '@/components/Modals/ProfileModal'
import ExportModal from '@/components/Modals/ExportModal'
import ImportModal from '@/components/Modals/ImportModal'
import BulkNotificationModal from '@/components/Modals/BulkNotificationModal'
import { useState, Dispatch, SetStateAction, useMemo } from 'react'
import usePagination from '@/hooks/usePagination'
import TablePagination from '@/components/ui/Pagination/TablePagination'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import useGetAccountMgt from '@/hooks/useGetAccountMgt'
import Spinner from '@/components/ui/spinner/spinner'
import InfoBoard from '@/components/General/Portal/DashboardParts/InfoBoard'
import { useNotifications } from '@/contexts/NotificationProvider'
import { SNCell, CandidateCell, SchoolCell, ViewDetailsButton } from '../Competition/CompetitionTableCells'

export default function UserManagement() {
    const { data: accountMgt, isPending: isAccountMgtPending } = useGetAccountMgt();
    const userRole = accountMgt?.role;
    const isVolunteer = userRole === 'volunteer';
    const canExport = userRole === 'manager' || userRole === 'superadmin';

    const pathName = usePathname();
    const searchParams = useSearchParams()
    const router = useRouter()
    const { notifications, markAsRead } = useNotifications();

    const { page, setPage } = usePagination();
    const [filters, setFilters] = useState<Record<string, string>>({ profile: 'candidate' });

    const { data } = useListUserMgt(page, filters, !isVolunteer)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [bulkNotificationOpen, setBulkNotificationOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const profile = filters.profile || 'candidate';

    const setProfile = (newProfile: string) => {
        setFilters({ profile: newProfile });
        setPage(1);
        setSelectedUsers([]);
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectAllUsers = () => {
        const allIds = data?.results?.map((u: any) => u.user?.id || u.id) || [];
        setSelectedUsers(allIds);
    };

    const clearSelection = () => {
        setSelectedUsers([]);
    };

    const overview = data?.stats_overview;

    // Notification Queue Logic
    const activeNotifications = useMemo(() => {
        return notifications
            .filter(n => !n.is_read)
            .filter(n => {
                const type = (n.type || '').toLowerCase();
                return type === 'info' || type === 'success';
            })
            .map(n => ({
                ...n,
                type: (n.type || 'info').toLowerCase() as 'info' | 'success' | 'error'
            }));
    }, [notifications]);

    const handleDismissNotification = () => {
        if (activeNotifications.length > 0) {
            markAsRead(activeNotifications[0].id);
        }
    };

    function addStaffMember() {
        const params = new URLSearchParams(searchParams.toString())
        params.set('view', 'add-staff')
        const route = `${pathName}?${params.toString()}`
        router.push(route)
    }

    const handleViewProfile = (id: string) => {
        setSelectedUserId(id);
        setProfileOpen(true);
    };

    if (isAccountMgtPending) return <div className="grid w-full h-[60vh] place-content-center"><Spinner /></div>

    if (isVolunteer) {
        return (
            <div className='flex flex-col gap-4 font-sans'>
                <AdminHeader label='User Mgt.' />
                <div className="flex flex-col items-center justify-center p-20 text-center bg-gray-50 rounded-2xl border border-gray-100 mx-4 md:mx-10">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                        <i className="fas fa-lock text-2xl"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Access Restricted</h2>
                    <p className="text-gray-600 max-w-sm">Volunteers do not have permission to access the User Management system.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4 font-sans pb-10'>
            <AdminHeader
                isExport={canExport}
                onExport={() => canExport && setExportOpen(true)}
                isImport
                onImport={() => setImportOpen(true)}
                label='User Mgt.'
                otherButtons={<Button onClick={addStaffMember} pendingState="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" className="inline-flex gap-2 px-4 py-2 rounded-xl items-center text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200 shadow-sm active:scale-95"><span className="w-4 h-4 flex items-center text-gray-700 justify-center"><AddIcon /></span><span className="hidden text-gray-700 sm:inline">ADD STAFF</span></Button>}
            />

            <div className="flex flex-col gap-6 mt-4 px-4 md:px-10">
                {activeNotifications.length > 0 && (
                    <InfoBoard
                        message={activeNotifications[0].message}
                        type={activeNotifications[0].type}
                        onDismiss={handleDismissNotification}
                    />
                )}

                <UserSummaryCard overview={overview} />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <UserHistoryTable
                        handleSearch={setFilters}
                        page_count={data?.pagination.total_pages ?? 0}
                        currentPage={page}
                        onPageChange={setPage}
                        candidates={data?.results as (MgtItem | MgtItemType)[]?? []}
                        onViewProfile={handleViewProfile}
                        profile={profile}
                        setProfile={setProfile}
                        filters={filters}
                        setFilters={setFilters}
                        hasNext={data?.pagination.has_next}
                        hasPrevious={data?.pagination.has_previous}
                        selectedUsers={selectedUsers}
                        toggleUserSelection={toggleUserSelection}
                        selectAllUsers={selectAllUsers}
                        clearSelection={clearSelection}
                        onBulkNotify={() => setBulkNotificationOpen(true)}
                    />
                </div>
            </div>

            {selectedUserId && (
                <ProfileModal
                    id={selectedUserId}
                    open={profileOpen}
                    close={setProfileOpen}
                    isOwnProfile={false}
                />
            )}

            <ExportModal
                open={exportOpen}
                close={setExportOpen}
                filters={filters}
                currentProfile={profile}
            />

            <BulkNotificationModal
                open={bulkNotificationOpen}
                close={setBulkNotificationOpen}
                selectedUserIds={selectedUsers}
            />

            <ImportModal
                open={importOpen}
                close={setImportOpen}
                defaultType="candidate"
            />
        </div>
    )
}



function UserSummaryCard({ overview }: { overview?: StatOverviewType }) {
    if (!overview) return null;

    return (
        <ResponsiveContainer className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-1">
                <h1 className="text-lg font-bold text-[#101828] tracking-tight">Statistics</h1>
                <h2 className="text-[9px] text-grey-600 font-black px-2 py-0.5 bg-gray-100 rounded uppercase tracking-[0.15em]">Overview</h2>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <UserCard stat={overview?.candidates} header='CANDIDATE DISTRIBUTION' type="candidate" />
                <UserCard stat={overview?.staff} header='STAFF DISTRIBUTION' type="staff" />
            </div>
        </ResponsiveContainer>
    );
}

function UserCard({ header, stat, type }: Readonly<{ header: ReactNode, stat: OverviewType, type: 'staff' | 'candidate' }>) {
    const chartData = [
        { value: stat.active, color: "#039855" }, // success green
        { value: stat.inactive, color: "#D92D20" },  // red
        { value: stat.deactivated, color: "#667085" } // gray
    ];

    return (
        <div className='flex flex-col bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-md group'>
            <div className="flex px-4 py-3 font-black text-[10px] bg-white border-b border-gray-100 text-[#3E4095] tracking-[0.2em] uppercase justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="opacity-70">{type === 'staff' ? <UserManagementIcon className="w-4 h-4" /> : <CandidateIcon className="w-4 h-4" />}</span>
                    <span>{header}</span>
                </div>
                <span className="bg-[#3E4095]/5 px-2 py-0.5 rounded text-[9px]">{stat.registered} TOTAL</span>
            </div>
            <div className="flex p-5 gap-6 justify-between items-center">
                <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <DoughnutChart data={chartData} total={stat.registered} />
                </div>

                <div className="grid md:grid-cols-3 sm:grid-cols-1 flex-1 gap-y-3">
                    <StatItem label="Active" value={stat.active} color="bg-[#039855]" textColor="text-[#039855]" />
                        <StatItem label="Inactive" value={stat.inactive} color="bg-[#D92D20]" textColor="text-[#D92D20]" />
                        <StatItem label="Deactivated" value={stat.deactivated} color="bg-[#667085]" textColor="text-[#667085]" />
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, color, textColor }: { label: string, value: number, color: string, textColor: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
                <span className={clsx("w-2 h-2 rounded-full", color)}></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
            <span className={clsx("text-lg font-black tracking-tight ml-3.5", textColor)}>{value.toLocaleString()}</span>
        </div>
    );
}







function UserHistoryTable({
  candidates,
  onViewProfile,
  currentPage,
  page_count,
  onPageChange,
  handleSearch,
  profile,
  setProfile,
  filters,
  setFilters,
  hasNext,
  hasPrevious,
  pageSize = 20,
  selectedUsers = [],
  toggleUserSelection,
  selectAllUsers,
  clearSelection,
  onBulkNotify,
}: {
  candidates: (MgtItem | MgtItemType)[];
  onViewProfile: (id: string) => void;
  currentPage: number;
  page_count: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  handleSearch: Dispatch<SetStateAction<Record<string, string>>>;
  profile: string;
  setProfile: (profile: string) => void;
  filters: Record<string, string>;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageSize?: number;
  selectedUsers?: string[];
  toggleUserSelection?: (id: string) => void;
  selectAllUsers?: () => void;
  clearSelection?: () => void;
  onBulkNotify?: () => void;
}) {
  const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);

  const currentSort = filters.ordering || '';
  const sortDirection = currentSort.startsWith('-') ? 'desc' : 'asc';
  const sortKey = currentSort.replace('-', '');

  const hasActiveFilters = !!(filters.role || filters.current_class || filters.state || filters.school_name);
  const activeFiltersCount = [filters.role, filters.current_class, filters.state, filters.school_name].filter(Boolean).length;

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onPageChange(1);
  };

  const handleResetFilters = () => {
    setFilters({ profile });
    onPageChange(1);
  };

  const sortOptions = [
    { label: 'First Name (A-Z)', key: 'first_name' },
    { label: 'First Name (Z-A)', key: '-first_name' },
    { label: 'Date Joined (Oldest)', key: 'date_joined' },
    { label: 'Date Joined (Recent)', key: '-date_joined' },
  ];

  const currentSortKey = filters.ordering || '';

  const columns = useMemo(() => {
    const allIds = candidates?.map((u: any) => u.user?.id || u.id) || [];
    const isAllSelected = allIds.length > 0 && allIds.every((id: string) => selectedUsers.includes(id));
    const isPartialSelected = selectedUsers.length > 0 && !isAllSelected;

    const baseColumns = [
      {
        key: "select",
        header: "✓",
        render: (_: any, row: any) => {
          const userId = row.user?.id || row.id;
          return (
            <input
              type="checkbox"
              checked={selectedUsers.includes(userId)}
              onChange={() => toggleUserSelection?.(userId)}
              className="w-4 h-4 rounded border-gray-300 text-[#3E4095] focus:ring-[#3E4095]"
            />
          );
        },
        align: "center" as const,
      },
      {
        key: "sn",
        header: "S/N",
        align: 'center' as const,
        render: (_: any, __: any, index: number) => SNCell((currentPage - 1) * pageSize + index),
      },
    ];

    if (profile === 'candidate') {
      return [
        ...baseColumns,
        {
          key: 'candidate',
          header: 'Candidate',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return (
              <CandidateCell
                info={{ full_name: getUserName(user.first_name, user.last_name), email: user.email }}
                profile_picture={user.profile_picture}
                rank={0}
              />
            );
          },
        },
        {
          key: 'school',
          header: 'School',
          render: (_: any, row: any) => (
            <SchoolCell
               school_name={row.school_name || 'N/A'}
               school_type={('school_type' in row ? row.school_type : undefined)}
            />
          ),
        },
        {
          key: 'class',
          header: 'Class',
          render: (_: any, row: any) => (
            <div className="flex justify-center">
              <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-widest">
                {row.current_class || 'N/A'}
              </span>
            </div>
          ),
          align: 'right' as const,
        },
        {
          key: 'state',
          header: 'State',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return (
              <div className="flex justify-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {user.state || 'N/A'}
                </span>
              </div>
            );
          },
          align: 'center' as const,
        },
        {
          key: 'phone',
          header: 'Phone',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return (
              <div className="text-xs font-medium text-gray-600">
                {user.phone || 'N/A'}
              </div>
            );
          },
        },
        {
          key: 'joined',
          header: 'Joined',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return (
              <div className="text-xs font-bold text-gray-500">
                {user.date_joined ? formatDate(user.date_joined) : 'N/A'}
              </div>
            );
          },
        },
        {
          key: 'status',
          header: 'Status',
          render: (_: any, row: any) => {
            const status = (row.status || 'N/A') as string;
            return (
              <div className={clsx(
                  "inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  status.toLowerCase() === 'active' ? "bg-green-50 text-green-700 border-green-100" :
                  status.toLowerCase() === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
                  "bg-gray-50 text-gray-600 border-gray-100"
              )}>
                  {status}
              </div>
            );
          },
        },
        {
          key: 'action',
          header: 'Action',
          align: 'center' as const,
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return (
              <ViewDetailsButton onClick={() => onViewProfile(user.id)} label="Profile" />
            );
          },
        },
      ];
    } else {
      return [
        ...baseColumns,
        {
          key: 'Name',
          header: 'Full Name',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            const userName = getUserName(user.first_name || '', user.last_name || '');
            const userInitials = getUserInitials(userName);
            const profilePicture = user.profile_picture;

            return (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl relative overflow-hidden bg-[#3E4095]/5 border border-[#3E4095]/10 flex items-center justify-center shrink-0">
                  {profilePicture ? (
                    <Image src={profilePicture} alt={userName} fill className="object-cover" />
                  ) : (
                    <span className="font-black text-xs text-[#3E4095]">{userInitials}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{userName}</span>
                  <span className="text-[9px] font-black text-[#3E4095] uppercase tracking-widest">
                      {row.role || 'STAFF'}
                  </span>
                </div>
              </div>
            );
          },
        },
        {
          key: 'email',
          header: 'Email Address',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return <div className="text-sm font-medium text-gray-600 lowercase">{user.email}</div>;
          },
        },
        {
          key: 'phone',
          header: 'Phone',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return <div className="text-sm font-medium text-gray-600">{user.phone || 'N/A'}</div>;
          },
        },
        {
          key: 'occupation',
          header: 'Occupation',
          render: (_: any, row: any) => (
            <div className="text-sm font-bold text-gray-700 capitalize">
              {row.occupation || 'N/A'}
            </div>
          ),
        },
        {
          key: 'application',
          header: 'Joined',
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return (
              <div className="text-xs font-bold text-gray-500">
                {user.date_joined ? formatDate(user.date_joined) : 'N/A'}
              </div>
            );
          },
        },
        {
          key: 'status',
          header: 'Status',
          render: (_: any, row: any) => {
            const status = (row.status || 'N/A') as string;
            return (
              <div className={clsx(
                  "inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  status.toLowerCase() === 'active' ? "bg-green-50 text-green-700 border-green-100" :
                  "bg-gray-50 text-gray-600 border-gray-100"
              )}>
                  {status}
              </div>
            );
          },
        },
        {
          key: 'Action',
          header: 'Action',
          align: 'right' as const,
          render: (_: any, row: any) => {
            const user = 'user' in row && row.user ? row.user : row;
            return (
              <ViewDetailsButton onClick={() => onViewProfile(user.id)} label="Profile" />
            );
          },
        },
      ];
    }
  }, [candidates, selectedUsers, profile, toggleUserSelection, currentPage, pageSize, onViewProfile]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col p-6 bg-white border-b border-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Users</h2>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5 tracking-wide uppercase">Manage profiles</p>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit">
            <button
                onClick={() => setProfile('candidate')}
                className={clsx("px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    profile === 'candidate' ? "bg-[#3E4095] text-white shadow-md" : "text-gray-500 hover:text-gray-700")}
            >
                Candidates
            </button>
            <button
                onClick={() => setProfile('staff')}
                className={clsx("px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    profile === 'staff' ? "bg-[#3E4095] text-white shadow-md" : "text-gray-500 hover:text-gray-700")}
            >
                Staff Members
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="fas fa-search text-xs"></i>
            </span>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search ..."
              className="w-full bg-gray-50 border border-gray-200 h-11 pl-10 pr-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E4095]/10 focus:border-[#3E4095] transition-all"
            />
          </div>

          {selectedUsers && selectedUsers.length > 0 && (
            <div className="flex gap-2 w-full sm:w-auto">
              <span className="inline-flex items-center justify-center px-3 py-2 bg-[#3E4095]/10 border border-[#3E4095]/20 rounded-xl text-[10px] font-bold text-[#3E4095]">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={() => onBulkNotify?.()}
                className="inline-flex items-center justify-center gap-2 bg-[#3E4095] text-white h-11 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3E4095]/90 transition-all"
              >
                <i className="fas fa-bullhorn text-xs"></i>
                <span>Notify</span>
              </button>
              <button
                onClick={() => clearSelection?.()}
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 h-11 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                <i className="fas fa-times text-xs"></i>
                <span>Clear</span>
              </button>
            </div>
          )}

          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className={clsx(
                  "flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-gray-200 h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                  currentSortKey ? "text-[#3E4095] border-[#3E4095]/40 bg-[#3E4095]/5" : "text-gray-600 hover:bg-gray-50"
                )}>
                  <SortIcon />
                  <span>Sort</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-44 bg-white rounded-2xl p-2 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200" sideOffset={8} align="end">
                  <DropdownMenu.Label className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 mb-1">Sort By</DropdownMenu.Label>
                  {sortOptions.map((option) => (
                    <DropdownMenu.Item
                      key={option.key}
                      onClick={() => setFilters(prev => ({ ...prev, ordering: option.key }))}
                      className={clsx(
                        "px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors flex items-center justify-between",
                        currentSortKey === option.key ? "bg-blue-50 text-[#3E4095]" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <span>{option.label}</span>
                      {currentSortKey === option.key && (
                        <i className="fas fa-check text-[10px]"></i>
                      )}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className={clsx(
                  "flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                  hasActiveFilters
                    ? "border-[#3E4095]/40 text-[#3E4095] bg-[#3E4095]/5"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}>
                  <FilterIcon />
                  <span>Filter</span>
                  {activeFiltersCount > 0 && <span className="ml-1">({activeFiltersCount})</span>}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-55 bg-white rounded-2xl p-3 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200" sideOffset={8} align="end">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</label>
                      <select
                        value={filters.role || ''}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                      >
                        <option value="">All</option>
                        {profile === 'staff' ? (
                          <>
                            <option value="superadmin">Superadmin</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="volunteer">Volunteer</option>
                          </>
                        ) : (
                          <>
                            <option value="winner">Winner</option>
                            <option value="final">Final</option>
                            <option value="league">League</option>
                            <option value="screening">Screening</option>
                          </>
                        )}
                      </select>
                    </div>

                    {profile === 'candidate' && (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Class</label>
                          <select
                            value={filters.current_class || ''}
                            onChange={(e) => handleFilterChange('current_class', e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                          >
                            <option value="">All</option>
                            <option value="SS1">SS1</option>
                            <option value="SS2">SS2</option>
                            <option value="SS3">SS3</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">State</label>
                          <select
                            value={filters.state || ''}
                            onChange={(e) => handleFilterChange('state', e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                          >
                            <option value="">All</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Ogun">Ogun</option>
                            <option value="Rivers">Rivers</option>
                            <option value="Abuja">Abuja</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">School</label>
                          <input
                            type="text"
                            placeholder="Search school..."
                            value={filters.school_name || ''}
                            onChange={(e) => handleFilterChange('school_name', e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                        </div>
                      </>
                    )}

                    <button
                      onClick={handleResetFilters}
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
      </div>

      <div className="p-0 overflow-x-auto">
      <CustomTable
        columns={columns}
        data={candidates}
        footer={
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50">
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
      </div>
    </div>
  );
}
