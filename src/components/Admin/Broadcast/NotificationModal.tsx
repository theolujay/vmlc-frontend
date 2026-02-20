import React, { useState } from 'react';
import { Notification } from '../../../types/notificationType';
import { NotificationIcon } from '@/components/ui/SvgAsset/GeneralAsset';
import Spinner from '@/components/ui/spinner/spinner';

// Inline Icons to replace lucide-react and avoid dependency issues
// ... existing icons ...
const CheckCheck = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);
const MoreVertical = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
const ToggleLeft = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
    <circle cx="8" cy="12" r="2" />
  </svg>
);
const ToggleRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
    <circle cx="16" cy="12" r="2" />
  </svg>
);

interface NotificationModalProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkSingleRead: (id: number) => void;
  onClearAll: () => void;
  inAppEnabled: boolean;
  onToggleInApp: () => void;
  isLoading?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onMarkAllRead,
  onMarkSingleRead,
  onClearAll,
  inAppEnabled,
  onToggleInApp,
  isLoading = false
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // const startIndex = (currentPage - 1) * itemsPerPage;

  // const filteredNotifications = notifications.filter(n => {
  //   const type = (n.type || '').toLowerCase();
  //   return type !== 'info' && type !== 'success';
  // });

  // const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  // const currentItems = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = notifications.slice(startIndex, startIndex + itemsPerPage);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);

    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getTimeLabel = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return 'Now';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  };

  const getFullDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div
      className="absolute right-0 left-0 mx-auto md:left-auto md:right-8 top-[80px] w-[95vw] md:w-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-4 duration-300 font-sans"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Notifications</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg transition-all hover:bg-gray-50"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-all hover:bg-gray-50"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">In-App Alerts</span>
                  <button onClick={onToggleInApp} className="text-[#3E4095]">
                    {inAppEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                  </button>
                </div>
                <button
                  onClick={() => { onClearAll(); setSettingsOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size={40} color="#3E4095" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 gap-4">
            <div className="w-24 h-24 bg-[#3E4095]/5 rounded-3xl flex items-center justify-center relative">
              <NotificationIcon className="w-10 h-10 text-[#3E4095]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {/* Groups usually by date */}
            <div className="bg-gray-50/50 px-6 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Today
            </div>
            {currentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.is_read && onMarkSingleRead(item.id)}
                className={`flex items-start justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 ${!item.is_read ? 'bg-[#3E4095]/5' : ''}`}
              >
                <div className="flex-1">
                  <p className={`text-sm ${!item.is_read ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                    {item.message}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{formatTimestamp(item.created_at)}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-tight">{getFullDateLabel(item.created_at)}</p>
                  <p className="text-[9px] font-bold text-gray-400">{getTimeLabel(item.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && notifications.length > 0 && (
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 disabled:opacity-40 border border-gray-200 rounded-lg transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === page ? 'bg-[#3E4095] text-white shadow-md shadow-[#3E4095]/20' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
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
    </div>
  );
};

export default NotificationModal;