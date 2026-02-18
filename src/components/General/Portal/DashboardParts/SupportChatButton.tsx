"use client"
import React, { useState, useEffect } from 'react';
import SupportChat from './SupportChat';
import useGetSupportThread from '@/hooks/useGetSupportThread';

interface SupportChatButtonProps {
    currentStage: string;
    candidateName: string;
}

const SupportChatButton: React.FC<SupportChatButtonProps> = ({ currentStage, candidateName }) => {
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const { unreadCount, markAllAsRead } = useGetSupportThread();

    useEffect(() => {
        if (isSupportOpen) {
            markAllAsRead();
        }
    }, [isSupportOpen, markAllAsRead]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
            {isSupportOpen && (
                <div className="w-[350px] h-[500px] bg-white rounded-[24px] shadow-2xl border border-[#E4E7EC] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    <SupportChat
                        currentStage={currentStage}
                        candidateName={candidateName}
                        onClose={() => setIsSupportOpen(false)}
                    />
                </div>
            )}
            <button
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className={`relative flex items-center gap-2 px-6 py-3.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                    isSupportOpen ? 'bg-[#4A4DA8] text-gray-300' : 'bg-[#3E4095] text-white'
                }`}
            >
                {/* Unread Indicator Dot */}
                {!isSupportOpen && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-600 text-[10px] font-bold text-white shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
                
                {isSupportOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
                <span className="font-bold text-sm tracking-wide">Help?</span>
            </button>
        </div>
    );
};

export default SupportChatButton;
