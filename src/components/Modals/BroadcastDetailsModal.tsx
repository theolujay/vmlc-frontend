"use client";
import AppDialog from '@/components/ui/Modals/AppDialog';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import useGetBroadcastDetail from '@/hooks/useGetBroadcastDetail';
import { BroadcastItemType } from '@/types/BroadCastType';
import { formatDate, formatTimeToString } from '@/utils/formatFileSize';
import { getUserName } from '@/utils/generalUtils';
import clsx from 'clsx';
import Spinner from '../ui/spinner/spinner';

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
  // Fetch fresh broadcast details to get updated status
  const { data: fetchedBroadcast, isPending } = useGetBroadcastDetail(
    initialBroadcast?.id ?? null
  );

  // Use fetched data if available, otherwise fall back to initial data
  const broadcast = fetchedBroadcast ?? initialBroadcast;

  if (!broadcast) return null;

  const userName = getUserName(
    broadcast.created_by.user?.first_name || '',
    broadcast.created_by.user?.last_name || ''
  );
  const createdDate = formatDate(broadcast.created_at);
  const createdTime = formatTimeToString(broadcast.created_at);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getMediumColor = (medium: string) => {
    switch (medium) {
      case 'platform':
        return 'bg-[#EEF4FF] text-[#3538CD]';
      case 'email':
        return 'bg-[#F9F5FF] text-[#6941C6]';
      case 'sms':
        return 'bg-[#FDF2FA] text-[#C11574]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Parse target_roles - handle both object and array formats for backward compatibility
  const targetRoles = broadcast.target_roles;
  const staffRoles =
    typeof targetRoles === 'object' && !Array.isArray(targetRoles)
      ? targetRoles.staff || []
      : [];
  const candidateRoles =
    typeof targetRoles === 'object' && !Array.isArray(targetRoles)
      ? targetRoles.candidate || []
      : Array.isArray(targetRoles)
      ? targetRoles
      : [];

  return (
    <AppDialog open={open} onOpenChange={close}>
      <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col gap-2 max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="header rounded-tl-md rounded-tr-md bg-white p-4 shadow-sm flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Broadcast Details</h2>
          <div className="flex items-center gap-2">
            {isPending && <Spinner />}
            <span
              className={clsx(
                'px-3 py-1 rounded-full text-sm font-medium capitalize',
                getStatusColor(broadcast.status)
              )}
            >
              {broadcast.status || 'pending'}
            </span>
          </div>
        </div>
        <div className="p-2 overflow-y-auto">
          <ResponsiveContainer className="rounded-md p-4">
            <div className="flex flex-col gap-4">
              {/* Subject */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">
                  SUBJECT
                </span>
                <p className="text-lg font-semibold">{broadcast.subject}</p>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">
                  MESSAGE
                </span>
                <p className="text-base whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {broadcast.message}
                </p>
              </div>

              {/* Sent By */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">
                  SENT BY
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3E4095] text-white flex items-center justify-center text-sm font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {broadcast.created_by.role || 'Staff'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">
                  DATE & TIME
                </span>
                <p className="text-base">
                  {createdDate} at {createdTime}
                </p>
              </div>

              {/* Mediums */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">
                  DELIVERY MEDIUMS
                </span>
                <div className="flex gap-2 flex-wrap">
                  {broadcast.mediums.map((medium, index) => (
                    <span
                      key={`medium-${index}`}
                      className={clsx(
                        'px-3 py-1 rounded-full text-sm font-medium capitalize',
                        getMediumColor(medium)
                      )}
                    >
                      {medium}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Roles */}
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-500 font-medium">
                  TARGET ROLES
                </span>
                <div className="flex flex-col gap-3">
                  {staffRoles.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 uppercase">
                        Staff
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {staffRoles.map((role, index) => (
                          <span
                            key={`staff-${index}`}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {candidateRoles.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 uppercase">
                        Candidates
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {candidateRoles.map((role, index) => (
                          <span
                            key={`candidate-${index}`}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Stats */}
              {broadcast.delivery_attempts !== undefined && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500 font-medium">
                    DELIVERY ATTEMPTS
                  </span>
                  <p className="text-base font-semibold">
                    {broadcast.delivery_attempts}
                  </p>
                </div>
              )}

              {/* Delivery Logs */}
              {broadcast.delivery_logs &&
                broadcast.delivery_logs.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      DELIVERY LOGS
                    </span>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left p-2 font-medium">Email</th>
                            <th className="text-left p-2 font-medium">
                              Medium
                            </th>
                            <th className="text-left p-2 font-medium">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {broadcast.delivery_logs.map((log, index) => (
                            <tr
                              key={`log-${index}`}
                              className="border-t border-gray-100"
                            >
                              <td className="p-2 truncate max-w-[150px]">
                                {log.user_email}
                              </td>
                              <td className="p-2 capitalize">{log.medium}</td>
                              <td className="p-2">
                                <span
                                  className={clsx(
                                    'px-2 py-0.5 rounded text-xs font-medium',
                                    log.status === 'success'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  )}
                                >
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Task ID */}
              {broadcast.task_id && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500 font-medium">
                    TASK ID
                  </span>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {broadcast.task_id}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="px-6 py-2 rounded-lg font-semibold cursor-pointer bg-[#3E4095] text-white"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      </div>
    </AppDialog>
  );
}
