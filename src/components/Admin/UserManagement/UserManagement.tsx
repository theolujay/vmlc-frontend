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
import { FilterIcon, SortIcon } from '../AdminIcons'
import { DoughnutChart } from '../Charts/ProgressRing'
import ProfileModal from '@/components/Modals/ProfileModal'
import { useState, Dispatch, SetStateAction } from 'react'
import usePagination from '@/hooks/usePagination'
import TablePagination from '@/components/ui/Pagination/TablePagination'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'

export default function UserManagement() {
    const pathName = usePathname();
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const { page, setPage } = usePagination();
    const [filters, setFilters] = useState<Record<string, string>>({ profile: 'staff' });
    
    const { data } = useListUserMgt(page, filters)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    
    const profile = filters.profile || 'staff';

    const setProfile = (newProfile: string) => {
        setFilters({ profile: newProfile });
        setPage(1);
    };

    const overview = data?.stats_overview;

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

    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport label='Exams & Questions' actionButton={<Button onClick={addStaffMember} className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD STAFF</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

                <UserSummaryCard overview={overview} />
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
                />
            </div>

            {selectedUserId && (
                <ProfileModal 
                    id={selectedUserId} 
                    open={profileOpen} 
                    close={setProfileOpen} 
                    isOwnProfile={false}
                />
            )}
        </div>
    )
}



function UserSummaryCard({ overview }: { overview?: StatOverviewType }) {
    if (!overview) return null;

    return <ResponsiveContainer className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <UserCard stat={overview?.staff} header='TOTAL STAFFS' />
        <UserCard stat={overview?.candidates} header='TOTAL STUDENTS' />
    </ResponsiveContainer>
}












// const chartData = [
//     { value: 30, color: "#0088cc" }, // blue
//     { value: 12, color: "#f4a300" }, // orange
//     { value: 4, color: "#e04c4c" },  // red
// ];











function UserCard({ header, stat }: Readonly<{ header: ReactNode, stat: OverviewType }>) {
    // if (!stat) {
        
    //     return <Spinner />
    // }
    const chartData = [
        { value: stat.active, color: "#0088cc" }, // blue
        { value: stat.pre_registered, color: "#f4a300" }, // orange
        { value: stat.inactive, color: "#e04c4c" },  // red
        // {value:stat.deactivated,color:'#d4107'}

        {value:stat.deactivated,color:'#000'}
        
    ];


    


    return <div className='flex flex-col gap-2 rounded-2xl border-[#E4E7EC] border'>
        <div className="flex header p-2 font-bold bg-[#F7F9FC]  rounded-tr-2xl rounded-tl-2xl">
            {header}
        </div>
        <div className="flex px-3 gap-3 pb-2 justify-between items-center">
            {/* <DoughnutChart /> */}
            <div className="flex">
                <DoughnutChart data={chartData} total={stat.registered} />
                {/* <ProgressRing/> */}
            </div>
            <div className="flex-1 gap-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#01ACEA] h-3"></span>
                        <span>Active</span>

                    </div>
                    <span>{stat.active}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#F3A218] h-3"></span>
                        <span>Pending</span>

                    </div>
                    <span>{stat.pre_registered}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#DD524D] h-3"></span>
                        <span>Inactive</span>

                    </div>
                    <span>{stat.inactive}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#000] h-3"></span>
                        <span>Deactivated</span>

                    </div>
                    <span>{stat.deactivated}</span>
                </div>
            </div>
        </div>
    </div>
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
}) {
  const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);

  const handleSort = (sortKey: string) => {
    setFilters(prev => ({ ...prev, ordering: sortKey }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onPageChange(1);
  };

  return (
    <ResponsiveContainer className="flex gap-4 py-3 px-0 flex-col mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 px-1 sm:px-3">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-lg sm:text-xl">Portal Users</h2>
            {/* <p className="text-sm text-gray-600">
              List of candidate and staff users on the portal
            </p> */}
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
                <button className="inline-flex items-center justify-center gap-2 border rounded-md h-10 px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none">
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
                <button className="inline-flex items-center justify-center gap-2 border rounded-md h-10 px-3 py-1 border-[#E4E7EC] cursor-pointer flex-1 sm:flex-none">
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
                        {profile === 'staff' ? (
                          <>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="volunteer">Volunteer</option>
                          </>
                        ) : (
                          <>
                            <option value="screening">Screening</option>
                            <option value="league">League</option>
                            <option value="final">Final</option>
                          </>
                        )}
                      </select>
                    </div>

                    {profile === 'candidate' && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                          <select 
                            value={filters.current_class || ''} 
                            onChange={(e) => handleFilterChange('current_class', e.target.value)}
                            className="border rounded px-2 py-1.5 text-sm outline-none"
                          >
                            <option value="">All Classes</option>
                            <option value="SS1">SS1</option>
                            <option value="SS2">SS2</option>
                            <option value="SS3">SS3</option>
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
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      </>
                    )}
                    
                    <button 
                      onClick={() => {
                        setFilters({ profile });
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
                  onClick={() => setProfile('staff')}
                  className={clsx("px-4 py-1.5 text-xs font-medium rounded-md transition-all", 
                      profile === 'staff' ? "bg-white shadow-sm text-[#344054]" : "text-[#667085] hover:text-[#344054]")}
              >
                  Staff
              </button>
              <button 
                  onClick={() => setProfile('candidate')}
                  className={clsx("px-4 py-1.5 text-xs font-medium rounded-md transition-all", 
                      profile === 'candidate' ? "bg-white shadow-sm text-[#344054]" : "text-[#667085] hover:text-[#344054]")}
              >
                  Candidates
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomTable
        columns={[
          {
            key: 'Name',
            header: 'Name',
            render: (_, row) => {
              const user =
                'user' in row && row.user ? row.user : (row as MgtItemType);
              const userName = getUserName(
                user.first_name || '',
                user.last_name || ''
              );
              const userInitials = getUserInitials(userName);
              const profilePicture =
                'user' in row && row.user
                  ? row.user.profile_picture
                  : (row as MgtItemType).profile_picture;

              return (
                <div className="flex items-center gap-2">
                  <div className="w-[35px] h-[35px] rounded-full relative overflow-hidden bg-[#CCEEFB] flex items-center justify-center shrink-0">
                    {profilePicture ? (
                      <Image
                        src={profilePicture}
                        alt={userName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-xs">
                        {userInitials}
                      </span>
                    )}
                  </div>
                  <span>{userName}</span>
                </div>
              );
            },
          },
          {
            key: 'email',
            header: 'Email Address',
            render: (_, row) => {
              const email =
                'user' in row && row.user
                  ? row.user.email
                  : (row as MgtItemType).email;
              return <div className="flex items-center gap-1">{email}</div>;
            },
          },
          {
            key: profile === 'staff' ? 'occupation' : 'current_class',
            header: profile === 'staff' ? 'Occupation' : 'Class',
            render: (_, row) => (
              <div className="flex capitalize items-center gap-1">
                {profile === 'staff' 
                  ? ('occupation' in row ? (row.occupation || 'N/A') : 'N/A')
                  : ('current_class' in row ? (row.current_class || 'N/A') : 'N/A')
                }
              </div>
            ),
          },
          {
            key: 'role',
            header: 'Role',
            render: (_, row) => (
              <div className="flex capitalize items-center gap-1">
                {'role' in row ? row.role : 'N/A'}
              </div>
            ),
          },
          {
            key: 'application',
            header: 'Joined',
            render: (_, row) => {
              const dateJoined =
                'user' in row && row.user
                  ? row.user.date_joined
                  : (row as MgtItemType).date_joined;
              return (
                <div className="flex  items-center gap-1">
                  {dateJoined ? formatDate(dateJoined) : 'N/A'}
                </div>
              );
            },
          },
          {
            key: 'status',
            header: 'Status',
            render: (_, row) => (
              <div className="flex capitalize items-center gap-1">
                {'status' in row ? row.status : 'N/A'}
              </div>
            ),
          },
          {
            key: 'Action',
            header: 'Detail',
            align: 'right',
            render: (_, row) => {
              const id =
                'user' in row && row.user ? row.user.id : (row as MgtItemType).id;
              return (
                <button
                  onClick={() => onViewProfile(id)}
                  className="text-[#3E4095] font-bold hover:underline px-3 text-sm cursor-pointer"
                >
                  View
                </button>
              );
            },
          },
        ]}
        data={candidates}
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