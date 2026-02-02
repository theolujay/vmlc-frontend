'use client';
import CustomTable from '@/components/ui/CustomTable';
import TablePagination from '@/components/ui/Pagination/TablePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import useListUserMgt from '@/hooks/useListUserMgt';
import usePagination from '@/hooks/usePagination';
import { RegisteredCandidatesType } from '@/types/auth';
import { PreRegisteredCandidate } from '@/types/UserMgtType';
import { formatDate } from '@/utils/formatFileSize';
import { getUserName } from '@/utils/generalUtils';
import { getUserInitials } from '@/utils/capitalizeWords';
// import Link from 'next/link';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ResponsiveContainer from '../../ui/ResponsiveContainer';
import AdminHeader from '../AdminHeader';
import {
  ActiveIcon,
  // AngleIcon,
  // BroadcastIcon,
  FilterIcon,
  // ManageQuestionIcon,
  PreRegisteredIcon,
  RegisteredIcon,
  SortIcon} from '../AdminIcons';
import SendBulkMessageModal from '@/components/Modals/SendBulkMessageModal';
import ProfileModal from '@/components/Modals/ProfileModal';
// import { useAuth } from '@/contexts/AuthProvider';
import useListPreRegisteredCandidates from '@/hooks/useListPreRegisteredCandidates';
import PreRegisteredCandidatesTable from './PreRegisteredTable';
import useGetStatOverview from '@/hooks/useGetStatOverview';
import useGetRegistrationStatus from '@/hooks/useGetRegistrationStatus';
import Countdown from './Countdown';
import RegistrationFunnel from './RegistrationFunnel';
import RegistrationTrends from './RegistrationTrends';
import GeographicsSection from './GeographicsSection';
import InfoBoard from '../../General/Portal/DashboardParts/InfoBoard';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';

// function shouldShowHeaderButtons(role: string): boolean {
//   switch (role) {
//     case 'sponsor':
//     case 'volunteer':
//     case 'moderator':
//     case 'admin':
//       return false;

//     case 'manager':
//     case 'superadmin':
//       return true;

//     default:
//       return false;
//   }
// }

export default function OverviewSection() {
  // const { authState } = useAuth();
  const user = useGetCurrentUser();
  const userRole = user?.profile?.role;
  const isVolunteer = userRole === 'volunteer';

  const { page, setPage } = usePagination();
  const [open, setOpen] = useState(false);
  const [showPreRegistered, setShowPreRegistered] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isOwnProfileOpen, setIsOwnProfileOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | undefined>(undefined);
  
  const [filters, setFilters] = useState<Record<string, string>>({
    search: '',
    profile: 'candidate',
  });

  useEffect(() => {
    if (user && user.profile && user.profile.is_setup_complete === false) {
      setInfoMessage("Your profile is incomplete. Please update your profile to ensure you don't miss any important updates.");
    }
  }, [user]);

  const { data } = useListUserMgt(page, filters, !isVolunteer && !showPreRegistered);
  const { data: preRegisteredData } = useListPreRegisteredCandidates(page, filters, !isVolunteer && showPreRegistered);
  const { data: statOverview } = useGetStatOverview();
  const { data: registrationStatus } = useGetRegistrationStatus();
  
  const handleViewProfile = (id: string) => {
    setSelectedUserId(id);
    setProfileOpen(true);
  };

  return (
    <div className="flex flex-col gap-1">
      <AdminHeader
        label="Overview"
        actionButton={
          <Countdown 
            targetDate={registrationStatus?.candidate_registration?.closing_date || ''} 
            isOpen={registrationStatus?.candidate_registration?.is_open}
            label="Reg. Closes in:"
          />
        }
      />
      <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto">
        {infoMessage && (
          <InfoBoard 
            message={infoMessage}
            onDismiss={() => setInfoMessage(undefined)}
            actionLabel="Update Profile"
            onAction={() => setIsOwnProfileOpen(true)}
          />
        )}
        <OverviewSummaryCard
          once_logged_in={statOverview?.candidates?.once_logged_in ?? 0}
          activeChange={statOverview?.candidates?.active_change}
          preRegisteredStudents={statOverview?.candidates?.pre_registered ?? 0}
          preRegisteredChange={statOverview?.candidates?.pre_registered_change}
          registeredStudents={statOverview?.candidates?.registered ?? 0}
          registeredChange={statOverview?.candidates?.registered_change}
        />
        <RegistrationTrends />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RegistrationFunnel 
            funnel={statOverview?.funnel?.candidate}
          />
          <GeographicsSection 
            data={statOverview?.geographics?.candidate}
            title="Candidate Geographics"
            subtitle="Distribution of candidates by state"
          />
        </div>
        
        {/* <QuickActionsCard /> */}

        {!isVolunteer && (
          showPreRegistered ? (
            <PreRegisteredCandidatesTable
              page_count={preRegisteredData?.pagination.total_pages ?? 0}
              currentPage={page}
              onPageChange={setPage}
              handleSearch={setFilters}
              candidates={preRegisteredData?.results as PreRegisteredCandidate[] ?? []}
              setFilters={setFilters}
              showPreRegistered={showPreRegistered}
              setShowPreRegistered={setShowPreRegistered}
            />
          ) : (
            <RegisteredCandidatesTable
              handleSearch={setFilters}
              page_count={data?.pagination.total_pages ?? 0}
              currentPage={page}
              onPageChange={setPage}
              data={(data?.results as RegisteredCandidatesType[]) ?? []}
              onViewProfile={handleViewProfile}
              filters={filters}
              setFilters={setFilters}
              showPreRegistered={showPreRegistered}
              setShowPreRegistered={setShowPreRegistered}
              setPage={setPage}
            />
          )
        )}
      </div>
      <SendBulkMessageModal open={open} close={setOpen} />
      {selectedUserId && (
        <ProfileModal 
          id={selectedUserId} 
          open={profileOpen} 
          close={setProfileOpen} 
          isOwnProfile={false}
        />
      )}
      {user && (
        <ProfileModal 
          id={user.profile.user.id}
          open={isOwnProfileOpen}
          close={setIsOwnProfileOpen}
          isOwnProfile={true}
        />
      )}
    </div>
  );
}

function RegisteredCandidatesTable({
  data,
  onPageChange,
  currentPage,
  page_count,
  handleSearch,
  onViewProfile,
  filters,
  setFilters,
  showPreRegistered,
  setShowPreRegistered,
  setPage,
}: Readonly<{
  data: RegisteredCandidatesType[];
  handleSearch: Dispatch<SetStateAction<Record<string, string>>>;
  onPageChange: Dispatch<SetStateAction<number>>;
  currentPage: number;
  page_count: number;
  onViewProfile: (id: string) => void;
  filters: Record<string, string>;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  showPreRegistered: boolean;
  setShowPreRegistered: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
}>) {
  const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);

  const handleSort = (sortKey: string) => {
    setFilters(prev => ({ ...prev, ordering: sortKey }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onPageChange(1);
  };

  return (
    <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col w-full mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 px-1 sm:px-3">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-lg sm:text-xl">Registered Candidates</h2>
            {/* <p className="text-sm text-gray-600">List of users fully registered as candidates</p> */}
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
                  <DropdownMenu.Item onClick={() => handleSort('first_name')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">First Name (A-Z)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-first_name')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">First Name (Z-A)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('last_name')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Last Name (A-Z)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-last_name')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Last Name (Z-A)</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('-date_joined')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Newest First</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleSort('date_joined')} className="px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:bg-gray-100 rounded">Oldest First</DropdownMenu.Item>
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
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                      <select 
                        value={filters.role || ''} 
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="border rounded px-2 py-1.5 text-sm outline-none"
                      >
                        <option value="">All Roles</option>
                        <option value="screening">Screening</option>
                        <option value="league">League</option>
                        <option value="final">Final</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                      <select 
                        value={filters.current_class || ''} 
                        onChange={(e) => handleFilterChange('current_class', e.target.value)}
                        className="border rounded px-2 py-1.5 text-sm outline-none"
                      >
                        <option value="">All Classes</option>
                        <option value="SS1">SS 1</option>
                        <option value="SS2">SS 2</option>
                        <option value="SS3">SS 3</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">School Type</label>
                      <select 
                        value={filters.school_type || ''} 
                        onChange={(e) => handleFilterChange('school_type', e.target.value)}
                        className="border rounded px-2 py-1.5 text-sm outline-none"
                      >
                        <option value="">All Types</option>
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="tertiary">Tertiary</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setFilters({ profile: 'candidate' });
                        onPageChange(1);
                      }}
                      className="mt-2 text-xs text-red-600 font-semibold hover:underline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <div className="flex bg-[#F2F4F7] p-1 rounded-lg ml-4">
              <button 
                  onClick={() => {
                    setShowPreRegistered(false);
                    setFilters({ profile: 'candidate' });
                    setPage(1);
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
                    setPage(1);
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
        data={data}
        minWidth="1100px"
        columns={[
          // {
          //   key: 'S/N',
          //   header: 'S/N',
          //   align: 'center',
          //   render: (_, __, index) => (
          //     <div className="py-2">
          //       {index + 1}
          //     </div>
          //   ),
          // },
          {
            key: 'Name',
            header: 'Name',
            render: (_, row) => {
              const userName = getUserName(
                row.user.first_name,
                row.user.last_name
              );
              const userInitials = getUserInitials(userName);
              
              return (
                <div className="flex items-center gap-2">
                  <div className="w-[35px] h-[35px] rounded-full relative overflow-hidden bg-[#CCEEFB] flex items-center justify-center shrink-0">
                    {row.user.profile_picture ? (
                      <Image 
                        src={row.user.profile_picture} 
                        alt={userName} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-xs">{userInitials}</span>
                    )}
                  </div>
                  <div className="font-medium text-gray-900">{userName}</div>
                </div>
              );
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
            render: (_, row) => <div title={row.school_name || ''}>{row.school_name}</div>
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
              return (
                <button 
                  onClick={() => onViewProfile(row.user.id)}
                  className="text-[#3E4095] font-bold hover:underline px-3 text-sm cursor-pointer"
                >
                  View
                </button>
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

// function QuickActionsCard() {
//   return (
//     <ResponsiveContainer className="flex w-full gap-3 sm:gap-4 p-3 sm:p-4 flex-col mx-auto">
//       <h2 className="text-lg sm:text-xl font-bold">Quick Actions</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Link
//           href="/admin/overview?tab=Exam+Console&page=1"
//           className="flex justify-between items-center p-4 rounded-xl border border-[#3E4095]/10 hover:bg-[#3E4095]/5 transition-all group"
//         >
//           <div className="flex gap-3 items-center">
//             <span className="flex-shrink-0">
//               <ManageQuestionIcon />
//             </span>
//             <p className="text-m text-gray-700 tracking-tight">Explore Questions</p>
//           </div>
//           <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
//             <AngleIcon />
//           </span>
//         </Link>
//         <Link
//           href="/admin/overview?tab=Competition"
//           className="flex justify-between items-center p-4 rounded-xl border border-[#3E4095]/10 hover:bg-[#3E4095]/5 transition-all group"
//         >
//           <div className="flex gap-3 items-center">
//             <span className="flex-shrink-0">
//               <ViewLeaderBoardIcon />
//             </span>
//             <p className="text-m text-gray-700 tracking-tight">View Leaderboard</p>
//           </div>
//           <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
//             <AngleIcon />
//           </span>
//         </Link>
//         <Link
//           href="/admin/overview?tab=Announcements"
//           className="flex justify-between items-center p-4 rounded-xl border border-[#3E4095]/10 hover:bg-[#3E4095]/5 transition-all group"
//         >
//           <div className="flex gap-3 items-center">
//             <span className="flex-shrink-0">
//               <BroadcastIcon />
//             </span>
//             <p className="text-m text-gray-700 tracking-tight">Manage Broadcast</p>
//           </div>
//           <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
//             <AngleIcon />
//           </span>
//         </Link>
//       </div>
//     </ResponsiveContainer>
//   );
// }

function OverviewSummaryCard({
  registeredStudents,
  preRegisteredStudents,
  once_logged_in,
  registeredChange,
  preRegisteredChange,
  activeChange,
}: {
  registeredStudents: number;
  preRegisteredStudents: number;
  once_logged_in: number;
  registeredChange?: string;
  preRegisteredChange?: string;
  activeChange?: string;
}) {
  const stats = [
    {
      icon: <RegisteredIcon />,
      label: 'REGISTERED CANDIDATES',
      value: registeredStudents,
      change: registeredChange
    },
    {
      icon: <ActiveIcon />,
      label: 'HOW MANY LOGGED IN',
      value: once_logged_in,
      change: activeChange
    },
    {
      icon: <PreRegisteredIcon />,
      label: 'PRE-REGISTERED CANDIDATES',
      value: preRegisteredStudents,
      change: preRegisteredChange
    },
  ];

  return (
    <ResponsiveContainer className="flex gap-3 sm:gap-4 px-2 sm:px-3 flex-col mx-auto justify-between font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none sm:items-center"
          >
            {/* Header: Icon & Label */}
            <div className="flex gap-2 items-center">
              {/* <span className="flex-shrink-0">{stat.icon}</span> */}
              <p className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
                {stat.label}
              </p>
            </div>

            {/* Value & Change */}
            <div className="flex gap-3 justify-between items-center sm:flex-col sm:gap-1">
              <div className="font-bold text-xl sm:text-2xl">
                {stat.value}
              </div>
              {typeof stat.change === 'string' && stat.change && (
                <div className="flex">
                  <span className={`text-xs ${stat.change.startsWith('-') ? 'text-red-500' : 'text-[#0F973D]'}`}>
                    {stat.change}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ResponsiveContainer>
  );
}
