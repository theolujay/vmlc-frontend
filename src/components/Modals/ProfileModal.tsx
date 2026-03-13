"use client"
import React, { useState, useEffect, useMemo } from "react"
import AppDialog from "@/components/ui/Modals/AppDialog"
import useGetAccountDetails from "@/hooks/useGetAccountDetails"
import useGetCandidateDetails from "@/hooks/useGetCandidateDetails"
import useUpdateProfile from "@/hooks/useUpdateProfile"
import Spinner from "@/components/ui/spinner/spinner"
import { getUserName } from "@/utils/generalUtils"
import { formatDate } from "@/utils/formatFileSize"
import { AverageIcon, LeaderBoardSummaryIcon, SubmittedDocumentIcon, ViewArrow } from "@/components/General/GeneralIcon"
import { ActivitiesIcon, ScoresIcon, ActionsIcon } from "@/components/Admin/AdminIcons"
import Link from "next/link"
import Image from "next/image"
import CustomTable from "@/components/ui/CustomTable"
import EmptySession from "@/components/Admin/EmptySession"
import { ExamTakenType, RecordsType } from "@/types/CandidateType"
import { type UserProfileType } from "@/types/UserMgtType"
import { useForm, type UseFormRegister } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"

type TabType = 'Profile' | 'Activities' | 'Scores' | 'Actions'

type ProfileFormData = {
  first_name: string
  last_name: string
  phone: string
  state: string
  occupation: string
  school_name: string
  school_type: string
  current_class: string
  cowrywise_kid_username: string
  profile_picture?: FileList
}

const STATES = ['Lagos', 'Abuja', 'Ogun', 'Rivers']
const SCHOOL_TYPES = ['public', 'private']
const CURRENT_CLASSES = ['SS1', 'SS2', 'SS3']

export default function ProfileModal({
  id,
  open,
  close,
  isOwnProfile = false,
}: Readonly<{ id: string; open: boolean; close: (open: boolean) => void; isOwnProfile?: boolean }>) {
  const [activeTab, setActiveTab] = useState<TabType>('Profile')
  const [isEditing, setIsEditing] = useState(false)

  const { authState, dispatch } = useAuth()
  const { data: otherAccountData, isPending: otherAccountPending } = useGetAccountDetails(id, !isOwnProfile && !!id)

  const accountData = useMemo(() => {
    if (isOwnProfile) {
      return authState?.profile ? { profile: authState.profile } : null
    }
    return otherAccountData
  }, [isOwnProfile, authState?.profile, otherAccountData])

  const accountPending = !isOwnProfile && otherAccountPending

  const isCandidate = accountData?.profile?.profile_type === 'candidate'

  const { data: candidateData, isPending: candidatePending } = useGetCandidateDetails(id, !isOwnProfile && !!isCandidate && !!id)
  const { mutate: updateProfile, isPending: updatePending } = useUpdateProfile()

  const isPending = accountPending || (!isOwnProfile && isCandidate && candidatePending)

  const { register, handleSubmit, reset } = useForm<ProfileFormData>()

  useEffect(() => {
    if (accountData?.profile) {
      reset({
        first_name: accountData.profile.user.first_name,
        last_name: accountData.profile.user.last_name,
        phone: accountData.profile.user.phone,
        state: accountData.profile.user.state,
        occupation: accountData.profile.occupation || '',
        school_name: accountData.profile.school_name || '',
        school_type: accountData.profile.school_type || '',
        current_class: accountData.profile.current_class || '',
        cowrywise_kid_username: accountData.profile.cowrywise_kid_profile?.username || '',
      })
    }
  }, [accountData, reset])

  function handleClose() {
    close(false)
    setIsEditing(false)
    setActiveTab('Profile')
  }

  const onSave = (data: ProfileFormData) => {
    const formData = new FormData()

    // Add user fields
    formData.append('user[first_name]', data.first_name)
    formData.append('user[last_name]', data.last_name)
    formData.append('user[phone]', data.phone)
    formData.append('user[state]', data.state)

    // Add profile fields
    if (isCandidate) {
      formData.append('profile[school_name]', data.school_name)
      formData.append('profile[school_type]', data.school_type)
      formData.append('profile[current_class]', data.current_class)
      formData.append('profile[cowrywise_kid_profile][username]', data.cowrywise_kid_username)
    } else {
      formData.append('profile[occupation]', data.occupation)
    }

    // Add profile picture if selected
    if (data.profile_picture?.[0]) {
      formData.append('user[profile_picture]', data.profile_picture[0])
    }

    updateProfile(formData, {
      onSuccess: (data: { message: string, profile: UserProfileType }) => {
        setIsEditing(false)
        if (isOwnProfile) {
          dispatch({ type: 'updateProfile', payload: data.profile })
        }
      }
    })
  }

  const profile = accountData?.profile
  const user = profile?.user
  const userName = user ? getUserName(user.first_name, user.last_name) : ""

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'Profile', label: 'Profile', icon: <i className="fas fa-user-circle"></i> },
  ]

  if (!isOwnProfile) {
    if (isCandidate) {
      tabs.push({ id: 'Activities', label: 'Activities', icon: <ActivitiesIcon /> })
      tabs.push({ id: 'Scores', label: 'Scores', icon: <ScoresIcon /> })
    } else {
      tabs.push({ id: 'Actions', label: 'Actions', icon: <ActionsIcon /> })
    }
  }

  return (
    <AppDialog open={open} className="!max-w-5xl !w-auto !p-0 bg-transparent shadow-none">
      <div className="flex flex-col bg-[#F7F9FC] w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-[85vh] rounded-2xl overflow-hidden shadow-2xl relative font-sans">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-[#3E4095]/10 flex items-center justify-center text-[#3E4095] font-bold text-xl overflow-hidden relative">
                {user?.profile_picture ? (
                    <Image src={user.profile_picture} alt={userName} fill sizes="48px" className="object-cover" />
                ) : (
                    <span>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
                )}
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">{userName || 'User Profile'}</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {profile?.profile_type || 'Loading...'} Account • Joined {user?.date_joined ? formatDate(user.date_joined) : 'N/A'}
                </p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            {tabs.length > 1 && (
              <div className="hidden md:flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                  {tabs.map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                              activeTab === tab.id
                              ? 'bg-white text-[#3E4095] shadow-sm ring-1 ring-black/5'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                          {tab.icon}
                          <span>{tab.label}</span>
                      </button>
                  ))}
              </div>
            )}
            <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {isPending ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : !profile ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
               <i className="fas fa-user-slash text-4xl opacity-20"></i>
               <p className="font-bold uppercase text-xs tracking-widest">Profile not found</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSave)} className="p-8">
              {activeTab === 'Profile' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Personal Info Grid */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Personal Information</h3>
                            <div className="flex items-center gap-3">
                                {isOwnProfile && !isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline cursor-pointer"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${profile.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {profile.is_active ? 'Active Account' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            {isEditing ? (
                                <>
                                    <EditInfoItem label="First Name" name="first_name" register={register} disabled={!!user?.first_name} />
                                    <EditInfoItem label="Last Name" name="last_name" register={register} disabled={!!user?.last_name} />
                                    <EditInfoItem label="Phone Number" name="phone" register={register} disabled={false} />
                                    <EditInfoItem
                                        label="State"
                                        name="state"
                                        register={register}
                                        disabled={!!user?.state}
                                        options={isCandidate ? STATES : undefined}
                                    />
                                    {isCandidate ? (
                                        <>
                                            <EditInfoItem label="School Name" name="school_name" register={register} disabled={!!profile?.school_name} />
                                            <EditInfoItem
                                                label="School Type"
                                                name="school_type"
                                                register={register}
                                                disabled={!!profile?.school_type}
                                                options={SCHOOL_TYPES}
                                            />
                                            <EditInfoItem
                                                label="Current Class"
                                                name="current_class"
                                                register={register}
                                                disabled={!!profile?.current_class}
                                                options={CURRENT_CLASSES}
                                            />
                                            <EditInfoItem
                                                label="Cowrywise Kid username"
                                                name="cowrywise_kid_username"
                                                register={register}
                                                disabled={profile?.current_stage === "league"}
                                            />
                                        </>
                                    ) : (
                                        <EditInfoItem label="Occupation" name="occupation" register={register} disabled={!!profile?.occupation} />
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-gray-400">{user?.email}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <InfoItem label="Full Name" value={userName} />
                                    <InfoItem label="Email Address" value={user?.email || 'N/A'} />
                                    <InfoItem
                                        label="Phone Number"
                                        value={user?.phone || 'Not provided'}
                                        onEdit={isOwnProfile ? () => setIsEditing(true) : undefined}
                                    />
                                    <InfoItem label="Location / State" value={user?.state || 'Not Specified'} />
                                    <InfoItem label="Date Joined" value={user?.date_joined ? formatDate(user.date_joined) : 'N/A'} />
                                    {isCandidate ? (
                                        <>
                                            <InfoItem label="School Name" value={profile.school_name || 'Not provided'} />
                                            <InfoItem label="School Type" value={profile.school_type || 'Not provided'} />
                                            <InfoItem label="Current Class" value={profile.current_class || 'Not specified'} />
                                            <InfoItem label="Current Competition Stage" value={profile.current_stage?.slice(4) ?? 'Unavailable'} />
                                            <InfoItem
                                                label="Cowrywise Kid username"
                                                value={profile.cowrywise_kid_profile?.username || 'Not Specified'}
                                                onEdit={isOwnProfile && profile.current_stage !== "league" ? () => setIsEditing(true) : undefined}
                                            />
                                        </>
                                    ) : (
                                        <InfoItem label="Occupation" value={profile.occupation || 'Not Specified'} />
                                    )}
                                </>
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false)
                                        reset()
                                    }}
                                    className="px-6 py-2 rounded-xl border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatePending}
                                    className="px-8 py-2 rounded-xl bg-[#3E4095] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                                >
                                    {updatePending ? <Spinner className="!w-3 !h-3 !border-2" /> : <i className="fas fa-check"></i>}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-[#3E4095] to-[#01ACEA] shadow-xl shadow-[#3E4095]/20 group">
                        <div className="bg-white rounded-[22px] p-8 h-full flex flex-col items-center justify-center gap-6 relative overflow-hidden">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl bg-gray-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#3E4095] text-4xl font-black relative">
                                    {user?.profile_picture ? (
                                        <Image src={user.profile_picture} alt={userName} fill sizes="128px" className="object-cover" />
                                    ) : (
                                        <span>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#3E4095] text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#2e3075] transition-colors z-20">
                                        <i className="fas fa-camera text-sm"></i>
                                        <input type="file" className="hidden" {...register('profile_picture')} accept="image/*" />
                                    </label>
                                )}
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Account Role</p>
                                <p className="text-lg font-black text-gray-800 uppercase tracking-tight">{profile.role || 'Member'}</p>
                            </div>
                        </div>
                    </div>
                  </section>

                  {/* Assets Section */}
                  {!isEditing && (
                    <section className="space-y-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] px-2">Verification Assets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DocumentCard label="Verification Doc" url={profile.verification_document} type={profile.verification_document_type || "Supporting Evidence"} />
                        </div>
                    </section>
                  )}
                </div>
              )}

              {activeTab === 'Activities' && isCandidate && !isOwnProfile && (
                <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <ActivityComponent results={candidateData?.records?.performance?.exams_taken ?? []} />
                </div>
              )}

              {activeTab === 'Scores' && isCandidate && !isOwnProfile && (
                <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <ScoreComponent scoresData={candidateData?.records as RecordsType} />
                </div>
              )}

              {activeTab === 'Actions' && !isCandidate && !isOwnProfile && (
                <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <ActionsComponent />
                </div>
              )}
            </form>
          )}
        </div>

        {/* Mobile Tab Navigation */}
        {tabs.length > 1 && (
          <div className="md:hidden grid grid-cols-4 border-t border-gray-200 bg-white">
              {tabs.map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center py-4 gap-1 transition-all ${
                          activeTab === tab.id ? 'text-[#3E4095] bg-[#3E4095]/5' : 'text-gray-400'
                      }`}
                  >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
                  </button>
              ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </AppDialog>
  )
}

function InfoItem({ label, value, onEdit }: { label: string, value: string, onEdit?: () => void }) {
  return (
    <div className="flex items-start justify-between group/info">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-800 break-words">{value}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="p-2 text-[#3E4095] group-hover/info:scale-130 transition-all cursor-pointer"
          title={`Edit ${label}`}
        >
          <i className="fas fa-pen text-[10px]"></i>
        </button>
      )}
    </div>
  )
}

function EditInfoItem({ label, name, register, disabled = false, options }: { label: string, name: keyof ProfileFormData, register: UseFormRegister<ProfileFormData>, disabled?: boolean, options?: string[] }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-[#3E4095] uppercase tracking-widest">{label}</label>
      {options ? (
        <select
          {...register(name)}
          disabled={disabled}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#3E4095]/10 focus:border-[#3E4095] outline-none transition-all ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          {...register(name)}
          disabled={disabled}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#3E4095]/10 focus:border-[#3E4095] outline-none transition-all ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
        />
      )}
    </div>
  )
}

function DocumentCard({ label, url, type, isImage }: { label: string, url: string | null, type: string, isImage?: boolean }) {
    if (!url) {
      return (
        <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 opacity-60">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
             <i className="fas fa-file-excel text-xl"></i>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{label}</p>
            <p className="text-[9px] text-gray-300 font-bold uppercase">Missing</p>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-6">
            <div className="space-y-3">
                {isImage ? (
                    <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 p-1 relative">
                        <Image src={url} alt={label} fill sizes="48px" className="object-cover rounded-lg" />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#3E4095]/5 text-[#3E4095] flex items-center justify-center text-xl">
                        <SubmittedDocumentIcon />
                    </div>
                )}
                <div>
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-tight">{label}</p>
                    <p className="text-[9px] text-gray-400 font-medium">{type}</p>
                </div>
            </div>
        </div>
        <Link
          href={url}
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-50 text-[#3E4095] text-[10px] font-black uppercase tracking-widest hover:bg-[#3E4095] hover:text-white transition-all group-hover:shadow-sm"
        >
          <span>View Asset</span>
          <ViewArrow />
        </Link>
      </div>
    )
}

function ActivityComponent({ results }: Readonly<{ results: ExamTakenType[] }>) {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Exam History</h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Record of all exams attempted on the platform</p>
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-wider">
                    {results.length} Total Attempts
                </div>
            </div>
            {results.length > 0 ? (
                <CustomTable
                    columns={[
                        {
                            key: 'Exam', header: 'Exam Title', render: (_, row) => (
                                <div className="font-bold text-gray-800">{row.exam_title}</div>
                            )
                        },
                        {
                            key: 'Stage', header: 'Stage', render: (_, row) => (
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                    {row.exam_stage}
                                </span>
                            )
                        },
                        {
                            key: 'Score', header: 'Performance', render: (_, row) => (
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#3E4095]" style={{ width: `${row.score}%` }}></div>
                                    </div>
                                    <span className="font-black text-sm text-gray-700">{row.score}%</span>
                                </div>
                            )
                        },
                        {
                            key: 'Date', header: 'Date Taken', render: (_, row) => (
                                <div className="text-xs text-gray-500">{formatDate(row.recorded_at)}</div>
                            )
                        },
                    ]}
                    data={results}
                />
            ) : (
                <div className="p-20">
                    <EmptySession desc="When this user takes an exam, the results will appear here." label="No Exams Taken Yet" />
                </div>
            )}
        </div>
    )
}

function ScoreComponent({ scoresData }: { scoresData: RecordsType }) {
    if (!scoresData?.performance?.stats) return null;
    const stats = scoresData.performance.stats;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#3E4095] rounded-3xl p-8 text-white shadow-xl shadow-[#3E4095]/20">
                    <div className="flex items-center gap-3 mb-6">
                        <AverageIcon className="text-white/60" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Average Performance</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black">{stats.average_score}%</span>
                        <span className={`text-xs font-bold ${stats.average_score >= 50 ? 'text-green-300' : 'text-amber-300'}`}>
                            {stats.average_score >= 50 ? 'Good Standing' : 'Needs Improvement'}
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <LeaderBoardSummaryIcon className="text-[#3E4095]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Leaderboard Position</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-gray-800">
                            #{stats.leaderboard_ranking?.current_rank || '--'}
                        </span>
                        <span className="text-xs font-bold text-gray-400">
                            out of {stats.leaderboard_ranking?.total_candidates || '--'} candidates
                        </span>
                    </div>
                </div>
            </div>



            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatMiniCard label="Exams Taken" value={stats.total_exams_taken} />
                <StatMiniCard label="Highest Score" value={`${stats.highest_score}%`} color="text-green-600" />
                <StatMiniCard label="Lowest Score" value={`${stats.lowest_score}%`} color="text-amber-600" />
                <StatMiniCard label="Avg Score" value={`${stats.average_score}%`} />
            </div>
        </div>
    )
}

function StatMiniCard({ label, value, color = "text-gray-800" }: { label: string, value: string | number, color?: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-lg font-black ${color}`}>{value}</p>
        </div>
    )
}

function ActionsComponent() {
    return <EmptySession desc="Any actions or administrative history for this staff member will appear here." label="No Recent Actions" />
}
