"use client";
import React from "react";
import AppDialog from "@/components/ui/Modals/AppDialog";
import useGetBroadcastDetail from "@/hooks/useGetBroadcastDetail";
import { BroadcastItemType, DeliveryLogType } from "@/types/BroadCastType";
import { formatDate, formatTimeToString, formatDateTime } from "@/utils/formatFileSize";
import { getUserName } from "@/utils/generalUtils";
import clsx from "clsx";
import Spinner from "../ui/spinner/spinner";

type Props = {
  open: boolean;
  close: (close: boolean) => void;
  broadcast: BroadcastItemType | null;
};

export default function BroadcastDetailsModal({
  open,
  close,
  broadcast: initialBroadcast,
}: Readonly<Props>) {
  const { data: fetchedBroadcast, isPending } = useGetBroadcastDetail(
    initialBroadcast?.id ?? null
  );

  const broadcast = fetchedBroadcast ?? initialBroadcast;

  if (!broadcast) return null;

  const userName =
    broadcast.created_by.full_name ||
    getUserName(
      broadcast.created_by.user?.first_name || "",
      broadcast.created_by.user?.last_name || ""
    );
  const createdDate = formatDate(broadcast.created_at);
  const createdTime = formatTimeToString(broadcast.created_at);

  const statusConfig: Record<string, { color: string, textColor: string, bgColor: string, label: string }> = {
    sent: { color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50", label: "Sent" },
    completed: { color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50", label: "Completed" },
    partial: { color: "bg-amber-500", textColor: "text-amber-700", bgColor: "bg-amber-50", label: "Partial" },
    failed: { color: "bg-rose-500", textColor: "text-rose-700", bgColor: "bg-rose-50", label: "Failed" },
    pending: { color: "bg-gray-400 animate-pulse", textColor: "text-gray-600", bgColor: "bg-gray-100", label: "Pending" },
    in_progress: { color: "bg-blue-400 animate-pulse", textColor: "text-blue-600", bgColor: "bg-blue-100", label: "In Progress" },
  };

  const currentStatus = statusConfig[broadcast.status || ""] || { color: "bg-gray-300", textColor: "text-gray-500", bgColor: "bg-gray-50", label: broadcast.status || "Unknown" };

  const targetRoles = broadcast.target_roles;
  const staffRoles =
    typeof targetRoles === "object" && !Array.isArray(targetRoles)
      ? targetRoles.staff || []
      : [];
  const candidateRoles =
    typeof targetRoles === "object" && !Array.isArray(targetRoles)
      ? targetRoles.candidate || []
      : Array.isArray(targetRoles)
      ? targetRoles
      : [];

  return (
    <AppDialog open={open} onOpenChange={close} className="!max-w-none !max-h-none !w-auto !p-0 bg-transparent shadow-none flex items-center justify-center">
      <div className="flex flex-col bg-[#F7F9FC] w-[95vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative font-sans border border-white/20">

        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095]">
              <i className="fas fa-info-circle text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">Broadcast Details</h1>
              <div className="flex items-center space-x-3 mt-1">
                <div className={clsx("flex items-center space-x-2 px-2.5 py-1 rounded-full border", currentStatus.bgColor, currentStatus.textColor, "border-current/10")}>
                  <span className={clsx("w-1.5 h-1.5 rounded-full", currentStatus.color)}></span>
                  <span className="text-[8px] font-black uppercase tracking-wider">{currentStatus.label}</span>
                </div>
                {isPending && <Spinner className="!w-3 !h-3" />}
              </div>
            </div>
          </div>
          <button
            onClick={() => close(false)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* Left Column: Details & Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Subject Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-4 bg-[#3E4095] rounded-full"></div>
                  <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Subject</h3>
                </div>
                <div className="p-6 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">{broadcast.subject}</h2>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-4 bg-[#3E4095] rounded-full"></div>
                  <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Message Body</h3>
                </div>
                <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3E4095]/10 group-hover:bg-[#3E4095] transition-all duration-500"></div>
                  <p className="text-gray-600 leading-relaxed font-medium text-base whitespace-pre-wrap">
                    {broadcast.message}
                  </p>
                </div>
              </div>

              {/* Delivery Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConfigMetric
                  icon="fa-paper-plane"
                  label="Delivery Status"
                  value={currentStatus.label}
                  sub={`Attempted on ${broadcast.mediums.length} channels`}
                  bg={currentStatus.bgColor}
                  color={currentStatus.textColor}
                />
                <ConfigMetric
                  icon="fa-users"
                  label="Target Audience"
                  value={`${(staffRoles?.length || 0) + (candidateRoles?.length || 0)} Roles`}
                  sub={`${staffRoles?.length || 0} Staff, ${candidateRoles?.length || 0} Candidates`}
                />
              </div>

              {/* Delivery Channels */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-4 bg-[#3E4095] rounded-full"></div>
                  <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Delivery Channels</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {broadcast.mediums.map((medium, index) => (
                    <div key={index} className={clsx(
                      "flex items-center gap-2.5 px-5 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all",
                      getMediumStyles(medium)
                    )}>
                      <i className={clsx("fas", getMediumIcon(medium))}></i>
                      <span>{medium}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles Detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staffRoles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Staff Recipients</h4>
                    <div className="flex flex-wrap gap-2">
                      {staffRoles.map((role, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-widest">{role}</span>
                      ))}
                    </div>
                  </div>
                )}
                {candidateRoles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Candidate Recipients</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidateRoles.map((role, i) => (
                        <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg text-[9px] font-black uppercase tracking-widest">{role}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Timeline & Meta */}
            <div className="space-y-8">
              {/* Timeline Section */}
              <div className="space-y-5">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-4 bg-[#3E4095] rounded-full"></div>
                  <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timeline</h3>
                </div>
                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                  <TimelineEvent
                    icon="fa-clock"
                    label="Created At"
                    date={`${createdDate}, ${createdTime}`}
                    color="text-[#3E4095]"
                    isLast={!broadcast.last_attempt}
                  />
                  {broadcast.last_attempt && (
                    <TimelineEvent
                      icon="fa-paper-plane"
                      label="Last Attempt"
                      date={formatDateTime(broadcast.last_attempt)}
                      color="text-emerald-500"
                      isLast={true}
                    />
                  )}
                </div>
              </div>

              {/* Author Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-4 bg-[#3E4095] rounded-full"></div>
                  <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Author</h3>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#3E4095] flex items-center justify-center text-white shadow-lg shadow-[#3E4095]/20 font-black text-lg">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 tracking-tight">{userName}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{broadcast.created_by.role || 'Staff Member'}</p>
                  </div>
                </div>
              </div>

              {/* Task ID / Technical Meta */}
              {broadcast.task_id && (
                <div className="p-6 bg-gray-800 rounded-[1.5rem] shadow-xl space-y-2">
                   <p className="text-[7px] font-black text-gray-500 uppercase tracking-[0.2em]">Background Task ID</p>
                   <code className="text-[10px] text-emerald-400 font-mono break-all opacity-80">{broadcast.task_id}</code>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Delivery Logs Table */}
          {broadcast.logs && broadcast.logs.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-900 text-white font-black shadow-lg">
                    <i className="fas fa-list-ul"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-800 tracking-tight">Delivery Logs</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Detailed per-channel status</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {broadcast.logs.length} Total Logs
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Medium</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Target Role</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Result</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Attempted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {broadcast.logs.map((log: DeliveryLogType, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className={clsx("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-current/10", getMediumStyles(log.medium))}>
                            <i className={clsx("fas", getMediumIcon(log.medium))}></i>
                            {log.medium}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                             <span className="text-xs font-black text-gray-800 capitalize">{log.target_role}</span>
                             <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{log.role_type}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className={clsx("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                             log.status === 'sent' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                           )}>
                             <span className={clsx("w-1 h-1 rounded-full", log.status === 'sent' ? 'bg-emerald-500' : 'bg-rose-500')}></span>
                             {log.status}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-medium text-gray-500">{log.message}</span>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-bold text-gray-400">
                          {formatDateTime(log.attempted_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-white border-t border-gray-100 flex justify-end sticky bottom-0 z-30">
          <button
            type="button"
            onClick={() => close(false)}
            className="px-12 py-3.5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            Close View
          </button>
        </div>
      </div>
    </AppDialog>
  );
}

function ConfigMetric({ icon, label, value, sub, bg, color }: { icon: string, label: string, value: string, sub: string, bg?: string, color?: string }) {
  return (
    <div className="flex items-center space-x-4 p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner",
        bg || "bg-gray-50",
        color || "text-[#3E4095]"
      )}>
        <i className={`fas ${icon} text-lg`}></i>
      </div>
      <div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-0.5">{label}</p>
        <h4 className="text-lg font-black text-gray-900 tracking-tight">{value}</h4>
        <p className="text-[9px] font-semibold text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function TimelineEvent({ icon, label, date, color, isLast }: { icon: string, label: string, date: string, color: string, isLast: boolean }) {
  return (
    <div className="relative flex items-center space-x-4 group">
      {!isLast && (
        <div className="absolute left-[17px] top-10 bottom-[-32px] w-[1.5px] bg-gray-100 z-0"></div>
      )}
      <div className={clsx(
        "w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 z-10 transition-all duration-300 group-hover:scale-110",
        color
      )}>
        <i className={`fas ${icon} text-xs`}></i>
      </div>
      <div className="flex flex-col">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-black text-gray-800 mt-0.5 tracking-tight">{date}</p>
      </div>
    </div>
  );
}

function getMediumStyles(medium: string) {
  switch (medium) {
    case 'platform':
      return 'bg-[#EEF4FF] text-[#3538CD] border-[#3538CD]/10';
    case 'email':
      return 'bg-[#F9F5FF] text-[#6941C6] border-[#6941C6]/10';
    case 'sms':
      return 'bg-[#FDF2FA] text-[#C11574] border-[#C11574]/10';
    case 'whatsapp':
      return 'bg-emerald-50 text-emerald-600 border-emerald-600/10';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

function getMediumIcon(medium: string) {
  switch (medium) {
    case 'platform': return 'fa-desktop';
    case 'email': return 'fa-envelope';
    case 'sms': return 'fa-comment-alt';
    case 'whatsapp': return 'fa-whatsapp';
    default: return 'fa-share';
  }
}
